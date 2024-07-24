import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  process.env.NODE_ENV =
    process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() == 'production' ? 'production' : 'development';

  console.log(`* environment: ${process.env.NODE_ENV}`);

  const app = await NestFactory.create(AppModule);

  // CORS 설정 추가
  const configService = app.get(ConfigService);
  const corsOptions = {
    origin: configService.get('CORS_ORIGIN') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  await app.listen(configService.get('PORT'), '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Database name: ${configService.get('DB_NAME')}`);
}
bootstrap();
