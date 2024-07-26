import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private storage: Storage;
  private bucket: string;
  private logger = new Logger(UploadService.name);

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    this.bucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  }

  private sanitizeFileName(fileName: string): string {
    const extension = path.extname(fileName);
    const sanitizedName = uuidv4();
    return `${sanitizedName}${extension}`;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucket);
    const sanitizedFileName = this.sanitizeFileName(file.originalname);
    const blob = bucket.file(`${Date.now()}-${sanitizedFileName}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    this.logger.log(`Attempting to upload file: ${file.originalname} as ${sanitizedFileName}`);

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        this.logger.error(`Error uploading file: ${file.originalname}`, error.stack);
        reject(error);
      });
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        this.logger.log(`File uploaded successfully: ${publicUrl}`);
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }
}
