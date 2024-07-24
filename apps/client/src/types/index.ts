export interface IPostsResponse {
  data: IPost[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface IPost {
  articleId: number;
  userId: number;
  thumb: string;
  title: string;
  description: string;
  nickname: string;
  profileImg: string;
  content: string;
  createdAt: string;
  comments: IComment[];
  commentCount: number;
  likes: number;
  status: boolean;
  liked: boolean;
}

export interface IComment {
  commentId: number;
  comment: string;
  createdAt: string;
  user: {
    userId: number;
    nickname: string;
    profileImage: string;
  };
}
export interface IPostArticle {
  thumb: string;
  title: string;
  description: string;
  content: string;
  status: boolean;
}

export interface IUser {
  userId: number;
  nickname: string;
  email: string;
  introduce?: string;
  gitUrl?: string;
  profileImage?: string;
}
