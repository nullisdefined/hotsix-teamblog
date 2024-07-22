import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    private likesService: LikesService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
  ) {}

  @InjectRepository(Article) private articleRepository: Repository<Article>;

  async getArticle(articleId: number, userId: number): Promise<any> {
    const article: Article = await this.articleRepository.findOne({
      relations: ['user'],
      where: { articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const likes: number = await this.likesService.getLikesCount({ where: { articleId } });
    const comments: Comment[] = await this.commentsService.findByFields({
      select: ['commentId', 'userId', 'comment', 'createdAt'],
      relations: ['user'],
      where: { articleId },
    });

    const typedComments: ArticleDetailCommentType[] = this.commentsService.changeToResponseType(comments);
    const isliked: boolean = await this.likesService.checkIfUserLiked(userId, articleId);

    return {
      articleId: article.articleId,
      userId: article.userId,
      thumb: article.thumb,
      title: article.title,
      nickname: article.user.nickname,
      profileImg: article.user.profileImage,
      content: article.content,
      createdAt: article.createdAt,
      comments: typedComments,
      likes,
      status: article.status,
      liked: isliked,
    };
  }

  async create(articleDto: ArticleDto, userId: number): Promise<void> {
    const typedArticle: Article = this.articleRepository.create({ ...articleDto, userId: userId });
    await this.articleRepository.save(typedArticle);
  }

  async update(articleId: number, articleDto: ArticleDto): Promise<void> {
    let article: Article = await this.findOne(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article = { ...article, ...articleDto };
    await this.articleRepository.save(article);
  }

  async delete(articleId: number): Promise<ResponseMessage> {
    const article: Article = await this.findOne(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.articleRepository.remove(article);

    return {
      message: '게시글 삭제 완료',
    };
  }

  async findOne(articleId: number): Promise<Article> {
    return await this.articleRepository.findOne({ where: { articleId } });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Article[]; totalCount: number; currentPage: number; totalPages: number }> {
    const [articles, totalCount] = await this.articleRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: articles,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}
