import axios from "../config/axios";
import { IPost, IPostArticle } from "../types";

interface PostAPI {
  getArticles: (page: number, limit: number) => Promise<IPost[]>;

  getArticleDetail: (id: number) => Promise<IPost>;

  postArticle: (data: IPostArticle) => Promise<IPostArticle>;

  modifyArticle: (id: number, data: IPostArticle) => Promise<IPostArticle>;
}

const postAPI: PostAPI = {
  // 게시글 전체보기
  getArticles: async (page: number, limit: number) => {
    try {
      const response = await axios.get("/articles", {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching posts:", err);
      return Promise.reject(err);
    }
  },

  // 게시글 상세보기
  getArticleDetail: async (id: number) => {
    try {
      const response = await axios.get(`/articles/${id}`);
      return response.data;
    } catch (err) {
      console.error("Error fetching article details:", err);
      return Promise.reject(err);
    }
  },

  // 게시글 생성
  postArticle: async (data: IPostArticle) => {
    try {
      const response = await axios.post("/articles", data);
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
