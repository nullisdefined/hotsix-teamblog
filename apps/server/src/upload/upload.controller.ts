import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 구글 스토리지에 파일 업로드 -> URL 반환
   */
  @Post()
  // @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('이미지 파일(jpg, jpeg, png, gif)만 업로드 가능합니다.'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    try {
      const url = await this.uploadService.uploadFile(file);
      return { url };
    } catch (error) {
      console.error('파일 업로드 실패: ', error);
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('파일 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  }
}
