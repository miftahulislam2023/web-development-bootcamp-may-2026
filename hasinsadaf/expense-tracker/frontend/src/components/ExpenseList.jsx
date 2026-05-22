"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";

const CATEGORY_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#06B6D4", "#8B5CF6", "#F97316"];

export default function ExpenseList({
  expenses,
  categories,
  onEdit,
  onDelete,
  onAddClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const ITEMS_PER_PAGE = 10;

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (c) => String(c.id) === String(categoryId)
    );
    return category ? category.name : "Uncategorized";
  };

  const getCategoryColor = (categoryId) => {
    const index = Math.abs(Number(categoryId || 0)) % CATEGORY_COLORS.length;
    return CATEGORY_COLORS[index];
  };

  const sorted = [...expenses]
    .filter((expense) => {
      const description = expense.description || "";
      const matchSearch = description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchCat =
        filterCategory === "all" || String(expense.category_id) === filterCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "amount") {
        valA = Number(valA);
        valB = Number(valB);
      }
      if (sortField === "date") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const totalItems = sorted.length;
  const paginatedExpenses = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const truncateText = (text, maxLength) => {
    if (!text) return "No description";
    if (text.length > maxLength) return `${text.substring(0, maxLength)}...`;
    return text;
  };

  return (
    <div>
      <div className="table-toolbar">
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <MagnifyingGlassIcon className="field-icon" width={16} height={16} />
          <input
            type="text"
            className="input input-with-icon"
            placeholder="Search expenses"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          className="input"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: "190px" }}
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button onClick={onAddClick} className="btn btn-primary">
          <PlusIcon width={17} height={17} />
          <span>Add expense</span>
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <SortableHeader
                label="Date"
                field="date"
                sortField={sortField}
                sortDir={sortDir}
                onSort={(field, dir) => {
                  setSortField(field);
                  setSortDir(dir);
                  setCurrentPage(1);
                }}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={sortField}
                sortDir={sortDir}
                onSort={(field, dir) => {
                  setSortField(field);
                  setSortDir(dir);
                  setCurrentPage(1);
                }}
              />
              <th>Category</th>
              <SortableHeader
                label="Amount"
                field="amount"
                sortField={sortField}
                sortDir={sortDir}
                onSort={(field, dir) => {
                  setSortField(field);
                  setSortDir(dir);
                  setCurrentPage(1);
                }}
              />
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <span style={{ color: "var(--text-secondary)", fontWeight: 650 }}>
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 700 }}>
                    {truncateText(expense.description, 46)}
                  </span>
                </td>
                <td>
                  <span className="badge">
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: getCategoryColor(expense.category_id),
                      }}
                    />
                    {getCategoryName(expense.category_id)}
                  </span>
                </td>
                <td className="amount">BDT {Number(expense.amount).toFixed(2)}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => onEdit(expense)}
                      className="btn btn-ghost icon-btn"
                      aria-label="Edit expense"
                    >
                      <Pencil1Icon width={16} height={16} />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="btn btn-danger icon-btn"
                      aria-label="Delete expense"
                    >
                      <TrashIcon width={16} height={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginatedExpenses.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: "17px", fontWeight: 760, color: "var(--text-primary)", marginBottom: "8px" }}>
            {totalItems === 0 && searchQuery === "" && filterCategory === "all"
              ? "No expenses recorded yet"
              : "No matching expenses"}
          </div>
          <div style={{ fontSize: "14px" }}>
            {totalItems === 0 && searchQuery === "" && filterCategory === "all"
              ? "Add your first expense to start building insights."
              : "Try changing your search or category filter."}
          </div>
        </div>
      )}

      {totalItems > 0 && (
        <Pagination
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
