"use client";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handlePaginationClick: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  handlePaginationClick,
}) => {
  const displayPages = 5;

  const startPage = Math.max(currentPage - Math.floor(displayPages / 2), 1);
  const endPage = Math.min(startPage + displayPages - 1, totalPages);

  return (
    <div className="flex justify-center mt-6 flex-wrap gap-2">
      {/* First page button */}
      {currentPage > 1 && (
        <button
          className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
          onClick={() => handlePaginationClick(1)}
        >
          1
        </button>
      )}

      {/* Previous page button */}
      {currentPage > 1 && (
        <button
          className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
          onClick={() => handlePaginationClick(currentPage - 1)}
        >
          &lt;
        </button>
      )}

      {/* Page buttons */}
      {startPage > 1 && <span className="mx-1">...</span>}
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <button
          key={startPage + index}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === startPage + index
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => handlePaginationClick(startPage + index)}
        >
          {startPage + index}
        </button>
      ))}
      {endPage < totalPages && <span className="mx-1">...</span>}

      {/* Next page button */}
      {currentPage < totalPages && (
        <button
          className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
          onClick={() => handlePaginationClick(currentPage + 1)}
        >
          &gt;
        </button>
      )}

      {/* Last page button */}
      {currentPage < totalPages && (
        <button
          className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
          onClick={() => handlePaginationClick(totalPages)}
        >
          {totalPages}
        </button>
      )}
    </div>
  );
};

export default Pagination;
