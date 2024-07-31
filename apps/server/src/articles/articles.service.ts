import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  ): Promise<{ data: any[]; totalCount: number; currentPage: number; totalPages: number }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Invalid page or limit value');
    }

    const [articles, totalCount] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.likes', 'likes')
      .leftJoinAndSelect('article.comments', 'comments')
      .where('article.status = :status', { status: 1 }) // 여기서 공개 글만 필터링
      .select(['article', 'user.userId', 'user.nickname', 'user.profileImage', 'likes', 'comments'])
      .orderBy('article.createdAt', 'DESC')
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();

    const articlesWithDetails = articles.map((article) => ({
      ...article,
      nickname: article.user.nickname,
      profileImg: article.user.profileImage,
      likes: article.likes.length,
      commentCount: article.comments.length,
    }));

    return {
      data: articlesWithDetails,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    };
  }

  async findAllByUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; totalCount: number; currentPage: number; totalPages: number }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    // console.log(userId);

    if (isNaN(pageNumber) || isNaN(limitNumber) || isNaN(userId)) {
      throw new BadRequestException('Invalid page, limit, or userId value');
    }

    const [articles, totalCount] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.likes', 'likes')
      .leftJoinAndSelect('article.comments', 'comments')
      .where('article.userId = :userId', { userId })
      .select(['article', 'user.userId', 'user.nickname', 'user.profileImage', 'likes', 'comments'])
      .orderBy('article.createdAt', 'DESC')
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();

    const articlesWithDetails = articles.map((article) => ({
      ...article,
      nickname: article.user.nickname,
      profileImg: article.user.profileImage,
      likes: article.likes.length,
      commentCount: article.comments.length,
    }));

    return {
      data: articlesWithDetails,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    };
  }
}
