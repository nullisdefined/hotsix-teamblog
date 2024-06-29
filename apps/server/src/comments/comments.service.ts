import { Injectable } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(private readonly jwtService: JwtService) {}

  @InjectRepository(Comment) private commentRepository: Repository<Comment>;
  @InjectRepository(Article) private articleRepository: Repository<Article>;

  async create(articleId: number, commentDto: CommentDto, req: any) {
    const article = await this.articleRepository.findOne({ where: { articleId: articleId } });

    if (!article) {
      throw new Error('해당 게시글이 없습니다.');
    }

    const token = await req.cookies['access_token'];

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    const typedComment = this.commentRepository.create({ ...commentDto, articleId: articleId, userId: id });

    console.log(typedComment);

    await this.commentRepository.save(typedComment);
    return {
      message: '댓글 작성 완료',
    };
  }

  async update(commentId: number, commentDto: CommentDto, req: any) {
    const comment = await this.commentRepository.findOne({ where: { commentId: commentId } });

    if (!comment) {
      throw new Error('해당 댓글이 없습니다.');
    }

    const token = await req.cookies['access_token'];

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    if (comment.userId !== id) {
      throw new Error('사용자의 댓글이 아닙니다.');
    }

    comment.comment = commentDto.comment;

    await this.commentRepository.save(comment);
    return {
      message: '댓글 수정 완료',
    };
  }

  async delete(commentId: number, req: any) {
    const comment = await this.commentRepository.findOne({ where: { commentId: commentId } });

    if (!comment) {
      throw new Error('해당 댓글이 없습니다.');
    }

    const token = await req.cookies['access_token'];

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    if (comment.userId !== id) {
      throw new Error('사용자의 댓글이 아닙니다.');
    }

    await this.commentRepository.remove(comment);
    return {
      message: '댓글 삭제 완료',
    };
  }
}
