import React, { useEffect, useState, useCallback, useMemo } from "react";
import Profile from "../components/Profile/Profile";
import Gallery from "../components/Gallery/Gallery";
import Pagination from "../components/Pagination/Pagination";
import postAPI from "../services/post";
import { IPost, IPostsResponse, IUser } from "../types";
import userAPI from "../services/users";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";

export const POSTS_PER_PAGE = 6;

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(
    new URLSearchParams(location.search).get("page") || "1",
    10
  );

  const fetchData = useCallback(async () => {
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
    } catch (err) {
      console.error("Error fetching data:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          console.log("Unauthorized, redirecting to login...");
          navigate("/login");
          return;
        }
        setError(
          err.response?.data?.message || "데이터를 불러오는 데 실패했습니다."
        );
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      navigate(`?page=${newPage}`);
    },
    [navigate]
  );

  const memoizedProfile = useMemo(
    () =>
      user && (
        <Profile
          nickname={user.nickname}
          description={user.introduce || ""}
          email={user.email}
          gitUrl={user.gitUrl || ""}
        />
      ),
    [user]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="Container">
      {memoizedProfile}
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
