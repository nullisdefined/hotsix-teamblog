import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ArticleDto } from './dto/article.dto';
import { Article } from 'src/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikesService } from 'src/likes/likes.service';
import { CommentsService } from 'src/comments/comments.service';
import { ArticleDetailCommentType, DetailResponse, ResponseMessage } from 'src/types/type';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class ArticlesService {
  constructor(
    private likesservice: LikesService,
    private commentsservice: CommentsService,
  ) {}

  @InjectRepository(Article) private articleRepository: Repository<Article>;

  async getDetail(articleId: number): Promise<DetailResponse> {
    // article, user.nickname, photos정보 가져오기
    const [article]: Article[] = await this.articleRepository.find({
      relations: ['user', 'photos'],
      where: { articleId },
    });

    if (!article) {
      throw new NotFoundException('해당 게시글이 없습니다.');
    }

    //좋아요 수와 댓글정보 가져오기
    const likes: number = await this.likesservice.getLikesCount({ where: { articleId } });
    const comments: Comment[] = await this.commentsservice.findByFields({
      select: ['comment', 'createdAt'],
      relations: ['user'],
      where: { articleId },
    });

    // 댓글데이터 response 형식으로 변환
    const typedComments: ArticleDetailCommentType[] = this.commentsservice.changeToResponseType(comments);

    // photos정보 response 형식으로 변환
    const typedPhotos = article.photos.map((photo) => photo.fileName);

    return {
      title: article.title,
      nickname: article.user.nickname,
      profileImg: typedPhotos,
      content: article.content,
      createdAt: article.createdAt,
      comments: typedComments,
      likes,
      status: article.status,
    };
  }

  async create(articleDto: ArticleDto, userId: number): Promise<ResponseMessage> {
    // DB에 insert
    const typedArticle: Article = this.articleRepository.create({ ...articleDto, userId: userId });
    await this.articleRepository.save(typedArticle);

    return {
      message: '게시글 생성 완료',
    };
  }

  async update(articleId: number, articleDto: ArticleDto, userId: number): Promise<ResponseMessage> {
    // 개시글 존재 여부 확인
    let article: Article = await this.articleRepository.findOne({ where: { articleId: articleId } });
    if (!article) {
      throw new NotFoundException('해당 게시글이 없습니다.');
    }

    // 사용자가 작성한 개시글인지 확인
    if (article.userId !== userId) {
      throw new UnauthorizedException('사용자의 게시글이 아닙니다.');
    }

    // DB에 update
    article = { ...article, ...articleDto };
    await this.articleRepository.save(article);

    return {
      message: '게시글 수정 완료',
    };
  }

  async delete(articleId: number, userId: number): Promise<ResponseMessage> {
    // 개시글 존재 여부 확인
    const article: Article = await this.articleRepository.findOne({ where: { articleId: articleId } });
    if (!article) {
      throw new NotFoundException('해당 게시글이 없습니다.');
    }

    // 사용자가 작성한 개시글인지 확인
    if (article.userId !== userId) {
      throw new UnauthorizedException('사용자의 게시글이 아닙니다.');
    }

    // DB에 delete
    await this.articleRepository.remove(article);

    return {
      message: '게시글 삭제 완료',
    };
  }
}
