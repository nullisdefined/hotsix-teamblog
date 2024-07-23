import { Article } from 'src/entities/article.entity';

export type ArticleDetailCommentType = {
  nickname: string;
  comment: string;
  createdAt: Date;
};

export type DetailResponse = {
  article: Article;
  comments: ArticleDetailCommentType[];
  likes: number;
};

export type ResponseMessage = {
  message: string;
};

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
