import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create.dto';
import { UpdateArticleDto } from './dto/update.dto';
import { Article } from 'src/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ArticlesService {
  constructor(private readonly jwtService: JwtService) { }
  @InjectRepository(Article) private articleRepository: Repository<Article>;

  async create(createArticleDto: CreateArticleDto, req: any) {
    try {
      const token = await req.cookies['access_token'];

      const { id } = await this.jwtService.verifyAsync(token, {
        secret: 'Secret',
      });

      const result = this.articleRepository.create({ ...createArticleDto, userId: id });
      await this.articleRepository.save(result);

      return {
        message: '게시글 생성 완료',
      };
    } catch (error) {
      return error;
    }
  }

  findAll() {
    return `This action returns all articles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
