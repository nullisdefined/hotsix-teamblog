import axios from "../config/axios";
import { IPost, IPostArticle, IPostsResponse } from "../types";

interface PostAPI {
  getArticles: (page: number, limit: number) => Promise<IPostsResponse>;

  getArticleDetail: (id: number) => Promise<IPost>;

  postArticle: (data: IPostArticle) => Promise<IPostArticle>;

  modifyArticle: (id: number, data: IPostArticle) => Promise<IPostArticle>;
}

const postAPI: PostAPI = {
  // 게시글 전체보기
  getArticles: async (page = 1, limit = 6) => {
    try {
      const response = await axios.get("/articles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { page, limit },
      });
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  },

  // 게시글 상세보기
  getArticleDetail: async (id: number) => {
    try {
      const response = await axios.get(`/articles/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data as IPost;
    } catch (err) {
      console.error("Error fetching article details:", err);
      throw err;
    }
  },

  // 게시글 생성
  postArticle: async (data: IPostArticle) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    try {
      const response = await axios.post("/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      return Promise.reject(err);
    }
  },

  // 게시글 수정
  modifyArticle: async (id: number, data: IPostArticle) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    try {
      const response = await axios.post(`/articles/${id}`, formData);
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      return Promise.reject(err);
    }
  },
};

export default postAPI;
