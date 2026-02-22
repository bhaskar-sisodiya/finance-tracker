import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Build page number list with ellipsis
    const pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    const btnBase =
        "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 hover:scale-110 active:scale-90 shadow-sm";

    return (
        <div className="flex items-center justify-center gap-1 py-3">
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${btnBase} border border-gray-200 text-gray-500 hover:bg-[#e8f5e9] hover:text-[#2e7d32] hover:border-[#4caf50] disabled:opacity-40 disabled:cursor-not-allowed`}
                aria-label="Previous page"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Page numbers */}
            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`${btnBase} ${p === currentPage
                            ? "bg-[#4caf50] text-white border border-[#4caf50] shadow-sm"
                            : "border border-gray-200 text-gray-600 hover:bg-[#e8f5e9] hover:text-[#2e7d32] hover:border-[#4caf50]"
                            }`}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${btnBase} border border-gray-200 text-gray-500 hover:bg-[#e8f5e9] hover:text-[#2e7d32] hover:border-[#4caf50] disabled:opacity-40 disabled:cursor-not-allowed`}
                aria-label="Next page"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Pagination;
