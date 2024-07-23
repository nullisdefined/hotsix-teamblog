import React, { useState, ChangeEvent } from "react";
import Editor from "../../components/Post/Editor/Editor";
import Button from "../../components/Button/Button";
import UploadFile from "../../components/Post/UploadFile/UploadFile";
import "./Edit.css";
import axios from "axios";

const PostEdit = () => {
  const [titleValue, setTitleValue] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbUrl, setThumbUrl] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleEditorChange = (value: string) => {
    setEditorValue(value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleThumbUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setThumbUrl(e.target.value);
  };

  const handleClickPost = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    const data = {
      thumb: thumbUrl,
      title: titleValue,
      description: description,
      content: editorValue,
      status: isShow,
    };

    try {
      const token = localStorage.getItem("token"); // 토큰 가져오기
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await axios.post("/articles", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        console.log("게시글이 성공적으로 생성되었습니다.");
        // 성공 후 처리 (예: 홈으로 리다이렉트)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("인증에 실패했습니다. 다시 로그인해주세요.");
        } else if (err.response?.status === 500) {
          setError("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        } else {
          setError(
            err.response?.data?.message || "게시글 작성 중 오류가 발생했습니다."
          );
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (
      titleValue.trim() === "" ||
      editorValue.trim() === "" ||
      description.trim() === "" ||
      thumbUrl.trim() === ""
    ) {
      setError("모든 필드를 입력해주세요.");
      return false;
    }
    return true;
  };

  return (
    <div className="Container">
      <input
        className="InputTitle my-4 p-3 text-lg"
        type="text"
        placeholder="제목을 입력하세요"
        onChange={handleTitleChange}
        value={titleValue}
      />
      <textarea
        className="InputDescription my-4 p-3"
        placeholder="본문 요약을 입력하세요"
        onChange={handleDescriptionChange}
        value={description}
      />
      <input
        className="InputThumb my-4 p-3"
        type="text"
        placeholder="썸네일 URL을 입력하세요"
        onChange={handleThumbUrlChange}
        value={thumbUrl}
      />
      <Editor onChange={handleEditorChange} />
      <div className="ButtonGroup pb-4 text-center">
        <button
          onClick={() => setIsShow(true)}
          className={isShow ? "active mr-2" : "mr-2"}
        >
          전체 공개
        </button>
        <button
          onClick={() => setIsShow(false)}
          className={isShow ? "" : "active"}
        >
          비공개
        </button>
      </div>
      {error && <div className="Error">{error}</div>}
      <div className="text-center py-6">
        <Button
          text="취소"
          type="DISABLED"
          size="LARGE"
          link="/"
          spacing="mr-4"
        />
        <Button
          text={isLoading ? "저장 중..." : "저장"}
          type="PRIMARY"
          size="LARGE"
          onClick={handleClickPost}
        />
      </div>
    </div>
  );
};

export default PostEdit;
