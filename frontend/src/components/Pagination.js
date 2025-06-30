import React from "react";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || !pagination.totalPages || pagination.totalPages <= 1) {
    return null;
  }

  const { currentPage, totalPages, hasPrev, hasNext } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="pagination-controls">
        {/* First Page */}
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="pagination-btn"
            disabled={currentPage === 1}
          >
            ««
          </button>
        )}
        
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="pagination-btn"
          disabled={!hasPrev}
        >
          ‹ Prev
        </button>
        
        {/* Page Numbers */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        ))}
        
        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="pagination-btn"
          disabled={!hasNext}
        >
          Next ›
        </button>
        
        {/* Last Page */}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="pagination-btn"
            disabled={currentPage === totalPages}
          >
            »»
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
