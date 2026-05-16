"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

export default function Pagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "14px",
        padding: "16px 0 0",
        marginTop: "16px",
        borderTop: "1px solid var(--border)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
        Showing {startItem}-{endItem} of {totalItems} results
      </div>

      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-ghost icon-btn"
          aria-label="Previous page"
        >
          <ChevronLeftIcon width={16} height={16} />
        </button>

        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{ color: "var(--text-muted)", padding: "0 4px" }}
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={isActive ? "btn" : "btn btn-ghost"}
              style={{
                minHeight: "36px",
                padding: "8px 12px",
                background: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "#fff" : "var(--text-secondary)",
                border: isActive ? "1px solid var(--primary)" : "1px solid var(--divider)",
              }}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-ghost icon-btn"
          aria-label="Next page"
        >
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
