"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil2Icon, PersonIcon } from "@radix-ui/react-icons";
import { getToken } from "@/lib/api";
import ChangePasswordForm from "./ChangePasswordForm";

export default function ProfilePanel({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSavingName(true);

    try {
      const response = await fetch("/api/user/update-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: editedName.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update name");
      }

      toast.success("Name updated successfully.");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  if (showChangePassword) {
    return (
      <div>
        <button
          onClick={() => setShowChangePassword(false)}
          className="btn btn-ghost"
          style={{ marginBottom: "20px" }}
        >
          Back to profile
        </button>
        <ChangePasswordForm onSuccess={() => setShowChangePassword(false)} />
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <div className="card section-card" style={{ textAlign: "center" }}>
        <div
          style={{
            width: "78px",
            height: "78px",
            borderRadius: "22px",
            background: "var(--primary)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontSize: "30px",
            fontWeight: 820,
            margin: "0 auto 14px",
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon width={28} height={28} />}
        </div>

        {isEditing ? (
          <div>
            <label className="label" style={{ textAlign: "left" }}>Display name</label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="input"
              style={{ marginBottom: "12px" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSaveName}
                disabled={savingName}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {savingName ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(user?.name || "");
                }}
                className="btn btn-ghost"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="section-title">{user?.name || "User"}</h3>
            <p className="section-subtitle" style={{ marginBottom: "16px" }}>
              {user?.email}
            </p>
            <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
              <Pencil2Icon width={15} height={15} />
              Edit name
            </button>
          </>
        )}
      </div>

      <div className="card section-card">
        <h4 className="section-title">Security</h4>
        <p className="section-subtitle">Manage credentials and keep your account access current.</p>
        <button
          onClick={() => setShowChangePassword(true)}
          className="btn btn-ghost"
          style={{ width: "100%", marginTop: "18px" }}
        >
          Change password
        </button>
      </div>
    </div>
  );
}
