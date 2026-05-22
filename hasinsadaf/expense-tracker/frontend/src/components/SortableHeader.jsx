"use client";

import { ArrowUpIcon, ArrowDownIcon, CaretSortIcon } from "@radix-ui/react-icons";

export default function SortableHeader({
  label,
  field,
  sortField,
  sortDir,
  onSort,
}) {
  const isActive = field === sortField;

  const handleClick = () => {
    if (isActive) {
      onSort(field, sortDir === "asc" ? "desc" : "asc");
    } else {
      onSort(field, "asc");
    }
  };

  return (
    <th
      className="sortable"
      onClick={handleClick}
      style={{
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          whiteSpace: "nowrap",
        }}
      >
        <span>{label}</span>
        {isActive ? (
          sortDir === "asc" ? (
            <ArrowUpIcon width={14} height={14} />
          ) : (
            <ArrowDownIcon width={14} height={14} />
          )
        ) : (
          <CaretSortIcon width={14} height={14} style={{ opacity: 0.5 }} />
        )}
      </div>
    </th>
  );
}
