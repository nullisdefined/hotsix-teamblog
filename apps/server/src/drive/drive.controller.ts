import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DriveService } from './drive.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Get('files/:folderId')
  async listFiles(@Param('folderId') folderId: string) {
    return this.driveService.listFiles(folderId);
  }

  @Get('file/:fileId')
  async getFile(@Param('fileId') fileId: string, @Res() res: Response) {
    const fileStream = await this.driveService.getFile(fileId);
    res.setHeader('Content-Type', 'image/jpeg');
    fileStream.pipe(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  //   @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() })) 이 경우 server/typings.d.ts파일에 buffer: Buffer; 설정
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    const fileId = await this.driveService.uploadFile(file);
    return { fileId };
  }
}
