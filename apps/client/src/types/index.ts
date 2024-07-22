export interface IPost {
  id: number;
  nickname: string;
  thumb: string;
  title: string;
  likes: number;
  description: string;
  content: string;
  comments: IComments[];
  createdAt: string;
  updatedAt: string;
  status: boolean;
  showStatus: boolean;
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
  thumb?: File;
}
