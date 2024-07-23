import { useEffect, useState, ChangeEvent } from "react";
import postAPI from "../../services/post";
import likesAPI from "../../services/likes";
import commentsAPI from "../../services/comments";
import { useParams } from "react-router-dom";
import { IPost } from "../../types";
import HtmlRenderer from "../../components/Post/HtmlRenderer";
import Button from "../../components/Button/Button";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<IPost | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const postArticle = async () => {
    setLoading(true);
    setError(null);
    if (id) {
      try {
        const response = await postAPI.getArticleDetail(Number(id));
        const formattedArticle = {
          ...response,
          createdAt: dayjs(response.createdAt).tz().format("YYYY년 MM월 DD일"),
        };
        console.log("Fetched article:", formattedArticle);
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
    }
  };

  useEffect(() => {
    postArticle();
  }, [id]);

  const handleLikes = async () => {
    try {
      await likesAPI.postLike(Number(id));
      postArticle();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to like the post");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleComment = async () => {
    try {
      await commentsAPI.postComment(Number(id), comment);
      setComment(""); // Clear comment input after posting
      postArticle();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to post comment");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="Container">
      <h1 className="font-black text-6xl pt-10">{article.title}</h1>
      <div className="flex justify-between pt-10 pb-20">
        <div className="">
          <p className="font-bold text-xl">{article.nickname}</p>
          <p>{article.createdAt}</p>
        </div>
        <Button
          text={article.likes > 0 ? `좋아요 ${article.likes}` : "좋아요"}
          type="FOCUSED"
          onClick={handleLikes}
        />
      </div>
      <HtmlRenderer htmlContent={article.content} />
      <div className="pt-14">
        <h3 className="font-bold">{article.comments.length}개의 댓글</h3>
        {article.comments.length > 0
          ? article.comments.map((el, index) => (
              <div
                key={index}
                className="py-5 "
                style={{ borderTop: "1px solid rgba(0,0,0,0.3)" }}
              >
                <div className="pb-3">
                  <div className="text-xl font-bold">{el.user.nickname}</div>
                  <div>
                    {dayjs(el.createdAt).tz().format("YYYY년 MM월 DD일 HH:mm")}
                  </div>
                </div>
                <p>{el.comment}</p>
              </div>
            ))
          : null}
        <div className="pb-20">
          <input
            type="text"
            className="bg-slate-100 w-full p-7"
            onChange={handleCommentChange}
            value={comment}
            placeholder="댓글을 작성하세요"
          />
          <div className="text-right pt-5">
            <Button text="댓글 등록" type="PRIMARY" onClick={handleComment} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
