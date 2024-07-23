import axios from "../config/axios";

const userAPI = {
  getCurrentUser: async () => {
    const response = await axios.post(
      "/users",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const userId = response.data;

    return axios.get("/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: { userId },
    });
  },
};

export default userAPI;
