import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 6 + 3,
  delay: Math.random() * 3,
  duration: Math.random() * 6 + 6,
}));

const GLITCH_CHARS = "!@#$%^&*?/\\|<>{}[]0123456789";

function GlitchText({ text, errorColor }) {
  const [display, setDisplay] = useState(text);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      let frame = 0;
      const maxFrames = 10;
      const tick = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((char) =>
              frame < maxFrames - 2 && Math.random() > 0.6
                ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
                : char
            )
            .join("")
        );
        frame++;
        if (frame >= maxFrames) {
          clearInterval(tick);
          setDisplay(text);
          setGlitching(false);
        }
      }, 50);
    }, 3500);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={{ color: glitching ? errorColor : "inherit" }}>{display}</span>
  );
}

export default function ErrorPage() {
  const { t } = useTheme();

  const [path] = useState(() => {
    try { return window.location.pathname; } catch { return "/404"; }
  });

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      width: "100%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: t.pageBg,
      fontFamily: "'Courier New', Courier, monospace",
      color: t.text,
    }}>

      {/* Animated grid background */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.18,
        pointerEvents: "none",
        backgroundImage: `linear-gradient(${t.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: t.accent,
            opacity: 0.2,
            pointerEvents: "none",
          }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Scanline overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.03,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)",
      }} />

      {/* Orb glow top-left */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "50vw",
        height: "50vw",
        borderRadius: "50%",
        background: t.orb,
        filter: "blur(80px)",
        pointerEvents: "none",
      }} />

      {/* Main content */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 clamp(16px, 5vw, 40px)",
          width: "100%",
          maxWidth: 640,
          boxSizing: "border-box",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Terminal badge */}
        <motion.div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            padding: "6px 16px",
            borderRadius: 999,
            border: `1px solid ${t.badgeBd}`,
            background: t.badge,
            color: t.badgeTx,
            fontSize: 11,
            letterSpacing: "0.15em",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: t.accent,
            }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          SYSTEM ERROR
        </motion.div>

        {/* 404 Giant Number */}
        <motion.div
          style={{ position: "relative", userSelect: "none", marginBottom: 8 }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, type: "spring", stiffness: 120 }}
        >
          <span style={{
            fontWeight: 900,
            color: t.accent,
            lineHeight: 1,
            display: "block",
            fontSize: "clamp(5rem, 22vw, 10rem)",
            letterSpacing: "-0.06em",
            textShadow: `4px 4px 0px ${t.shadow}, -2px -2px 0px ${t.orb2}`,
          }}>
            <GlitchText text="404" errorColor={t.textSub} />
          </span>
          {/* Ghost duplicate */}
          <span style={{
            position: "absolute",
            inset: 0,
            fontWeight: 900,
            color: t.textDim,
            opacity: 0.12,
            userSelect: "none",
            pointerEvents: "none",
            fontSize: "clamp(5rem, 22vw, 10rem)",
            letterSpacing: "-0.06em",
            transform: "translate(6px, 6px)",
            lineHeight: 1,
          }}>
            404
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          style={{ width: "100%", height: 1, background: t.border, marginBottom: 24 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        {/* Title */}
        <motion.h1
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
            fontWeight: 700,
            color: t.text,
            letterSpacing: "-0.02em",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          Page Not Found
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          style={{
            color: t.textSub,
            fontSize: "clamp(13px, 2.5vw, 15px)",
            marginBottom: 8,
            maxWidth: 400,
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          The page you are looking for has been removed, moved, or never existed.
        </motion.p>

        {/* Path hint */}
        <motion.div
          style={{
            fontFamily: "inherit",
            fontSize: 12,
            color: t.textDim,
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: "8px 16px",
            marginBottom: 32,
            maxWidth: 340,
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          <span style={{ color: t.accent, flexShrink: 0 }}>➜</span>
          <span style={{ color: t.textSub, flexShrink: 0 }}>~</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{path}</span>
          <motion.span
            style={{
              display: "inline-block",
              width: 6,
              height: 14,
              background: t.textDim,
              flexShrink: 0,
            }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            width: "100%",
            maxWidth: 360,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          <motion.button
            onClick={goBack}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "11px 16px",
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              background: t.pillBg,
              color: t.textSub,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.18s",
            }}
            whileHover={{ scale: 1.03, backgroundColor: t.pillHov }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </motion.button>

          <motion.a
            href="/"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "11px 16px",
              borderRadius: 10,
              border: `1px solid ${t.accent}`,
              background: t.accent,
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              textDecoration: "none",
              transition: "all 0.18s",
            }}
            whileHover={{ scale: 1.03, opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Home
          </motion.a>
        </motion.div>

        {/* Footer note */}
        <motion.p
          style={{
            marginTop: 40,
            fontSize: 11,
            color: t.textDim,
            letterSpacing: "0.15em",
            opacity: 0.5,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          ERR_NOT_FOUND · HTTP 404
        </motion.p>
      </motion.div>

      {/* Mobile: stack buttons vertically */}
      <style>{`
        @media (max-width: 480px) {
          .err-btns { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}