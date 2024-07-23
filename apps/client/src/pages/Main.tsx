import { useEffect, useState } from "react";
import Profile from "../components/Profile/Profile";
import Gallery from "../components/Gallery/Gallery";
import Pagination from "../components/Pagination/Pagination";
import postAPI from "../services/post";
import { IPost, IPostsResponse, IUser } from "../types";
import userAPI from "../services/users";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const POSTS_PER_PAGE = 6;

function Main() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await userAPI.getCurrentUser();
        setUser(userResponse.data);

        const response: IPostsResponse = await postAPI.getArticles(
          currentPage,
          POSTS_PER_PAGE
        );
        console.log("Posts data:", response);
        setPosts(response.data);
        setTotalPages(response.totalPages || 1);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("Unauthorized, redirecting to login...");
          navigate("/login");
          return;
        }
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="Container">
      {user && (
        <Profile
          nickname={user.nickname}
          description={user.introduce || ""}
          email={user.email}
          gitUrl={user.gitUrl || ""}
        />
      )}
      <Gallery posts={posts} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Main;
