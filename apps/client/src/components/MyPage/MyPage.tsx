import React, { useEffect, useState } from "react";
import { IUser, IPost, IPostsResponse } from "../../types";
import userAPI from "../../services/users";
import postAPI from "../../services/post";
import Card from "../Gallery/Card/Card";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { BsFillPersonFill, BsFillEnvelopeFill, BsGithub } from "react-icons/bs";
import "./MyPage.css";

const MyPage: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await userAPI.getCurrentUser();
        setUser(userData.data);

        if (userData.data.userId) {
          const postsData: IPostsResponse = await postAPI.getUserArticles(1, 6);
          setPosts(postsData.data);
          setTotalPages(postsData.totalPages);
        }
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const postsData: IPostsResponse = await postAPI.getUserArticles(page, 6);
      setPosts(postsData.data);
      setTotalPages(postsData.totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }
  if (!user) {
    return <div>유저를 찾을 수 없습니다</div>;
  }

  return (
    <div className="MyPageContainer">
      <h1 className="MyPageTitle">마이페이지</h1>
      <div className="UserInfoCard">
        <h2 className="UserInfoTitle">
          <BsFillPersonFill className="inline-block mr-2" />
          {user.nickname}
        </h2>
        <div className="flex items-center mb-4">
          <img
            src={user.profileImage}
            alt="프로필 사진"
            className="w-32 h-32 rounded-full mr-4"
          />
          <div>
            <p className="mb-2">
              <BsFillEnvelopeFill className="inline-block mr-2" />
              <strong>이메일:</strong> {user.email}
            </p>
            <p className="mb-2">
              <BsGithub className="inline-block mr-2" />
              <strong>GitHub:</strong>{" "}
              <a
                href={user.gitUrl}
                className="text-gray-700 underline hover:text-gray-900"
              >
                {user.gitUrl || ""}
              </a>
            </p>
            <p className="mb-2">
              <strong>소개:</strong> {user.introduce || ""}
            </p>
          </div>
        </div>
        <div className="EditProfileButton">
          <Button
            text="프로필 수정"
            type="SECONDARY"
            onClick={() => navigate("/edit-profile")}
          />
        </div>
      </div>
      <div className="MyPostsSection">
        <h2 className="MyPostsTitle">내 게시글</h2>
        {posts.length > 0 ? (
          <>
            <div className="Gallery">
              {posts.map((post) => (
                <Card key={post.articleId} post={post} />
              ))}
            </div>
            <div className="Pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`PaginationButton ${
                      currentPage === page ? "Active" : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          <p className="NoPostsMessage">아직 작성한 게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyPage;
