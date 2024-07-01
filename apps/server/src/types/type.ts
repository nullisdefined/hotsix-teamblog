export type ArticleDetailCommentType = {
  nickname: string;
  comment: string;
  createdAt: Date;
};

export type DetailResponse = {
  title: string;
  nickname: string;
  profileImg: string[];
  content: string;
  createdAt: Date;
  comments: ArticleDetailCommentType[];
  likes: number;
  status: string;
};

export type ResponseMessage = {
  message: string;
};
