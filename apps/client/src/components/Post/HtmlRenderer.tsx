import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "./HtmlRenderer.css";

interface Props {
  htmlContent: string;
}

const HtmlRenderer: React.FC<Props> = ({ htmlContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // 코드 블록 하이라이팅
      const codeBlocks = containerRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });

      // 순서 없는 리스트 스타일 적용
      const ulElements = containerRef.current.querySelectorAll("ul");
      ulElements.forEach((ul) => {
        ul.classList.add("md-list", "md-list-disc");
      });

      // 순서 있는 리스트 스타일 적용
      const olElements = containerRef.current.querySelectorAll("ol");
      olElements.forEach((ol) => {
        ol.classList.add("md-list", "md-list-decimal");
      });

      // 테이블 스타일 적용
      const tableElements = containerRef.current.querySelectorAll("table");
      tableElements.forEach((table) => {
        table.classList.add("md-table");
      });
    }
  }, [htmlContent]);

  const cleanHtml = DOMPurify.sanitize(htmlContent);

  return (
    <div
      ref={containerRef}
      className="md-content"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default HtmlRenderer;
