import React from "react";
import DOMPurify from "dompurify";

interface Props {
  htmlContent: string;
}

const HtmlRenderer: React.FC<Props> = ({ htmlContent }) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

export default HtmlRenderer;
