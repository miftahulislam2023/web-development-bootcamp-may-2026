"use client";

import { Cross1Icon } from "@radix-ui/react-icons";

export default function RightPanel({ isOpen, onClose, children, title }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="panel-overlay"
        />
      )}

      <div className={`right-panel ${isOpen ? "open" : "closed"}`}>
        <div className="panel-header">
          <h2 className="section-title">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost icon-btn"
            aria-label="Close panel"
          >
            <Cross1Icon width={16} height={16} />
          </button>
        </div>

        <div className="panel-body">{children}</div>
      </div>
    </>
  );
}
