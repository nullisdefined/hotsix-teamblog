export interface IPost {
  articleId: number;
  content: string;
  createdAt: string;
  description: string;
  status: boolean;
  thumb: string;
  title: string;
  updatedAt: string;
  userId: number;
}

export interface IComments {
  nickname: string;
  comment: string;
  createdAt: string;
}

export interface IPostArticle {
  title: string;
  content: string;
  status: boolean;
  description?: string;
  thumb?: string;
}
