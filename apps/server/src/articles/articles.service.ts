import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArticleDto } from './dto/article.dto';
import { Article } from 'src/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikesService } from 'src/likes/likes.service';
import { CommentsService } from 'src/comments/comments.service';
import { ArticleDetailCommentType, DetailResponse, ResponseMessage } from 'src/types/type';
import { Comment } from 'src/entities/comment.entity';
import { MainArticleList } from './dto/mainArticleList.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private likesservice: LikesService,
    @Inject(forwardRef(() => CommentsService))
    private commentsservice: CommentsService,
  ) {}

  @InjectRepository(Article) private articleRepository: Repository<Article>;

  async getDetail(articleId: number): Promise<DetailResponse> {
    // article, user.nickname, photos정보 가져오기
    const article: Article = await this.findOne(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
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

    return {
      article,
      comments: typedComments,
      likes,
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

  async update(articleId: number, articleDto: ArticleDto): Promise<ResponseMessage> {
    // 개시글 존재 여부 확인
    let article: Article = await this.findOne(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // DB에 update
    article = { ...article, ...articleDto };
    await this.articleRepository.save(article);

    return {
      message: '게시글 수정 완료',
    };
  }

  async delete(articleId: number): Promise<ResponseMessage> {
    const article: Article = await this.findOne(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // DB에 delete
    await this.articleRepository.remove(article);

    return {
      message: '게시글 삭제 완료',
    };
  }

  async articleList(currentPage: number = 1): Promise<MainArticleList> {
    const pageSize = 6;

    const skip = (currentPage - 1) * pageSize;
    const articles: Article[] = await this.articleRepository.find({
      order: {
        updatedAt: 'DESC',
      },
      take: 6,
      skip,
    });

    const totalArticles = await this.totalArticles();
    const totalPages = Math.round(totalArticles / pageSize);

    return {
      articles,
      pagination: {
        totalArticles,
        currentPage,
        totalPages,
        pageSize,
      },
    };
  }

  async findOne(articleId: number): Promise<Article> {
    return await this.articleRepository.findOne({ where: { articleId } });
  }

  async totalArticles() {
    return await this.articleRepository.count();
  }
}
