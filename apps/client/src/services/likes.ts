import axios from "../config/axios";

const likesAPI = {
  //  좋아요 생성
  postLike: async (id: number) => {
    try {
      const response = await axios.post(`/likes/${id}`);
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      return Promise.reject(err);
    }
  },

  // 좋아요 삭제
  removeLike: async (id: number) => {
    try {
      const response = await axios.delete(`/articles/${id}`);
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      return Promise.reject(err);
    }
  },
};

export default likesAPI;
