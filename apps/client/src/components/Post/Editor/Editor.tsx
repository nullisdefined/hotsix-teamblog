import React, { useState } from "react";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import FroalaEditor from "froala-editor";
import ReactFroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins/image.min.js";
import axiosInstance from "../../../config/axios";
import "./Editor.css";

interface EditorProps {
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ onChange }) => {
  const [content, setContent] = useState<string>("");
  const handleModelChange = (model: string) => {
    setContent(model);
    onChange(model);
  };

  const imageUploadURL = "/upload";

  const config = {
    placeholderText: "",
    imageUploadURL: imageUploadURL,
    imageUploadParams: { id: "my_editor" },
    toolbarBottom: false,
    toolbarInline: false,
    attribution: false,
    events: {
      "image.beforeUpload": function (this: FroalaEditor, images: File[]) {
        const data = new FormData();
        data.append("file", images[0]);

        axiosInstance
          .post(imageUploadURL, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.status === 201) {
              const imageUrl = response.data.url;
              this.image.insert(imageUrl, false, {}, this.image.get());
            }
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            let errorMessage = "이미지 업로드에 실패했습니다.";
            if (error.response) {
              switch (error.response.status) {
                case 400:
                  errorMessage = error.response.data.message;
                  break;
                case 413:
                  errorMessage = "파일 크기가 너무 큽니다.";
                  break;
                case 500:
                  errorMessage =
                    "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
                  break;
              }
            }
            alert(errorMessage);
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
