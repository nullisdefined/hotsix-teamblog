import { Injectable } from '@nestjs/common';
import { ArticleDto } from './dto/create.dto';
import { Article } from 'src/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Like } from 'src/entities/like.entity';
import { Comment } from 'src/entities/comment.entity';
import { Photo } from 'src/entities/photo.entity';

@Injectable()
export class ArticlesService {
  constructor(private readonly jwtService: JwtService) { }

  @InjectRepository(Article) private articleRepository: Repository<Article>;
  @InjectRepository(Comment) private commentRepository: Repository<Comment>;
  // @InjectRepository(Like) private likeRepository: Repository<Like>;
  // @InjectRepository(Photo) private photoRepository: Repository<Photo>;

  async getDetail(articleId: number) {
    const article = await this.articleRepository.findOne({ where: { articleId: articleId } });

    if (!article) {
      throw new Error('해당 게시글이 없습니다.');
    }

    const comments: Comment[] = await this.commentRepository.find({ where: { articleId: articleId } });
    // const likes = await this.likeRepository.find({ where: { articleId: articleId } });

    console.log(comments);

    // comments.forEach((value, index)=>{
    //   console.log(value.);
    // })

    return;
  }

  async delete(articleId: number, req: any) {
    const article = await this.articleRepository.findOne({ where: { articleId: articleId } });

    if (!article) {
      throw new Error('해당 게시글이 없습니다.');
    }

    const token = await req.cookies['access_token'];

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    if (article.userId !== id) {
      throw new Error('사용자의 게시글이 아닙니다.');
    }

    await this.articleRepository.remove(article);

    return {
      message: '게시글 삭제 완료',
    };
  }

  async update(articleId: number, articleDto: ArticleDto, req: any) {
    let article = await this.articleRepository.findOne({ where: { articleId: articleId } });

    if (!article) {
      throw new Error('해당 게시글이 없습니다.');
    }

    const token = await req.cookies['access_token'];

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    if (article.userId !== id) {
      throw new Error('사용자의 게시글이 아닙니다.');
    }

    // article을 수정된 값으로 변경
    article = { ...article, ...articleDto };

    await this.articleRepository.save(article);

    return {
      message: '게시글 수정 완료',
    };
  }

  async create(articleDto: ArticleDto, req: any) {
    const token = await req.cookies['access_token'];

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    const result = this.articleRepository.create({ ...articleDto, userId: id });
    await this.articleRepository.save(result);

    return {
      message: '게시글 생성 완료',
    };
  }
}
