import React, { useState, ChangeEvent } from "react";
import Editor from "../../components/Post/Editor/Editor";
import Button from "../../components/Button/Button";
import UploadFile from "../../components/Post/UploadFile/UploadFile";
import "./Edit.css";

const PostEdit = () => {
  const [titleValue, setTitleValue] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>("");
  const [filesValue, setfilesValue] = useState<File[]>([]);
  const [isShow, setIsShow] = useState<booleanolean>(true);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };
  const handleEditorChange = (value: string) => {
    setEditorValue(value);
  };
  const handleUploadFileChange = (value: File[]) => {
    setfilesValue(value);
  };

  const handleClickPost = () => {
    console.log("포스트!", filesValue);
  };

  return (
    <div className="Container">
      <input
        className="InputTitle my-4 p-3 text-lg"
        type="text"
        placeholder="제목을 입력하세요"
        onChange={handleTitleChange}
      />
      <Editor onChange={handleEditorChange}></Editor>
      <UploadFile onChange={handleUploadFileChange}></UploadFile>
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
      <div className="text-center py-6">
        <Button
          text="취소"
          type="DISABLED"
          size="LARGE"
          link="/"
          spacing="mr-4"
        ></Button>
        <Button
          text="저장"
          type="PRIMARY"
          size="LARGE"
          onClick={handleClickPost}
        ></Button>
      </div>
    </div>
  );
};

export default PostEdit;
