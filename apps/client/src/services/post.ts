import axios from "../config/axios";
import { IPost, IPostArticle } from "../types";

interface PostAPI {
  getArticles: () => Promise<IPost[]>;

  getArticleDetail: (id: number) => Promise<IPost>;

  postArticle: (data: IPostArticle) => Promise<IPostArticle>;

  modifyArticle: (id: number, data: IPostArticle) => Promise<IPostArticle>;
}

const postAPI: PostAPI = {
  // 게시글 전체보기
  getArticles: async () => {
    try {
      const response = await axios.get("/");
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
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    try {
      const response = await axios.post("/articles", formData);
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
