import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { ArticleDetailCommentType, ResponseMessage } from 'src/types/type';
import { ArticlesService } from 'src/articles/articles.service';
import { Article } from 'src/entities/article.entity';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(forwardRef(() => ArticlesService))
    private readonly articlesService: ArticlesService,
  ) {}

  @InjectRepository(Comment) private commentRepository: Repository<Comment>;

  async create(articleId: number, commentDto: CommentDto, userId: number): Promise<ResponseMessage> {
    const article: Article = await this.articlesService.findOne(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }
    // DB에 insert
    const typedComment: Comment = this.commentRepository.create({ ...commentDto, articleId, userId });
    await this.commentRepository.save(typedComment);

    return {
      message: '댓글 작성 완료',
    };
  }

  async update(commentId: number, commentDto: CommentDto): Promise<ResponseMessage> {
    const comment: Comment = await this.findOne(commentId);

    // DB에 update
    comment.comment = commentDto.comment;
    await this.commentRepository.save(comment);

    return {
      message: '댓글 수정 완료',
    };
  }

  async delete(commentId: number): Promise<ResponseMessage> {
    const comment: Comment = await this.findOne(commentId);

    // DB에 delete
    await this.commentRepository.remove(comment);

    return {
      message: '댓글 삭제 완료',
    };
  }

  async findByFields(options: FindOneOptions<Comment>): Promise<Comment[] | undefined> {
    return await this.commentRepository.find(options);
  }

  changeToResponseType(comments: Comment[]): ArticleDetailCommentType[] {
    return comments.map((value) => ({
      nickname: value.user.nickname,
      comment: value.comment,
      createdAt: value.createdAt,
    }));
  }

  async findOne(commentId: number): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { commentId } });
  }
}
