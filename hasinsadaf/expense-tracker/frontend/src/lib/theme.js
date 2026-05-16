export function getTheme() {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") || "light";
}

export function setTheme(theme) {
  localStorage.setItem("theme", theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function initTheme() {
  const theme = getTheme();
  setTheme(theme);
}

export function toggleTheme() {
  const current = getTheme();
  setTheme(current === "dark" ? "light" : "dark");
  return current === "dark" ? "light" : "dark";
}
