import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { Like } from 'src/entities/like.entity';
import { LikesService } from 'src/likes/likes.service';
import { CommentsService } from 'src/comments/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Comment, Like])],
  controllers: [ArticlesController],
  providers: [ArticlesService, LikesService, CommentsService],
})
export class ArticlesModule {}
