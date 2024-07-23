export interface IPostsResponse {
  data: IPost[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface IPost {
  articleId: number;
  userId: number;
  thumb: string;
  title: string;
  nickname: string;
  profileImg: string;
  content: string;
  createdAt: string;
  comments: IComment[];
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
  title: string;
  content: string;
  status: boolean;
  description?: string;
  thumb?: File;
}

export interface IUser {
  id: number;
  nickname: string;
  email: string;
  introduce?: string;
  gitUrl?: string;
}
