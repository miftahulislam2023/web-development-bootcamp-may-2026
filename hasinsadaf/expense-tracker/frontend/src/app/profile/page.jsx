"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { getToken } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  PersonIcon,
  Pencil1Icon,
  Cross2Icon,
  CheckIcon,
  InfoCircledIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import { getProfile, updateProfile } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setName(data.name);
        setMonthlyIncome(data.monthly_income || "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSaveClick = () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), monthly_income: Number(monthlyIncome) });
      setProfile((prev) => ({ ...prev, name: name.trim(), monthly_income: Number(monthlyIncome) }));
      setEditMode(false);
      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setName(profile?.name || "");
    setMonthlyIncome(profile?.monthly_income || "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Failed to load profile</p>
      </div>
    );
  }

  const initials = profile.name ? profile.name[0].toUpperCase() : "?";
  const createdDate = new Date(profile.created_at).toLocaleDateString();

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-with-sidebar">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Profile</h1>
            <div className="topbar-subtitle">Manage your account settings</div>
          </div>
          <div className="topbar-actions">
            <span className="mobile-theme-toggle">
              <ThemeToggle />
            </span>
          </div>
        </header>

        <div className="page-container">
          <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--bg-surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "700",
              color: "var(--color-primary)",
            }}
          >
            {initials}
          </div>
          <h1 className="text-3xl font-bold mt-4">{profile.name}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            {profile.email}
          </p>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ padding: "28px", marginBottom: "16px" }}>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Pencil1Icon width={20} height={20} />
            Profile Information
          </h2>

          {!editMode ? (
            <>
              <div className="mb-6">
                <label className="label">Full Name</label>
                <p className="text-base">{profile.name}</p>
              </div>
              <div className="mb-6">
                <label className="label">Email Address</label>
                <p className="text-base">{profile.email}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Email cannot be changed
                </p>
              </div>
              <div className="mb-6">
                <label className="label">Monthly Income</label>
                <p className="text-base">
                  {profile.monthly_income > 0
                    ? "৳" + Number(profile.monthly_income).toLocaleString()
                    : "Not set"}
                </p>
              </div>
              <button
                className="btn btn-ghost flex items-center gap-2"
                onClick={() => setEditMode(true)}
              >
                <Pencil1Icon width={18} height={18} />
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label className="label">Full Name</label>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-6">
                <label className="label">Email Address</label>
                <input
                  className="input"
                  type="email"
                  value={profile.email}
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Email address cannot be changed
                </p>
              </div>
              <div className="mb-6">
                <label className="label">Monthly Income / Salary (৳)</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  placeholder="e.g. 50000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                />
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  Used to calculate your monthly savings
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button className="btn btn-ghost flex items-center gap-2" onClick={handleCancel}>
                  <Cross2Icon width={18} height={18} />
                  Cancel
                </button>
                <button
                  className="btn btn-primary flex items-center gap-2"
                  onClick={handleSaveClick}
                  disabled={saving}
                >
                  <CheckIcon width={18} height={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog.Root open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="modal-overlay" />
            <AlertDialog.Content className="modal-card dialog-card">
              <AlertDialog.Title className="section-title">Update Profile</AlertDialog.Title>
              <AlertDialog.Description className="section-subtitle">
                Update your profile? Name: '{name}', Monthly income: ৳{monthlyIncome}
              </AlertDialog.Description>
              <div className="flex justify-end gap-2" style={{ marginTop: "24px" }}>
                <AlertDialog.Cancel asChild>
                  <button className="btn btn-ghost">Cancel</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    className="btn btn-primary"
                    onClick={handleConfirmUpdate}
                  >
                    Update
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>

        {/* Account Info Card */}
        <div className="card" style={{ padding: "20px" }}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <InfoCircledIcon width={20} height={20} />
            Account Info
          </h3>
          <div className="space-y-4">
            <div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Member since</p>
              <p className="text-base font-medium">{createdDate}</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Account status</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircledIcon width={18} height={18} style={{ color: "#16a34a" }} />
                <span
                  className="badge"
                  style={{ background: "#dcfce7", color: "#16a34a" }}
                >
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}
