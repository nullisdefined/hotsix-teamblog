import axiosInstance from "../config/axios";
import { IPost, IPostArticle, IPostsResponse } from "../types";

interface PostAPI {
  getArticles: (page: number, limit: number) => Promise<IPostsResponse>;
  getArticleDetail: (id: number) => Promise<IPost>;
  postArticle: (data: IPostArticle) => Promise<IPostArticle>;
  modifyArticle: (id: number, data: IPostArticle) => Promise<IPostArticle>;
  deleteArticle: (id: number) => Promise<void>;
  getUserArticles: (page: number, limit: number) => Promise<IPostsResponse>;
}

const postAPI: PostAPI = {
  // 게시글 전체보기
  getArticles: async (page = 1, limit = 6) => {
    try {
      const response = await axiosInstance.get("/articles", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  },

  // 게시글 상세보기
  getArticleDetail: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/articles/${id}`);
      return response.data as IPost;
    } catch (err) {
      console.error("Error fetching article details:", err);
      throw err;
    }
  },

  // 게시글 생성
  postArticle: async (data: IPostArticle) => {
    try {
      const response = await axiosInstance.post("/articles", data);
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      throw err;
    }
  },

  // 게시글 수정
  modifyArticle: async (id: number, data: IPostArticle) => {
    try {
      const response = await axiosInstance.patch(`/articles/${id}`, data);
      return response.data;
    } catch (err) {
      console.error("Error modifying post:", err);
      throw err;
    }
  },

  deleteArticle: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/articles/${id}`);
      return response.data;
    } catch (err) {
      console.error("Error deleting post:", err);
      throw err;
    }
  },

  getUserArticles: async (
    page: number = 1,
    limit: number = 6
  ): Promise<IPostsResponse> => {
    try {
      const response = await axiosInstance.get("/articles/user", {
        params: { page, limit },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching user articles:", err);
      throw err;
    }
  },
};

export default postAPI;
