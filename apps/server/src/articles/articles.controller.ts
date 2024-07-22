import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { AuthGuard } from '@nestjs/passport';
import { OwnerGuard } from './guards/owner.guard';
import { DetailResponse, ResponseMessage } from 'src/types/type';
import { Article } from 'src/entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllArticles(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: Article[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    return await this.articlesService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getArticlesDetail(@Param('id') id: number, @Req() req): Promise<DetailResponse> {
    return await this.articlesService.getArticle(id, req.user.userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticles(@Body() articleDto: ArticleDto, @Req() req): Promise<boolean> {
    await this.articlesService.create(articleDto, req.user.userId);
    return true;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  async updateArticles(@Param('id') id: number, @Body() articleDto: ArticleDto): Promise<boolean> {
    await this.articlesService.update(id, articleDto);
    return true;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  async deleteArticles(@Param('id') id: number): Promise<ResponseMessage> {
    return await this.articlesService.delete(id);
  }
}
