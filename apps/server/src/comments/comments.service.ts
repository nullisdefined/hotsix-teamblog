import { Injectable } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { ArticleDetailCommentType } from 'src/types/type';

@Injectable()
export class CommentsService {
  constructor(private readonly jwtService: JwtService) {}

  @InjectRepository(Comment) private commentRepository: Repository<Comment>;
  @InjectRepository(Article) private articleRepository: Repository<Article>;

  async create(articleId: number, commentDto: CommentDto, req: any) {
    // 게시글 존재 여부 확인
    const article = await this.articleRepository.findOne({ where: { articleId: articleId } });
    if (!article) {
      throw new Error('해당 게시글이 없습니다.');
    }

    // 로그인여부 확인 + jwt토큰 확인 + userId 확인
    const token = await req.cookies['access_token'];
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    // DB에 insert
    const typedComment = this.commentRepository.create({ ...commentDto, articleId: articleId, userId: id });
    await this.commentRepository.save(typedComment);

    return {
      message: '댓글 작성 완료',
    };
  }

  async update(commentId: number, commentDto: CommentDto, req: any) {
    // 댓글 존재 여부 확인
    const comment = await this.commentRepository.findOne({ where: { commentId: commentId } });
    if (!comment) {
      throw new Error('해당 댓글이 없습니다.');
    }

    // 로그인여부 확인 + jwt토큰 확인 + userId 확인
    const token = await req.cookies['access_token'];
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    // 사용자가 작성한 댓글인지 확인
    if (comment.userId !== id) {
      throw new Error('사용자의 댓글이 아닙니다.');
    }

    // DB에 update
    comment.comment = commentDto.comment;
    await this.commentRepository.save(comment);

    return {
      message: '댓글 수정 완료',
    };
  }

  async delete(commentId: number, req: any) {
    // 댓글 존재 여부 확인
    const comment = await this.commentRepository.findOne({ where: { commentId: commentId } });
    if (!comment) {
      throw new Error('해당 댓글이 없습니다.');
    }

    // 로그인여부 확인 + jwt토큰 확인 + userId 확인
    const token = await req.cookies['access_token'];
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    // 사용자가 작성한 댓글인지 확인
    if (comment.userId !== id) {
      throw new Error('사용자의 댓글이 아닙니다.');
    }

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
}
