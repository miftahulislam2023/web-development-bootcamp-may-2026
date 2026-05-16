"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { EyeOpenIcon, EyeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { getToken } from "@/lib/api";

function PasswordInput({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div style={{ position: "relative" }}>
        <LockClosedIcon className="field-icon" width={16} height={16} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input input-with-icon"
          style={{ paddingRight: "42px" }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggle}
          className="btn btn-ghost icon-btn"
          style={{
            position: "absolute",
            right: "4px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
          }}
          aria-label="Toggle password visibility"
        >
          {show ? (
            <EyeClosedIcon width={16} height={16} />
          ) : (
            <EyeOpenIcon width={16} height={16} />
          )}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordForm({ onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card section-card form-stack" style={{ marginTop: 0 }}>
      <div>
        <h3 className="section-title">Change password</h3>
        <p className="section-subtitle">Use a password that is unique to this account.</p>
      </div>
      <PasswordInput
        label="Current password"
        value={currentPassword}
        onChange={setCurrentPassword}
        show={showCurrentPassword}
        onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
        placeholder="Current password"
      />
      <PasswordInput
        label="New password"
        value={newPassword}
        onChange={setNewPassword}
        show={showNewPassword}
        onToggle={() => setShowNewPassword(!showNewPassword)}
        placeholder="New password"
      />
      <PasswordInput
        label="Confirm new password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        show={showConfirmPassword}
        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        placeholder="Confirm new password"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ width: "100%" }}
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
