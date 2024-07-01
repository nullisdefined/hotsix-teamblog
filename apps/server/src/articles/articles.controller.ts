import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getArticlesDetail(@Param('id') id: string) {
    return await this.articlesService.getDetail(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticles(@Body() articleDto: ArticleDto, @Req() req) {
    return await this.articlesService.create(articleDto, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateArticles(@Param('id') id: string, @Body() articleDto: ArticleDto, @Req() req) {
    return await this.articlesService.update(+id, articleDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticles(@Param('id') id: string, @Req() req) {
    return await this.articlesService.delete(+id, req.user.userId);
  }
}
