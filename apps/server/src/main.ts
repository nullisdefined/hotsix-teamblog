import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api'); // 서버로 들어오는 모든 요청 URL 맨 앞에 'api'를 붙임
  app.useStaticAssets(join(__dirname, '..', 'public')); // index.html파일 테스트를 위한 코드
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );
  await app.listen(4000);
}
bootstrap();
