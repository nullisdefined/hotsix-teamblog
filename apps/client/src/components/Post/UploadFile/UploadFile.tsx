import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsCloudUpload, BsFillXCircleFill } from "react-icons/bs";
import "./UploadFile.css";

interface FileWithPreview extends File {
  preview: string;
}
interface UploadFileProps {
  onChange: (value: File[]) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onChange }) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      // 파일 여기
      console.log("acceptedFiles", acceptedFiles);
      onChange(acceptedFiles);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  const handleClick = () => {
    setFiles([]);
    onChange([]);
  };

  const thumbs = files.map((file) => (
    <div
      className="bg-background p-4 flex justify-between items-center"
      key={file.name}
    >
      <div className="flex items-center">
        <img
          src={file.preview}
          width="100px"
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
        <p className="pl-4">{file.name}</p>
        {/* <p className="pl-4">{file.size}</p> */}
      </div>
      <BsFillXCircleFill
        size="24"
        className="text-gray cursor-pointer"
        onClick={handleClick}
      />
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div
        {...getRootProps({
          className: "dropzone my-4 p-7 bg-background ",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <BsCloudUpload size="36" className="text-primary" />
          <p className="pt-4 text-gray">
            Drag and Drop file here or Choose file
          </p>
        </div>
      </div>
      <aside>{thumbs}</aside>
    </section>
  );
};

export default UploadFile;
