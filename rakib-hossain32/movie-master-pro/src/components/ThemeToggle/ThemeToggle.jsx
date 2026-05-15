import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // ১. useState এর ভেতরে ফাংশন ব্যবহার করুন যাতে পেজ লোড হওয়ার আগেই সে চেক করতে পারে
  const [theme, setTheme] = useState(() => {
    // লোকাল স্টোরেজ চেক করা হচ্ছে
    const savedTheme = localStorage.getItem("theme");
    // যদি সেভ করা থাকে তবে সেটি রিটার্ন করবে, নাহলে ডিফল্ট 'light'
    return savedTheme || "light";
  });

  useEffect(() => {
    // ২. HTML ট্যাগে থিম সেট করা
    document.documentElement.setAttribute("data-theme", theme);
    // ৩. লোকাল স্টোরেজে থিম সেভ করা
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full cursor-pointer bg-base-200 text-primary hover:bg-base-300 transition-all shadow-md"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
