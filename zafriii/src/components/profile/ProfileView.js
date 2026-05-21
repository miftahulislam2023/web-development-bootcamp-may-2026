import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Shield,
  Key,
  Moon,
  Sun,
  Camera,
} from "lucide-react";
import { useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

export default function ProfileView({
  isDarkMode,
  onToggleDarkMode,
  onLogoutClick,
  user,
  updateUser,
}) {
  const displayName = user?.name || "User";
  const displayUsername = user?.username || "user";

  const userDP =
    user?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      displayName
    )}`;

  const avatarInputRef = useRef(null);

  // MODAL STATE
  const [showImageModal, setShowImageModal] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      if (res?.[0]) {
        const url = res[0].ufsUrl || res[0].url;

        const token = localStorage.getItem("chat_token");

        await fetch("/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: url }),
        }).catch(() => {});

        updateUser && updateUser({ avatar: url });
      }
    },

    onUploadError: (err) => alert(`Upload failed: ${err.message}`),
  });

  const options = [
    {
      icon: <Settings size={20} />,
      label: "Account Settings",
      desc: "Update your personal information",
    },
    {
      icon: <Shield size={20} />,
      label: "Privacy & Security",
      desc: "Control your data and security",
    },
    {
      icon: <Bell size={20} />,
      label: "Notifications",
      desc: "Choose what we notify you about",
    },
    {
      icon: <Key size={20} />,
      label: "Keys & Encryption",
      desc: "Manage your end-to-end encryption keys",
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Help & Support",
      desc: "Get help with your account",
    },
  ];

  return (
    <>
      <div
        className={`flex-1 h-full overflow-y-auto custom-scrollbar relative transition-colors duration-500 ${
          isDarkMode ? "bg-[#141821]" : "bg-slate-50"
        }`}
      >
        {/* BACKGROUND */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isDarkMode ? "dark" : "light"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-[450px] pointer-events-none"
            style={{
              background: isDarkMode
                ? "linear-gradient(180deg, rgba(54, 100, 159, 0.4) 0%, rgba(20, 24, 33, 0) 100%)"
                : "linear-gradient(180deg, #9ecfef 0%, #cde7f9 35%, #f8fafc 100%)",
            }}
          />
        </AnimatePresence>

        <div className="relative z-10 min-h-full flex flex-col items-center pt-20 px-6 pb-32 w-full max-w-3xl mx-auto">
          {/* AVATAR */}
          <div className="relative mb-6 group">
            {/* CLICKABLE PROFILE IMAGE */}
            <div
              onClick={() => setShowImageModal(true)}
              className={`w-32 h-32 rounded-full border-4 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer hover:scale-105 relative z-30 ${
                isDarkMode
                  ? "border-white/10 bg-gray-800"
                  : "border-white bg-white"
              }`}
            >
              <img
                src={userDP}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* HIDDEN INPUT */}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);

                if (files.length > 0) {
                  startUpload(files);
                }

                e.target.value = "";
              }}
            />

            {/* CAMERA BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                avatarInputRef.current?.click();
              }}
              disabled={isUploading}
              className={`absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 transition-all z-50 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-blue-400 hover:bg-gray-700"
                  : "bg-white border-gray-200 text-[#36649f] hover:bg-blue-50"
              } ${
                isUploading
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </button>

            {/* GLOW */}
            <div
              className={`absolute inset-0 -m-2 rounded-full blur-xl opacity-30 pointer-events-none transition-colors duration-500 ${
                isDarkMode ? "bg-blue-500" : "bg-blue-300"
              }`}
            />
          </div>

          {/* USER INFO */}
          <div className="text-center mb-12 w-full">
            <h2
              className={`text-3xl font-bold mb-1 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {displayName}
            </h2>

            <p className="text-blue-600 font-medium">
              @{displayUsername}
            </p>
          </div>

          {/* SETTINGS */}
          <div className="w-full space-y-8">
            {/* THEME TOGGLE */}
            <div
              onClick={onToggleDarkMode}
              className={`p-4 rounded-xl shadow-sm flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${
                isDarkMode
                  ? "bg-[#1a202c] border border-gray-800 hover:border-gray-700"
                  : "bg-white border border-gray-100 hover:shadow-md hover:border-blue-100"
              }`}
            >
              <div className="flex items-center gap-4 pointer-events-none">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDarkMode
                      ? "bg-indigo-900/50 text-indigo-400"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  {isDarkMode ? (
                    <Moon size={20} />
                  ) : (
                    <Sun size={20} />
                  )}
                </div>

                <div>
                  <h4
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Dark Mode
                  </h4>

                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Toggle application theme
                  </p>
                </div>
              </div>

              <div
                className={`w-14 h-7 rounded-full relative transition-colors ${
                  isDarkMode ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                    isDarkMode ? "right-1" : "left-1"
                  }`}
                />
              </div>
            </div>

            {/* SETTINGS GRID */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 px-1 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all shadow-sm ${
                      isDarkMode
                        ? "bg-[#1a202c] border border-gray-800 hover:border-gray-700"
                        : "bg-white border border-gray-100 hover:shadow-md hover:border-blue-100"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isDarkMode
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-blue-50 text-blue-500"
                      }`}
                    >
                      {option.icon}
                    </div>

                    <div>
                      <h4
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {option.label}
                      </h4>

                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {option.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* DANGER ZONE */}
            <div>
              <h3 className="text-lg font-semibold mb-4 px-1 text-red-500">
                Danger Zone
              </h3>

              <div
                className={`p-4 rounded-xl border border-red-500/30 shadow-sm ${
                  isDarkMode ? "bg-[#1a202c]" : "bg-white"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDarkMode
                          ? "bg-red-500/10 text-red-400"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      <LogOut size={20} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-500">
                        Log Out
                      </h4>

                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Securely sign out of your account
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onLogoutClick}
                    className="w-full md:w-auto px-5 py-3 md:py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <img
                src={userDP}
                alt={displayName}
                className="max-w-[90vw] max-h-[85vh] rounded-2xl object-cover shadow-2xl"
              />

              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-black font-bold shadow-lg hover:scale-110 transition"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}