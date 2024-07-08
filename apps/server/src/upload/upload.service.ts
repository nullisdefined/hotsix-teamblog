import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { join } from 'path';

// const keyFilePath = join(process.cwd(), 'dist', 'configs', 'superb-app-428715-m2-70554e73216e.json');
@Injectable()
export class UploadService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    this.bucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucket);
    const blob = bucket.file(`${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => reject(error));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }
}
