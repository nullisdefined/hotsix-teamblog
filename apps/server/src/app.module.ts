import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? `/app/configs/env/.production.env`
          : `./src/configs/env/.development.env`,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: process.env.NODE_ENV === 'production' ? '/app/public' : join(__dirname, '../..', 'client', 'dist'),
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.FROM_EMAIL_USER,
          pass: process.env.FROM_EMAIL_PASS,
        },
      },
      defaults: {
        from: '"Hotsix-Blog" <hotsixblog@gmail.com>',
      },
    }),
    UsersModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
