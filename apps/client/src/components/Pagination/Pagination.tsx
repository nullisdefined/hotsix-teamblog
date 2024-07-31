import React from "react";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalButtons = 5; // 표시할 버튼의 총 개수
    const sideButtons = Math.floor((totalButtons - 1) / 2); // 현재 페이지 양쪽에 표시할 버튼 개수

    let startPage = Math.max(currentPage - sideButtons, 1);
    let endPage = Math.min(startPage + totalButtons - 1, totalPages);

    if (endPage - startPage + 1 < totalButtons) {
      startPage = Math.max(endPage - totalButtons + 1, 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="Pagination">
      <button
        className="PaginationButton"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`PaginationButton ${
            currentPage === page ? "Active" : ""
          } ${typeof page !== "number" ? "Ellipsis" : ""}`}
          disabled={typeof page !== "number"}
        >
          {page}
        </button>
      ))}
      <button
        className="PaginationButton"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
