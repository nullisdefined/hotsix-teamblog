import { Injectable } from '@nestjs/common';
import { ArticleDto } from './dto/article.dto';
import { Article } from 'src/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Like } from 'src/entities/like.entity';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class ArticlesService {
  constructor(private readonly jwtService: JwtService) {}

  @InjectRepository(Article) private articleRepository: Repository<Article>;
  @InjectRepository(Comment) private commentRepository: Repository<Comment>;
  @InjectRepository(Like) private likeRepository: Repository<Like>;

  async getDetail(articleId: number) {

    // 로그인 확인

    // article, user.nickname, photos정보 가져오기
    const [article] = await this.articleRepository.find({
      select: {
        title: true,
        description: true,
        content: true,
        createdAt: true,
        status: true,
        user: {
          nickname: true,
        },
        photos: {
          fileName: true,
        },
      },
      relations: {
        user: true,
        photos: true,
      },
      where: {
        articleId: articleId,
      },
    });

    if (!article) {
      throw new Error('해당 게시글이 없습니다.');
    }

    //좋아요 수와 댓글정보 가져오기
    const likes = await this.likeRepository.count({ where: { articleId: articleId } });
    const comments = await this.commentRepository.find({
      select: {
        comment: true,
        createdAt: true,
        user: {
          nickname: true,
        },
      },
      relations: {
        user: true,
      },
      where: { articleId: articleId },
    });

    // 댓글데이터 response 형식으로 변환
    const typedComments = comments.map((value) => ({
      nickname: value.user.nickname,
      comment: value.comment,
      createdAt: value.createdAt,
    }));

    // photos정보 response 형식으로 변환
    const typedPhotos: string[] = [];
    article.photos.forEach((value) => {
      typedPhotos.push(value.fileName);
    });

    return {
      title: article.title,
      nickname: article.user.nickname,
      profileImg: typedPhotos,
      content: article.content,
      createdAt: article.createdAt,
      comments: typedComments,
      likes: likes,
      status: article.status,
    };
  }

  async create(articleDto: ArticleDto, req: any) {
    // 로그인여부 확인 + jwt토큰 확인 + userId 확인
    const token = await req.cookies['access_token'];
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    // DB에 insert
    const typedArticle = this.articleRepository.create({ ...articleDto, userId: id });
    await this.articleRepository.save(typedArticle);

    return {
      message: '게시글 생성 완료',
    };
  }

  async update(articleId: number, articleDto: ArticleDto, req: any) {
    // 개시글 존재 여부 확인
    let article = await this.articleRepository.findOne({ where: { articleId: articleId } });
    if (!article) {
      throw new Error('해당 게시글이 없습니다.');
    }

    // 로그인여부 확인 + jwt토큰 확인 + userId 확인
    const token = await req.cookies['access_token'];
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    // 사용자가 작성한 개시글인지 확인
    if (article.userId !== id) {
      throw new Error('사용자의 게시글이 아닙니다.');
    }

    // DB에 update
    article = { ...article, ...articleDto };
    await this.articleRepository.save(article);

    return {
      message: '게시글 수정 완료',
    };
  }

  async delete(articleId: number, req: any) {
    // 개시글 존재 여부 확인
    const article = await this.articleRepository.findOne({ where: { articleId: articleId } });
    if (!article) {
      throw new Error('해당 게시글이 없습니다.');
    }

    // 로그인여부 확인 + jwt토큰 확인 + userId 확인
    const token = await req.cookies['access_token'];
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    // 사용자가 작성한 개시글인지 확인
    if (article.userId !== id) {
      throw new Error('사용자의 게시글이 아닙니다.');
    }

    // DB에 delete
    await this.articleRepository.remove(article);

    return {
      message: '게시글 삭제 완료',
    };
  }
}
