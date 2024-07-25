import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "./HtmlRenderer.css"; // 새로운 CSS 파일을 만들어 스타일을 정의합니다

interface Props {
  htmlContent: string;
}

const HtmlRenderer: React.FC<Props> = ({ htmlContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const codeBlocks = containerRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [htmlContent]);

  const cleanHtml = DOMPurify.sanitize(htmlContent);

  return (
    <div
      ref={containerRef}
      className="html-content"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default HtmlRenderer;
