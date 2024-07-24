import axios from "../config/axios";

interface UpdateUserData {
  email?: string;
  nickname?: string;
  gitUrl?: string;
  introduce?: string;
  profileImage?: string;
}

export function getAccessTokenFromCookie(): string | null {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "accessToken") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

const userAPI = {
  getCurrentUser: async () => {
    const response = await axios.post(
      "/users",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessTokenFromCookie()}`,
        },
      }
    );
    const userId = response.data;

    return axios.get("/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessTokenFromCookie()}`,
      },
      params: { userId },
    });
  },
  updateUser: async (userData: {
    nickname: string;
    gitUrl: string;
    introduce: string;
    profileImage?: string;
  }) => {
    try {
      const response = await axios.put("/users/update", userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessTokenFromCookie()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "프로필 업데이트에 실패했습니다."
        );
      } else if (error.request) {
        throw new Error(
          "서버에서 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요."
        );
      } else {
        throw new Error("요청 설정 중 오류가 발생했습니다.");
      }
    }
  },

  checkEmail: async (email: string) => {
    return axios.post("/users/check-email", { email });
  },

  checkNickname: async (nickname: string) => {
    return axios.post("/users/check-nickname", { nickname });
  },

  requestPasswordReset: async (email: string) => {
    return axios.post("/auth/password-reset", { email });
  },

  resetPassword: async (
    email: string,
    verificationCode: string,
    newPassword: string
  ) => {
    return axios.patch("/auth/password-reset", {
      email,
      verificationCode,
      newPassword,
    });
  },

  deleteAccount: async () => {
    return axios.delete("/users", {
      headers: {
        Authorization: `Bearer ${getAccessTokenFromCookie()}`,
      },
    });
  },

  getUserById: async (userId: number) => {
    try {
      const response = await axios.get(`/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
};

export default userAPI;
