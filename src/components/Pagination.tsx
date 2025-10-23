interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
          currentPage === 1 || loading
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number" || loading}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              typeof page === "number"
                ? page === currentPage
                  ? "bg-accent-500 text-white"
                  : "text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                : "text-gray-400 cursor-default"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
          currentPage === totalPages || loading
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
        }`}
      >
        Next
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
}
