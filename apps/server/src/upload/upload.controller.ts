import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Controller('upload')
export class UploadController {
  private logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

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

    this.logger.log(`Received file upload request: ${file.originalname}`);

    try {
      const url = await this.uploadService.uploadFile(file);
      this.logger.log(`File uploaded successfully: ${url}`);
      return { url };
    } catch (error) {
      this.logger.error(`File upload failed: ${file.originalname}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
      }
    }
  }
}
