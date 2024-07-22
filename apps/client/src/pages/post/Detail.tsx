import { useEffect, useState, ChangeEvent } from "react";
import postAPI from "../../services/post";
import likesAPI from "../../services/likes";
import commentsAPI from "../../services/comments";
import { useParams } from "react-router-dom";
import { IPost } from "../../types";
import HtmlRenderer from "../../components/Post/HtmlRenderer";
import Button from "../../components/Button/Button";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<IPost | null>(null);
  const [comment, setComment] = useState<string>("");

  const postArticle = async () => {
    setComment("");
    if (id) {
      try {
        const response = await postAPI.getArticleDetail(Number(id));
        response.createdAt = dayjs(response.createdAt).format(
          "MMMM D, YYYY [at] h:mm A"
        );
        console.log(response);
        setArticle(response);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log("ERR", err.response?.data);
        } else {
          console.log("ERR", err);
        }
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
        console.log("ERR", err.response?.data);
      } else {
        console.log("ERR", err);
      }
    }
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  const handleComment = async () => {
    try {
      await commentsAPI.postComment(Number(id), comment);
      postArticle();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("ERR", err.response?.data);
      } else {
        console.log("ERR", err);
      }
    }
  };

  if (!article) return <div>Loading...</div>;

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
                  <div className="text-xl font-bold">{el.nickname}</div>
                  <div>{dayjs(el.createdAt).format("YYYY년 MM월 DD일")}</div>
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
