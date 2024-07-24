import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../../components/Post/Editor/Editor";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { IPostArticle } from "../../types";
import postAPI from "../../services/post";
import "./PostForm.css";

const PostEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const article = await postAPI.getArticleDetail(Number(id));
        setTitle(article.title);
        setContent(article.content);
        setDescription(article.description);
        setThumbUrl(article.thumb);
        setIsPublic(article.status);
      } catch (err) {
        setError("게시글을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);
    setError(null);

    const postData: IPostArticle = {
      thumb: thumbUrl,
      title: title,
      description: description,
      content: content,
      status: isPublic,
    };

    try {
      await postAPI.modifyArticle(Number(id), postData);
      navigate(`/posts/${id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "게시글 수정 중 오류가 발생했습니다.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-form-container">
      <h1>게시글 수정</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ fontSize: "1em" }}
        />
        <Editor onChange={setContent} initialValue={content} />
        <div className="public-toggle">
          <label className="checkbox-container mt-5">
            <div className="font-bold">공개글</div>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="action-buttons">
          <Button
            text="취소"
            type="DISABLED"
            size="MEDIUM"
            onClick={() => navigate(`/posts/${id}`)}
            buttonType="button"
          />
          <Button
            text={isLoading ? "저장 중..." : "저장"}
            type="PRIMARY"
            size="MEDIUM"
            onClick={handleSubmit}
            buttonType="submit"
          />
        </div>
      </form>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default PostEdit;
