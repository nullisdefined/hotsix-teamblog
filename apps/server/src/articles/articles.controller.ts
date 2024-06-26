import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get(':id')
  async getArticlesDetail(@Param('id') id: string) {
    try {
      return await this.articlesService.getDetail(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteArticles(@Param('id') id: string, @Req() req: Request) {
    try {
      return await this.articlesService.delete(+id, req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async updateArticles(@Param('id') id: string, @Body() articleDto: ArticleDto, @Req() req: Request) {
    try {
      return await this.articlesService.update(+id, articleDto, req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createArticles(@Body() articleDto: ArticleDto, @Req() req: Request) {
    try {
      return await this.articlesService.create(articleDto, req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
