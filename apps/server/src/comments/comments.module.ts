import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Article]),
    JwtModule.register({
      secret: 'Secret', // 오픈되어선 안되는 정보 -> 따로 빼야됨
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
