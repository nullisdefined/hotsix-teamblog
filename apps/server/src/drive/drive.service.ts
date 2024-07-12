import { Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
// import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class DriveService {
  private drive: drive_v3.Drive;

  constructor() {
    // const auth = new google.auth.GoogleAuth({
    //   keyFile: 'service-account.json',
    //   scopes: ['https://www.googleapis.com/auth/drive.file'],
    // });

    // const keyFile = this.configService.get<string>('GOOGLE_DRIVE_API_KEYFILE_PATH');
    // const keyFilePath = join(process.cwd(), keyFile); // process.cwd()를 사용하여 절대 경로로 접근합니다.
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_DRIVE_API_KEYFILE_PATH,
      scopes: ['https://www.googleapis.com/auth/drive.file'], // 권한
    });
    this.drive = google.drive({ version: 'v3', auth });
  }

  async listFiles(folderId: string) {
    const res = await this.drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name, mimeType)',
    });
    console.log(res.data.files);
    return res.data.files;
  }

  async getFile(fileId: string) {
    const res = await this.drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
    return res.data;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileMetadata = {
      name: file.originalname,
      parents: ['1QkMEs_jMcZRNxio_rqoFhG4ixnx0XNuX'],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const uploadedFile = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id', // 반환할 필드 (데이터베이스에 저장할 파일아이디 필요)
    });

    // 임시 파일 삭제(server/uploads/files)
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Failed to delete temporary file:', err);
      } else {
        console.log('Temporary file deleted successfully');
      }
    });

    return uploadedFile.data.id;
  }
}
