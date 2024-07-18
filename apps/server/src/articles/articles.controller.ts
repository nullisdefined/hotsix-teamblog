import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { AuthGuard } from '@nestjs/passport';
import { OwnerGuard } from './guards/owner.guard';
import { DetailResponse, ResponseMessage } from 'src/types/type';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getArticlesDetail(@Param('id') id: string): Promise<DetailResponse> {
    return await this.articlesService.getDetail(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticles(@Body() articleDto: ArticleDto, @Req() req): Promise<ResponseMessage> {
    return await this.articlesService.create(articleDto, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  async updateArticles(@Param('id') id: string, @Body() articleDto: ArticleDto): Promise<ResponseMessage> {
    return await this.articlesService.update(+id, articleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  async deleteArticles(@Param('id') id: string): Promise<ResponseMessage> {
    return await this.articlesService.delete(+id);
  }
}
