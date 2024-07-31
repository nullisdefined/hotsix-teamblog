import axios from "../config/axios";

const likesAPI = {
  postLike: async (articleId: number): Promise<boolean> => {
    try {
      const response = await axios.post(`/likes/${articleId}`);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 409) {
        const cancelResponse = await axios.delete(`/likes/${articleId}`);
        return cancelResponse.data;
      }
      console.error("Error toggling like:", err);
      throw err;
    }
  },
};

export default likesAPI;
