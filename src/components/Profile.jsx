// pages/dashboard/Profile.jsx
// Now uses the shared useProfile() hook — no duplicated Firebase logic.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../hooks/userProfile";
import { Helmet } from "react-helmet-async";

import {
  RiUserLine, RiMailLine, RiPhoneLine, RiMapPinLine,
  RiBriefcaseLine, RiFileTextLine,
  RiTwitterXLine, RiLinkedinBoxLine, RiGithubLine, RiGlobalLine,
  RiEditLine, RiCheckLine, RiCloseLine,
  RiCameraLine, RiLoader4Line, RiAlertLine,
  RiShieldCheckLine, RiLockLine,
} from "react-icons/ri";

// ── animation ─────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

// ── Field ─────────────────────────────────────────
function Field({ label, icon: Icon, value, onChange, type = "text",
                 placeholder, disabled, accent, t, multiline, maxLen }) {
  const shared = {
    width: "100%", boxSizing: "border-box",
    padding: "10px 14px 10px 38px",
    borderRadius: 12, border: `1px solid ${t.border}`,
    background: disabled ? t.pageBg : t.cardBg,
    color: disabled ? t.textDim : t.text,
    fontSize: "clamp(13px,1.4vw,14px)", outline: "none",
    transition: "border-color .2s, background .3s",
    fontFamily: "inherit", resize: "none",
    cursor: disabled ? "not-allowed" : "auto",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: t.textDim,
                      letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
        {maxLen && (
          <span style={{ float: "right", fontWeight: 400, letterSpacing: 0,
                         textTransform: "none" }}>
            {(value || "").length}/{maxLen}
          </span>
        )}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={14} color={t.textDim}
          style={{
            position: "absolute", left: 12,
            top: multiline ? 12 : "50%",
            transform: multiline ? "none" : "translateY(-50%)",
            pointerEvents: "none",
          }} />
        {multiline ? (
          <textarea rows={4} value={value} disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLen} placeholder={placeholder} style={shared}
            onFocus={(e) => { if (!disabled) e.target.style.borderColor = accent; }}
            onBlur={(e)  => { e.target.style.borderColor = t.border; }} />
        ) : (
          <input type={type} value={value} disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} style={shared}
            onFocus={(e) => { if (!disabled) e.target.style.borderColor = accent; }}
            onBlur={(e)  => { e.target.style.borderColor = t.border; }} />
        )}
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────
function Card({ title, icon: Icon, children, t, accent }) {
  return (
    <motion.div variants={fadeUp}
      style={{
        background: t.cardBg, border: `1px solid ${t.border}`,
        borderRadius: 20, overflow: "hidden", transition: "background .35s",
      }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "clamp(14px,2.5vw,20px) clamp(16px,3vw,24px)",
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${accent}18`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={16} color={accent} />
        </div>
        <span style={{ fontWeight: 700, fontSize: "clamp(13px,1.5vw,15px)", color: t.text }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "clamp(16px,3vw,24px)" }}>{children}</div>
    </motion.div>
  );
}

// ── Toast ─────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  // auto-dismiss after 3.4 s
  // (useEffect intentionally omits `onDone` dep — stable ref is fine here)
  const bg = type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : "#2563eb";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      onAnimationComplete={() => setTimeout(onDone, 3000)}
      style={{
        position: "fixed", bottom: 24, left: "50%",
        transform: "translateX(-50%)", zIndex: 9999,
        background: bg, color: "#fff",
        padding: "11px 22px", borderRadius: 12,
        fontSize: 13, fontWeight: 600,
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,.28)", whiteSpace: "nowrap",
      }}>
      {type === "success" ? <RiCheckLine size={15} /> : <RiAlertLine size={15} />}
      {msg}
    </motion.div>
  );
}

// ── AvatarUploader ────────────────────────────────
function AvatarUploader({ user, uploading, progress, onPick, accent, t }) {
  const initial = user?.displayName
    ? user.displayName.trim().split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <div style={{
      position: "relative",
      width: "clamp(80px,14vw,108px)",
      height: "clamp(80px,14vw,108px)",
      flexShrink: 0,
    }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        overflow: "hidden", border: `3px solid ${accent}`,
        background: `${accent}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {user?.photoURL ? (
          <img src={user.photoURL} alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 800, color: accent }}>
            {initial}
          </span>
        )}
        {uploading && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(0,0,0,.55)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <RiLoader4Line size={20} color="#fff"
              style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{progress}%</span>
          </div>
        )}
      </div>
      {!uploading && (
        <button onClick={onPick}
          style={{
            position: "absolute", bottom: 2, right: 2,
            width: 28, height: 28, borderRadius: "50%",
            background: accent, border: "2px solid white",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "transform .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          title="Change photo">
          <RiCameraLine size={13} color="#fff" />
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────
export default function Profile() {
  const { t } = useTheme();
  const accent = t.accent || "#e11d48";

  const {
    user, form, loading, saving,
    uploading, progress, toast,
    fileRef, set,
    saveProfile, cancelEdit,
    pickAvatar, handleFileChange,
    setToast,
  } = useProfile();

  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    const ok = await saveProfile(form); // pass form explicitly — avoids stale closure
    if (ok) setEditing(false);
  };

  const handleCancel = () => { cancelEdit(); setEditing(false); };

  // ── loading ────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex",
                    alignItems: "center", justifyContent: "center", color: t.textDim }}>
        <RiLoader4Line size={32} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 12, color: t.textSub }}>
        <RiLockLine size={40} color={accent} />
        <p style={{ fontSize: 16, fontWeight: 600 }}>Please log in to view your profile.</p>
      </div>
    );
  }

  // ── render ─────────────────────────────────────
  return (
    <>

    <Helmet>
        <title>Dashboard | Profile</title>
      </Helmet>

    <div style={{
      background: t.pageBg, minHeight: "100vh",
      padding: "clamp(16px,4vw,40px) clamp(12px,4vw,32px)",
      transition: "background .35s", fontFamily: "inherit",
    }}>
      {/* hidden file input */}
      <input ref={fileRef} type="file" accept="image/*"
        style={{ display: "none" }} onChange={handleFileChange} />

      <motion.div variants={stagger} initial="hidden" animate="show"
        style={{ maxWidth: 860, margin: "0 auto",
                 display: "flex", flexDirection: "column",
                 gap: "clamp(16px,3vw,24px)" }}>

        {/* ── HEADER CARD ──────────────────────────── */}
        <motion.div variants={fadeUp}
          style={{
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 24, overflow: "hidden", transition: "background .35s",
          }}>

          {/* cover strip */}
          <div style={{
            height: "clamp(70px,10vw,100px)",
            background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0, opacity: 0.04,
              backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }} />
          </div>

          {/* avatar + name row */}
          <div style={{
            padding: "0 clamp(16px,3vw,28px) clamp(20px,3vw,28px)",
            display: "flex", flexWrap: "wrap", alignItems: "flex-end",
            gap: "clamp(12px,2vw,20px)",
            marginTop: "clamp(-44px,-6vw,-54px)",
          }}>
            <AvatarUploader user={user} uploading={uploading} progress={progress}
              onPick={pickAvatar} accent={accent} t={t} />

            <div style={{ flex: "1 1 180px", paddingBottom: 4, minWidth: 0 }}>
              <div style={{
                fontSize: "clamp(18px,3vw,24px)", fontWeight: 900,
                color: t.text, letterSpacing: "-0.02em",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {user.displayName || "Your Name"}
              </div>
              <div style={{ fontSize: "clamp(12px,1.4vw,14px)", color: t.textSub, marginTop: 2 }}>
                {user.email}
              </div>
              {form.occupation && (
                <div style={{
                  fontSize: 12, color: accent, fontWeight: 600, marginTop: 4,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <RiBriefcaseLine size={12} /> {form.occupation}
                </div>
              )}
            </div>

            {/* Edit / Save / Cancel */}
            <div style={{
              marginLeft: "auto", display: "flex", gap: 8,
              flexShrink: 0, paddingBottom: 4, alignItems: "center",
              flexWrap: "wrap",
            }}>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "9px 18px", borderRadius: 12,
                    border: `1px solid ${t.border}`,
                    background: "transparent", color: t.textSub,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSub; }}>
                  <RiEditLine size={14} /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleCancel}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "9px 16px", borderRadius: 12,
                      border: `1px solid ${t.border}`, background: "transparent",
                      color: t.textSub, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", transition: "all .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = t.pillBg; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <RiCloseLine size={14} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "9px 18px", borderRadius: 12,
                      background: accent, color: "#fff",
                      fontSize: 13, fontWeight: 700, border: "none",
                      cursor: saving ? "not-allowed" : "pointer",
                      opacity: saving ? 0.75 : 1,
                      transition: "opacity .2s, transform .15s",
                    }}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                    {saving
                      ? <RiLoader4Line size={14} style={{ animation: "spin 1s linear infinite" }} />
                      : <RiCheckLine size={14} />}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* bio strip */}
          {(form.bio || editing) && (
            <div style={{ padding: "0 clamp(16px,3vw,28px) clamp(16px,3vw,24px)", marginTop: -4 }}>
              {editing ? (
                <Field label="Bio" icon={RiFileTextLine} value={form.bio}
                  onChange={set("bio")} multiline
                  placeholder="Tell people a bit about yourself…"
                  accent={accent} t={t} maxLen={200} />
              ) : (
                <p style={{ fontSize: "clamp(13px,1.4vw,14px)", color: t.textSub,
                            lineHeight: 1.7, margin: 0 }}>{form.bio}</p>
              )}
            </div>
          )}
        </motion.div>

        {/* ── GRID ─────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,340px),1fr))",
          gap: "clamp(16px,3vw,24px)",
        }}>
          {/* Basic Info */}
          <Card title="Basic Information" icon={RiUserLine} t={t} accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Full Name" icon={RiUserLine} value={form.displayName}
                onChange={set("displayName")} placeholder="Your full name"
                disabled={!editing} accent={accent} t={t} />
              <Field label="Email Address" icon={RiMailLine} value={user.email}
                onChange={() => {}} disabled accent={accent} t={t} />
              <Field label="Phone Number" icon={RiPhoneLine} value={form.phone}
                onChange={set("phone")} placeholder="+880 1XXX-XXXXXX"
                type="tel" disabled={!editing} accent={accent} t={t} />
              <Field label="Location" icon={RiMapPinLine} value={form.location}
                onChange={set("location")} placeholder="City, Country"
                disabled={!editing} accent={accent} t={t} />
              <Field label="Occupation" icon={RiBriefcaseLine} value={form.occupation}
                onChange={set("occupation")} placeholder="e.g. Software Engineer"
                disabled={!editing} accent={accent} t={t} />
            </div>
          </Card>

          {/* Social Links */}
          <Card title="Social Links" icon={RiGlobalLine} t={t} accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Website" icon={RiGlobalLine} value={form.website}
                onChange={set("website")} placeholder="https://yoursite.com"
                type="url" disabled={!editing} accent={accent} t={t} />
              <Field label="Twitter / X" icon={RiTwitterXLine} value={form.twitter}
                onChange={set("twitter")} placeholder="https://x.com/username"
                type="url" disabled={!editing} accent={accent} t={t} />
              <Field label="LinkedIn" icon={RiLinkedinBoxLine} value={form.linkedin}
                onChange={set("linkedin")} placeholder="https://linkedin.com/in/username"
                type="url" disabled={!editing} accent={accent} t={t} />
              <Field label="GitHub" icon={RiGithubLine} value={form.github}
                onChange={set("github")} placeholder="https://github.com/username"
                type="url" disabled={!editing} accent={accent} t={t} />
            </div>
          </Card>
        </div>

        {/* ── ACCOUNT SECURITY ─────────────────────── */}
        <Card title="Account Security" icon={RiShieldCheckLine} t={t} accent={accent}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
            gap: "clamp(12px,2vw,16px)",
          }}>
            {[
              {
                label: "Account Created",
                value: user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString("en-GB",
                      { day: "2-digit", month: "short", year: "numeric" })
                  : "—",
              },
              {
                label: "Last Sign-in",
                value: user.metadata?.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en-GB",
                      { day: "2-digit", month: "short", year: "numeric" })
                  : "—",
              },
              {
                label: "Email Verified",
                value: user.emailVerified ? "✅ Verified" : "❌ Not verified",
              },
              {
                label: "Auth Provider",
                value: user.providerData?.[0]?.providerId === "google.com"
                  ? "🔵 Google" : "📧 Email / Password",
              },
            ].map((item) => (
              <div key={item.label}
                style={{
                  background: t.pageBg, borderRadius: 12,
                  padding: "12px 16px", border: `1px solid ${t.border}`,
                }}>
                <div style={{
                  fontSize: 11, color: t.textDim, fontWeight: 700,
                  letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4,
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "clamp(12px,1.5vw,14px)", color: t.text, fontWeight: 600 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </Card>

      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
    </>
  );
}