import React, { useState, ChangeEvent } from "react";
import Editor from "../../components/Post/Editor/Editor";
import Button from "../../components/Button/Button";
import UploadFile from "../../components/Post/UploadFile/UploadFile";
import "./Edit.css";
import postAPI from "../../services/post";
import axios, { AxiosError } from "axios";

const PostEdit = () => {
  const [titleValue, setTitleValue] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>("");
  const [filesValue, setfilesValue] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(true);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };
  const handleEditorChange = (value: string) => {
    setEditorValue(value);
  };
  const imageUploadURL = `http://${window.location.hostname}:${import.meta.env.VITE_APP_PORT}/api/upload`;
  const handleUploadFileChange = (value: File[]) => {
    const data = new FormData();
    data.append("file", value[0]);
    axios
      .post(imageUploadURL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setfilesValue(response.data.url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleClickPost = async () => {
    const data = {
      title: titleValue,
      content: editorValue,
      status: isShow,
      description: "des",
      thumb: filesValue,
    };
    try {
      const response = await postAPI.postArticle(data);
      console.log("SUCCESS", response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("ERR", err.response?.data);
      } else {
        console.log("ERR", err);
      }
    }
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
