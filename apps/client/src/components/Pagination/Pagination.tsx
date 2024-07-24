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
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination">
      <ul>
        {currentPage > 1 && (
          <li>
            <button onClick={() => onPageChange(currentPage - 1)}>
              &laquo; Prev
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number} className={currentPage === number ? "active" : ""}>
            <button onClick={() => onPageChange(number)}>{number}</button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li>
            <button onClick={() => onPageChange(currentPage + 1)}>
              Next &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
