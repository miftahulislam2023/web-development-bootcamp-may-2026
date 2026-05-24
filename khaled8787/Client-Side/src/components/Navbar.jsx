import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Wallet,
  Menu,
  X,
  UserCircle,
  LogOut,
} from "lucide-react";

export default function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#071028]/80 backdrop-blur-md text-white">

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link
          to="/"
          className="flex items-center gap-2 group"
        >

          <div className="bg-cyan-500 p-2 rounded-lg group-hover:rotate-12 duration-300">

            <Wallet
              size={24}
              className="text-white"
            />

          </div>

          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">

            FinTrack
            <span className="text-cyan-400">
              Pro
            </span>

          </h1>

        </Link>

        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/features"
            className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
          >
            Features
          </Link>

          

          <Link
            to="/about"
            className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
          >
            About
          </Link>

          {token && (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Dashboard
            </Link>
          )}

          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          {!token ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm font-medium hover:text-cyan-400 duration-300"
              >

                <UserCircle size={18} />

                Login

              </Link>

              <Link
                to="/register"
                className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden font-bold text-white transition duration-300 ease-out bg-cyan-600 rounded-full shadow-lg group"
              >

                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-cyan-500 group-hover:translate-x-0 ease font-bold">

                  Click Me!

                </span>

                <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">

                  Register Now

                </span>

                <span className="relative invisible">

                  Register Now

                </span>

              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="group relative flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-400 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400 overflow-hidden"
            >
              <LogOut size={18} className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110" />

              <span className="relative">
                Logout
              </span>

              <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-300" />

              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          )}

        </div>

        <div className="md:hidden">

          <button
            onClick={() =>
              setIsOpen(!isOpen)
            }
          >

            {
              isOpen ? (
                <X className="text-gray-300 cursor-pointer" />
              ) : (
                <Menu className="text-gray-300 cursor-pointer" />
              )
            }

          </button>

        </div>

      </div>

      {
        isOpen && (

          <div className="md:hidden px-6 pb-6">

            <div className="flex flex-col gap-5 bg-[#071028]/95 border border-white/10 rounded-2xl p-6">

              <Link
                to="/features"
                onClick={() =>
                  setIsOpen(false)
                }
                className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Features
              </Link>

              <Link
  to="/mood-tracker"
  className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
>
  Mood Tracker
</Link>

              <Link
                to="/about"
                onClick={() =>
                  setIsOpen(false)
                }
                className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
              >
                About
              </Link>

              {
                token && (
                  <Link
                    to="/dashboard"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  
                  
                )
              }

              {
                !token ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() =>
                        setIsOpen(false)
                      }
                      className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() =>
                        setIsOpen(false)
                      }
                      className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden font-bold text-white transition duration-300 ease-out bg-cyan-600 rounded-full shadow-lg group"
                    >

                      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-cyan-500 group-hover:translate-x-0 ease font-bold">

                        Click Me!

                      </span>

                      <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">

                        Register Now

                      </span>

                      <span className="relative invisible">

                        Register Now

                      </span>

                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="group relative flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-400 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400 overflow-hidden"
                  >
                    <LogOut size={18} />

                    Logout
                  </button>
                )
              }

            </div>

          </div>
        )
      }

    </nav>
  );
}