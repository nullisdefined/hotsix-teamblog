import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Editor from "../../components/Post/Editor/Editor";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { IPostArticle } from "../../types";
import postAPI from "../../services/post";
import "./PostForm.css";

const MAX_TITLE_LENGTH = 100;

const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setTitle(newTitle);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (title.trim() === "") {
      setError("제목을 입력해주세요.");
      setIsLoading(false);
      return;
    }

    if (content.trim() === "") {
      setError("내용을 입력해주세요.");
      setIsLoading(false);
      return;
    }

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
    <div className="post-form-container">
      <h1>새 게시글 작성</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="title-input-container">
          <input
            type="text"
            placeholder="제목 (100자 이내)"
            value={title}
            onChange={handleTitleChange}
            required
            style={{ fontSize: "1em", width: "100%" }}
            maxLength={MAX_TITLE_LENGTH}
          />
          <span
            className="title-char-count"
            style={{ float: "right", marginBottom: "15px" }}
          >
            {title.length}/{MAX_TITLE_LENGTH}
          </span>
        </div>
        <Editor onChange={setContent} />
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
            onClick={() => navigate("/")}
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

export default PostCreate;
