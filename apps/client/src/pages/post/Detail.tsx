import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import postAPI from "../../services/post";
import likesAPI from "../../services/likes";
import commentsAPI from "../../services/comments";
import { useParams, useNavigate } from "react-router-dom";
import { IPost, IUser } from "../../types";
import HtmlRenderer from "../../components/Post/HtmlRenderer";
import Button from "../../components/Button/Button";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import userAPI from "../../services/users";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<IPost | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const navigate = useNavigate();

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await postAPI.getArticleDetail(Number(id));
      const formattedArticle = {
        ...response,
        createdAt: dayjs(response.createdAt).tz().format("YYYY년 MM월 DD일"),
      };
      setArticle(formattedArticle);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await userAPI.getCurrentUser();
        setCurrentUser(data);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    getUserInfo();
    fetchArticle();
  }, [fetchArticle]);

  const handleLikes = useCallback(async () => {
    if (!article) return;
    try {
      const result = await likesAPI.postLike(article.articleId);
      setArticle((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
          liked: !prev.liked,
        };
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to toggle like");
      } else {
        setError("An unexpected error occurred");
      }
    }
  }, [article]);

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleComment = async () => {
    if (!id || !comment.trim()) return;
    try {
      await commentsAPI.postComment(Number(id), comment);
      setComment("");
      fetchArticle(); // Refresh the article to show the new comment
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to post comment");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleDelete = async () => {
    if (!id || !currentUser) return;
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      await postAPI.deleteArticle(Number(id));
      navigate("/"); // Redirect to home page after successful deletion
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to delete article");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      await commentsAPI.removeComment(commentId);
      fetchArticle(); // 댓글 삭제 후 게시글 새로고침
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to delete comment");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="Container" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1
        className="font-black text-6xl pt-10"
        style={{ wordBreak: "break-all" }}
      >
        {article.title}
      </h1>
      <div className="flex justify-between items-center pt-10 pb-20">
        <div className="flex-grow">
          <div className="flex items-center">
            <img
              src={article.profileImg}
              alt="프로필 사진"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-bold text-xl">{article.nickname}</p>
              <p>{article.createdAt}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            text={`좋아요 ${article.likes}`}
            type="LIKE"
            className={`Button_LIKE ${article.liked ? "active" : ""}`}
            onClick={handleLikes}
          />
          {currentUser && currentUser.userId === article.userId && (
            <>
              <Button
                text="수정"
                type="SECONDARY"
                size="SMALL"
                onClick={() => navigate(`/posts/edit/${article.articleId}`)}
              />
              <Button
                text="삭제"
                type="DANGER"
                size="SMALL"
                onClick={handleDelete}
              />
            </>
          )}
        </div>
      </div>
      <HtmlRenderer htmlContent={article.content} />
      <div className="pt-14">
        <div className="pb-20">
          <input
            type="text"
            className="bg-slate-100 w-full p-7 mb-4"
            onChange={handleCommentChange}
            value={comment}
            placeholder="댓글을 작성하세요"
          />
          <div className="text-right pt-5">
            <Button text="댓글 등록" type="PRIMARY" onClick={handleComment} />
          </div>
        </div>
        <h3 className="font-bold">{article.comments.length}개의 댓글</h3>
        {article.comments.length > 0
          ? article.comments.map((el, index) => (
              <div
                key={index}
                className="py-5"
                style={{ borderTop: "1px solid rgba(0,0,0,0.3)" }}
              >
                <div className="pb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={el.user.profileImage}
                      alt="프로필 사진"
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <div className="text-xl font-bold">
                        {el.user.nickname}
                      </div>
                      <p className="bg-gray-100 p-3 rounded-lg">{el.comment}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-3">
                      {dayjs(el.createdAt)
                        .tz()
                        .format("YYYY년 MM월 DD일 HH:mm")}
                    </div>
                    {currentUser && currentUser.userId === el.user.userId && (
                      <Button
                        text="삭제"
                        type="DANGER"
                        size="SMALL"
                        onClick={() => handleDeleteComment(el.commentId)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default React.memo(PostDetail);
