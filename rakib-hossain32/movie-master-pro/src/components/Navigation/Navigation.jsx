import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate, useLocation } from "react-router";
import {
  Film,
  Home,
  Clapperboard,
  Heart,
  Menu,
  X,
  LogOut,
  Plus,
  UserPlus,
  LogIn,
  Sparkles,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  Blocks,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { MobileItem } from "./MobileItem";
import { NavItem } from "./NavItem";
import { DropdownItem } from "./DropdownItem";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Navigation() {
  const {
    user: currentUser,
    showMobileMenu,
    setShowMobileMenu,
    signOutUser,
  } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect Scroll for Floating Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowDropdown(false);
    setShowMobileMenu(false);
  }, [location.pathname, setShowMobileMenu]);

  const handleLogout = () => {
    signOutUser().then(() => setShowDropdown(false));
  };

  return (
    <>
      {/* --- Main Floating Navbar --- */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
      >
        <nav
          className={`w-full max-w-6xl transition-all duration-500 ease-in-out rounded-3xl ${
            isScrolled
              ? "bg-base-100/70 dark:bg-base-200/60 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/20 dark:border-white/5 py-2 px-3"
              : "bg-transparent py-4 px-2"
          }`}
        >
          <div className="flex items-center justify-between px-2">
            {/* Logo Section: Cinematic Glass */}
            <NavLink to="/" className="group flex items-center gap-3">
              {/* Icon Container */}
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary text-white shadow-lg shadow-primary/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/60">
                {/* Abstract Background Shapes */}
                <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white/20 blur-md"></div>
                <div className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full bg-black/10 blur-md"></div>

                {/* Icon */}
                <Sparkles className="relative z-10 h-6 w-6 fill-white text-white transition-transform duration-500 group-hover:rotate-12" />

                {/* Glossy Sheen Overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              </div>

              {/* Text Container */}
              <div className="md:flex hidden flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-base-content">
                    Movie<span className="text-primary"> Master</span>
                  </span>
                  {/* Premium Badge */}
                  <span className="flex items-center justify-center rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-black tracking-widest text-primary">
                    PRO
                  </span>
                </div>
                <span className="text-[0.65rem] font-medium tracking-wide text-base-content/50">
                  Ultimate Streaming Guide
                </span>
              </div>
            </NavLink>

            {/* Desktop Menu (Center Island) */}
            <div className="hidden lg:flex items-center bg-base-200/40 dark:bg-base-300/20 p-1.5 rounded-full backdrop-blur-md border border-white/10 dark:border-white/5 shadow-inner">
              <NavItem to="/" icon={Home} label="Home" />
              <NavItem to="/all-movies" icon={Clapperboard} label="Movies" />
              <NavItem to="/blogs" icon={Blocks} label="Blogs" />
              <NavItem to="/support" icon={HelpCircle} label="Support" />
              {currentUser && (
                <>
                  <div className="w-px h-5 bg-base-content/10 mx-2"></div>

                  <NavItem to="/watchlist" icon={Heart} label="Watchlist" />
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle Component Restored */}
              <ThemeToggle />

              {currentUser ? (
                <div className="relative z-50">
                  {/* User Profile Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-base-200/50 dark:bg-base-300/30 border border-white/10 hover:border-primary/30 transition-all group overflow-hidden relative cursor-pointer"
                  >
                    <div className="relative">
                            {/* <img
                              src={currentUser.photoURL}
                              alt="user"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-base-100 group-hover:ring-primary transition-all"
                            /> */}
                      <LazyLoadImage
                        src={currentUser.photoURL}
                        alt="user"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-base-100 group-hover:ring-primary transition-all"
                        effect="blur"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-base-100 rounded-full"></span>
                    </div>

                    <div className="hidden xl:flex flex-col items-start text-sm">
                      <span className="font-bold text-base-content truncate max-w-25">
                        {currentUser.displayName?.split(" ")[0]}
                      </span>
                      <span className="text-[0.65rem] text-base-content/60 font-medium">
                        Member
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-base-content/50 transition-transform duration-300 ${
                        showDropdown && "rotate-180 text-primary"
                      }`}
                    />
                  </motion.button>

                  {/* Premium Dropdown */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                          scale: 0.9,
                          filter: "blur(10px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                          scale: 0.9,
                          filter: "blur(10px)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute right-0 mt-4 w-72 p-2 rounded-4xl bg-base-100/80 dark:bg-base-200/80 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden z-50 origin-top-right"
                      >
                        {/* Decorative header blur */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-primary/10 to-transparent -z-10"></div>

                        <div className="p-4 flex items-center gap-4 mb-2">
                          {/* <img
                            src={currentUser.photoURL}
                            className="w-14 h-14 rounded-2xl shadow-md"
                            alt=""
                          /> */}
                          <LazyLoadImage
                            src={currentUser.photoURL}
                            alt="user"
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-2xl shadow-md"
                            effect="blur"
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-lg text-base-content truncate">
                              {currentUser.displayName}
                            </h4>
                            <p className="text-xs text-base-content/60 truncate font-mono">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>

                        <div className="bg-base-100/50 dark:bg-base-300/30 rounded-3xl p-2 space-y-1 border border-white/5">
                          <DropdownItem
                            icon={User}
                            label="View Profile"
                            onClick={() => navigate("/dashboard/profile")}
                          />
                          <DropdownItem
                            icon={Settings}
                            label="Dashboard"
                            onClick={() => navigate("/dashboard")}
                          />
                        </div>

                        <div className="mt-2 p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold text-white rounded-3xl bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all group cursor-pointer"
                          >
                            <span className="flex items-center gap-3">
                              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                              Sign Out
                            </span>
                            <ChevronDown className="w-4 h-4 -rotate-90 opacity-50 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <NavLink
                    to="/signin"
                    className="px-6 py-3 text-sm font-bold text-base-content rounded-full transition-all bg-base-200/50 hover:bg-base-200/80  hover:text-base-content/80"
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="relative group px-6 py-3 text-sm font-bold text-white rounded-full overflow-hidden shadow-xl shadow-primary/30"
                  >
                    <span className="absolute inset-0 w-full h-full bg-linear-to-br from-primary via-primary to-primary/80 group-hover:scale-105 transition-transform duration-500"></span>
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="w-4 h-4 fill-white/30 animate-pulse" />{" "}
                      Get Started
                    </span>
                  </NavLink>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-3 rounded-full bg-base-200/50 dark:bg-base-300/30 hover:bg-base-200/80 text-base-content/80 transition-colors cursor-pointer"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.div>

      {/* --- Ultra-Modern Mobile Menu --- */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 left-0 right-0 z-50 p-4 lg:hidden"
            >
              <div className="bg-base-100/90 dark:bg-base-200/90 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-5 flex items-center justify-between border-b border-base-200/50">
                  <span className="text-xl font-black bg-clip-text text-transparent bg-linear-to-r from-base-content to-primary">
                    Menu
                  </span>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-full bg-base-200/50 hover:bg-base-300/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-base-content/70" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  <MobileItem to="/" icon={Home} label="Home" />
                  <MobileItem
                    to="/all-movies"
                    icon={Clapperboard}
                    label="All Movies"
                  />
                  <MobileItem to="/blogs" icon={Blocks} label="Blogs" />
                  <MobileItem to="/support" icon={HelpCircle} label="Support" />
                  {currentUser && (
                    <>
                      <div className="h-px bg-base-content/5 my-2 mx-6"></div>

                      {/* <MobileItem
                        to="/my-collection"
                        icon={Film}
                        label="My Collection"
                      /> */}
                      <MobileItem
                        to="/watchlist"
                        icon={Heart}
                        label="Watchlist"
                      />
                      {/* <MobileItem
                        to="/add-movie"
                        icon={Plus}
                        label="Add Movie"
                        isNew={true}
                      /> */}
                    </>
                  )}

                  <div className="mt-4 p-4 bg-base-200/30 flex flex-col gap-3 sm:hidden dark:bg-base-300/20 rounded-4xl">
                    {!currentUser && (
                      // (
                      // <button
                      //   onClick={handleLogout}
                      //   className="w-full flex items-center justify-center gap-3 px-4 py-4 text-lg font-bold text-white rounded-2xl bg-linear-to-r from-primary to-primary/80 shadow-lg shadow-primary/20"
                      // >
                      //   <LogOut className="w-6 h-6" /> Log Out
                      // </button>
                      // )
                      <div className="flex flex-col gap-3 sm:hidden">
                        <NavLink
                          to="/signin"
                          className="flex items-center justify-center gap-2 px-4 py-4 text-lg font-bold text-base-content bg-base-100/50 rounded-2xl border border-base-200/50"
                        >
                          <LogIn className="w-5 h-5" /> Login
                        </NavLink>
                        <NavLink
                          to="/register"
                          className="flex items-center justify-center gap-2 px-4 py-4 text-lg font-bold text-white bg-primary rounded-2xl shadow-lg shadow-primary/20"
                        >
                          <UserPlus className="w-5 h-5" /> Register Free
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
