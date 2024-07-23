import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Button/Button";
import Editor from "../../components/Post/Editor/Editor";
import "./PostCreate.css";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { IPostArticle } from "../../types";
import postAPI from "../../services/post";

const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await postAPI.postArticle(postData);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "게시글 작성 중 오류가 발생했습니다.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-create-container">
      <h1>새 게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Editor onChange={setContent} />
        <input
          type="url"
          placeholder="썸네일 URL"
          value={thumbUrl}
          onChange={(e) => setThumbUrl(e.target.value)}
          required
        />
        <div className="public-toggle">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            공개
          </label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="button-group">
          <Button
            text="취소"
            type="DISABLED"
            size="MEDIUM"
            onClick={() => navigate("/")}
          />
          <Button
            text={isLoading ? "저장 중..." : "저장"}
            type="PRIMARY"
            size="MEDIUM"
            onClick={handleSubmit}
          />
        </div>
      </form>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default PostCreate;
