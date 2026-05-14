import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { CURRENCIES } from "../utils/helpers";

const Section = ({ title, sub, children }) => (
  <div className="card p-6">
    <div className="mb-5">
      <h2 className="font-bold text-gray-900 dark:text-white text-lg">
        {title}
      </h2>
      {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
    </div>
    {children}
  </div>
);

const Alert = ({ type, msg }) =>
  msg ? (
    <div
      className={`text-sm px-4 py-3 rounded-xl mb-4 ${type === "success" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}
    >
      {type === "success" ? "✅ " : "❌ "}
      {msg}
    </div>
  ) : null;

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    currency: user?.currency || "USD",
    monthlyBudget: user?.monthlyBudget || 0,
  });
  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMsg, setProfileMsg] = useState({ type: "", msg: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", msg: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", msg: "" });
    setProfileLoading(true);
    try {
      const { data } = await api.put("/user/profile", profile);
      updateUser(data.user);
      setProfileMsg({ type: "success", msg: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({
        type: "error",
        msg: err.response?.data?.error || "Update failed",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwMsg({ type: "", msg: "" });
    if (pw.newPassword !== pw.confirmPassword)
      return setPwMsg({ type: "error", msg: "Passwords do not match" });
    if (pw.newPassword.length < 6)
      return setPwMsg({ type: "error", msg: "Minimum 6 characters" });
    setPwLoading(true);
    try {
      await api.put("/user/password", {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setPwMsg({ type: "success", msg: "Password changed successfully!" });
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg({ type: "error", msg: err.response?.data?.error || "Failed" });
    } finally {
      setPwLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/user/account");
      logout();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const isGoogle = !!user?.googleId;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="card p-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-2xl flex-shrink-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-full h-full rounded-2xl object-cover"
            />
          ) : (
            user?.name?.charAt(0)?.toUpperCase()
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-lg">
            {user?.name}
          </p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          {isGoogle && (
            <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs mt-1">
              🔗 Google Account
            </span>
          )}
        </div>
      </div>

      {/* Profile settings */}
      <Section title="Profile Settings" sub="Update your personal information">
        <Alert type={profileMsg.type} msg={profileMsg.msg} />
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-gray-400"
              value={user?.email}
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Currency</label>
              <select
                className="input"
                value={profile.currency}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, currency: e.target.value }))
                }
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Monthly Budget</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={profile.monthlyBudget}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, monthlyBudget: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="btn-primary"
          >
            {profileLoading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </Section>

      {/* Theme */}
      <Section title="Appearance" sub="Customize how FinanceHub looks">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Dark Mode
            </p>
            <p className="text-sm text-gray-400">
              Switch between light and dark theme
            </p>
          </div>
          <button
            onClick={async () => {
              const t = user?.theme === "dark" ? "light" : "dark";
              updateUser({ theme: t });
              try {
                await api.put("/user/profile", { theme: t });
              } catch {}
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${user?.theme === "dark" ? "bg-primary-600" : "bg-gray-300"}`}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full top-0.5 shadow transition-all ${user?.theme === "dark" ? "left-6" : "left-0.5"}`}
            />
          </button>
        </div>
      </Section>

      {/* Password */}
      {!isGoogle && (
        <Section title="Change Password" sub="Update your account password">
          <Alert type={pwMsg.type} msg={pwMsg.msg} />
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input
                className="input"
                type="password"
                value={pw.currentPassword}
                onChange={(e) =>
                  setPw((p) => ({ ...p, currentPassword: e.target.value }))
                }
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                className="input"
                type="password"
                value={pw.newPassword}
                onChange={(e) =>
                  setPw((p) => ({ ...p, newPassword: e.target.value }))
                }
                placeholder="Min 6 characters"
                required
              />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                className="input"
                type="password"
                value={pw.confirmPassword}
                onChange={(e) =>
                  setPw((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={pwLoading} className="btn-primary">
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </Section>
      )}

      {/* Danger zone */}
      <Section title="Danger Zone" sub="Irreversible account actions">
        <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-xl bg-red-50 dark:bg-red-900/10">
          <div>
            <p className="font-medium text-red-700 dark:text-red-400">
              Delete Account
            </p>
            <p className="text-sm text-red-500/80">
              All your data will be permanently removed
            </p>
          </div>
          <button
            onClick={() => setShowDelete(true)}
            className="btn-danger btn-sm whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </Section>

      {showDelete && (
        <ConfirmDialog
          title="Delete Account"
          message="Are you absolutely sure? This will permanently delete your account, all transactions, budgets, and recurring items. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
