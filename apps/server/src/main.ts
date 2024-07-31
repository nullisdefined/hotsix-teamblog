import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  process.env.NODE_ENV =
    process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() == 'production' ? 'production' : 'development';

  console.log(`* environment: ${process.env.NODE_ENV}`);

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // CORS 설정 추가
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

  const port = configService.get('PORT');
  await app.listen(port, '0.0.0.0');

  const serverUrl = configService.get('SERVER_URL') || `http://localhost:${port}`;
  console.log(`Application is running on: ${serverUrl}`);
  console.log(`Database name: ${configService.get('DB_NAME')}`);
}
bootstrap();
