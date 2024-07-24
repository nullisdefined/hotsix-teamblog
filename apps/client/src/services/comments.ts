import axios from "../config/axios";

const commentsAPI = {
  //  댓글 생성
  postComment: async (id: number, comment: string) => {
    try {
      const response = await axios.post(`/comments/${id}`, { comment });
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      return Promise.reject(err);
    }
  },

  // 댓글 수정
  modifyComment: async (commentId: number, comment: string) => {
    try {
      const response = await axios.patch(`/comments/${commentId}`, { comment });
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      return Promise.reject(err);
    }
  },

  // 댓글 삭제
  removeComment: async (commentId: number) => {
    try {
      const response = await axios.delete(`/comments/${commentId}`);
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      return Promise.reject(err);
    }
  },
};

export default commentsAPI;
