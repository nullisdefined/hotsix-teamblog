import { Controller, Get, Query } from '@nestjs/common';
import { ArticlesService } from './articles/articles.service';

@Controller('')
export class AppController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async FirstArticleList(@Query('page') page: string) {
    const pageNumber = page ? parseInt(page) : 1;
    return await this.articlesService.articleList(pageNumber);
  }
}
