import React, { useState } from "react";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import FroalaEditor from "froala-editor";
import ReactFroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins/image.min.js";
import axios from "axios";
import "./Editor.css";

interface EditorProps {
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ onChange }) => {
  const [content, setContent] = useState<string>("");
  const handleModelChange = (model: string) => {
    setContent(model);
    onChange(model);
    console.log("model", content);
  };

  const imageUploadURL = `http://${window.location.hostname}:${import.meta.env.VITE_APP_PORT}/api/upload`; // 이미지 업로드 엔드포인트
  const config = {
    placeholderText: "내용을 입력하세요.",
    imageUploadURL: imageUploadURL,
    imageUploadParams: { id: "my_editor" },
    toolbarBottom: false, // 툴바를 아래에 배치하지 않음
    toolbarInline: false, // 인라인 툴바를 사용하지 않음
    attribution: false, // 푸터의 Froala 로고 및 링크 제거
    events: {
      "image.beforeUpload": function (this: FroalaEditor, images: File[]) {
        const data = new FormData();
        data.append("file", images[0]);
        console.log(images[0].name);
        axios
          .post(imageUploadURL, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            const imageUrl = response.data.url; // 서버가 반환하는 이미지 URL
            this.image.insert(imageUrl, false, {}, this.image.get());
          })
          .catch((error) => {
            // Handle upload error
            console.error("Error uploading image:", error);
          });

        return false;
      },
    },
  };

  return (
    <div>
      <ReactFroalaEditor
        tag="textarea"
        config={config}
        model={content}
        onModelChange={handleModelChange}
      />
    </div>
  );
};

export default Editor;
