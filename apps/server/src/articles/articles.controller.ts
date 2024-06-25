import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create.dto';
import { UpdateArticleDto } from './dto/update.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get(':id')
  getArticles(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Delete(':id')
  deleteArticles(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @Patch(':id')
  updateArticles(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Post()
  async createArticles(@Body() createArticleDto: CreateArticleDto, @Req() req: Request) {
    try {
      return await this.articlesService.create(createArticleDto, req);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
