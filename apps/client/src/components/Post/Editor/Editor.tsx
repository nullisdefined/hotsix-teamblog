import React, { useState } from "react";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import FroalaEditor from "react-froala-wysiwyg";
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

  const imageUploadURL = "http://localhost:8888/test"; // 이미지 업로드 엔드포인트
  let num = 1;
  const config = {
    placeholderText: "내용을 입력하세요.",
    imageUploadURL: imageUploadURL,
    imageUploadParams: { id: "my_editor" },
    toolbarBottom: false, // 툴바를 아래에 배치하지 않음
    toolbarInline: false, // 인라인 툴바를 사용하지 않음
    attribution: false, // 푸터의 Froala 로고 및 링크 제거
    events: {
      "image.beforeUpload": function (images: File[]) {
        const data = new FormData();
        data.append("file", images[0]);

        axios
          .post(
            imageUploadURL,
            { name: `editor_${num}` },
            {
              // headers: {
              //   'Content-Type': 'multipart/form-data',
              // },
            }
          )
          .then((response) => {
            const imageUrl = response.data.link; // 서버가 반환하는 이미지 URL
            num++;
            this.image.insert(imageUrl, null, null, this.image.get(), null);
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
      <FroalaEditor
        tag="textarea"
        config={config}
        model={content}
        onModelChange={handleModelChange}
      />
    </div>
  );
};

export default Editor;
