import { createContext, useContext, useState } from "react";

export const tokens = (dark) => ({
  /* page */
  pageBg: dark ? "#1a0a10" : "#fff1f4",

  /* nav */
  navBg: dark
    ? "rgba(26,10,16,0.93)"
    : "rgba(255,241,244,0.92)",

  /* text */
  text:    dark ? "#fff1f4" : "#1a0a10",
  textSub: dark ? "#fda4af" : "#9f1239",
  textDim: dark ? "#9f1239" : "#fda4af",

  /* borders */
  border:      dark ? "rgba(251,113,133,0.12)" : "rgba(225,29,72,0.10)",
  borderLight: dark ? "rgba(251,113,133,0.07)" : "rgba(225,29,72,0.05)",

  /* surfaces */
  cardBg:  dark ? "#200a12" : "#ffe4e8",
  pillBg:  dark ? "rgba(225,29,72,0.12)" : "rgba(225,29,72,0.06)",
  pillHov: dark ? "rgba(225,29,72,0.20)" : "rgba(225,29,72,0.12)",
  hoverBg: dark ? "rgba(225,29,72,0.10)" : "rgba(225,29,72,0.06)",

  /* accent */
  accent:   "#e11d48",
  accentTx: "#ffffff",

  /* badge */
  badge:   dark ? "rgba(225,29,72,0.18)" : "rgba(225,29,72,0.08)",
  badgeBd: dark ? "rgba(251,113,133,0.25)" : "rgba(225,29,72,0.20)",
  badgeTx: dark ? "#fda4af" : "#9f1239",

  /* phone chrome */
  phoneBg:  dark ? "#200a12" : "#ffffff",
  phoneBg2: dark ? "#1a0a10" : "#fff1f4",
  notchBg:  dark ? "#0f050a" : "#fecdd3",

  /* fx */
  orb:       dark ? "rgba(225,29,72,0.22)"   : "rgba(225,29,72,0.08)",
  orb2:      dark ? "rgba(251,113,133,0.14)" : "rgba(251,113,133,0.06)",
  gridLine:  dark ? "rgba(251,113,133,0.20)" : "rgba(225,29,72,0.08)",
  watermark: dark ? "rgba(225,29,72,0.06)"   : "rgba(225,29,72,0.04)",
  shadow:    dark ? "rgba(0,0,0,0.80)"       : "rgba(225,29,72,0.18)",

  /* phone internals */
  pillInner: dark ? "rgba(225,29,72,0.12)" : "rgba(225,29,72,0.06)",
  rowInner:  dark ? "rgba(225,29,72,0.08)" : "rgba(225,29,72,0.04)",
});

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  const toggle = () => setDark((d) => !d);
  return (
    <ThemeCtx.Provider value={{ dark, toggle, t: tokens(dark) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);