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
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { DriveModule } from './drive/drive.module';

@Module({
  imports: [
    // serve-static
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'), // '/client/dist'를 루트 디렉터리로 static 파일을 제공
    }),
    // typrorm
    TypeOrmModule.forRoot(typeORMConfig),
    // config
    ConfigModule.forRoot({
      envFilePath: `./src/configs/env/.${process.env.NODE_ENV || 'development'}.env`,
      isGlobal: true, // 다른 모듈에서도 전역으로 동작
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // 465를 사용할 경우 true로 설정
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
    ArticlesModule,
    CommentsModule,
    LikesModule,
    DriveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
