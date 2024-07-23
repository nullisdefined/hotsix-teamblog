import { Article } from 'src/entities/article.entity';

export class MainArticleList {
  articles: Article[];
  pagination: {
    totalArticles: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}
