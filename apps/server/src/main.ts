import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  process.env.NODE_ENV =
    process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() == 'production' ? 'production' : 'development';
  // const envFilePath =
  //   process.env.NODE_ENV === 'production'
  //     ? path.join(__dirname, '/app/configs/env/.production.env')
  //     : path.join(__dirname, '../src/configs/env/.development.env');
  // dotenv.config({ path: envFilePath });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );
  const configService = app.get(ConfigService);
  console.log(configService.get('GOOGLE_CLOUD_PROJECT_ID'));
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
