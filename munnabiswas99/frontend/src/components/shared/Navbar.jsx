import { useState } from "react";
import Logo from "../logo/Logo";
import { GiCancel } from "react-icons/gi";
import { AiOutlineMenuFold } from "react-icons/ai";
import { NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logOut } = useAuth();

  const links = (
    <>
      <li>
        <NavLink className="rounded-lg bg-secondary hover:bg-primary px-4 py-2 text-white" to="/">Home</NavLink>
      </li>
      <li>
        <NavLink className="rounded-lg bg-secondary hover:bg-primary px-4 py-2 text-white" to="/dashboard">Dashboard</NavLink>
      </li>
      <li>
        <NavLink className="rounded-lg bg-secondary hover:bg-primary px-4 py-2 text-white" to="/about">About</NavLink>
      </li>
    </>
  );

  const handleLogout = () => {
    logOut()
      .then(() => {
        console.log("User Logout");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="my-3 rounded-xl shadow-lg bg-gray-50">
      {/* Desktop Menu */}
      <div className="flex justify-between p-3 items-center">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Logo></Logo>
          <button onClick={() => setOpen(!open)} className="md:hidden text-3xl text-secondary">
            {open ? <GiCancel /> : <AiOutlineMenuFold />}
          </button>
        </div>
        <div>
          <ul className="hidden md:flex gap-6">{links}</ul>
        </div>
        <div className="hidden md:flex gap-2">
          {user ? (
            <>
              <NavLink to='/profile'>
                <img className="rounded-full w-10 h-10 object-cover" src={user.photoURL} alt="profile" />
              </NavLink>

              <button
                onClick={handleLogout}
                className="rounded px-3 py-1 text-primary-text bg-gray-300 hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded px-3 py-1 text-secondary-text bg-primary-text"
              >
                SignIn
              </NavLink>
              <NavLink
                to="/register"
                className="rounded px-3 py-1 text-primary-text bg-gray-300"
              >
                SignUp
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-2/3 w-64 bg-black/40 backdrop-blur-md rounded-xl text-white p-5 transition-transform duration-300 md:hidden ${
          open ? "translate-y-2 -translate-x-2" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <button onClick={() => setOpen(false)} className="text-3xl mb-10">
            <GiCancel />
          </button>
        </div>

        <ul className="flex flex-col gap-5">{links}</ul>

        <div className="flex gap-3 mt-10">
          {user ? (
            <>
              <NavLink to="/profile">
                <img className="rounded-full w-10 h-10 object-cover" src={user.photoURL} alt="profile" />
              </NavLink>

              <button
                onClick={handleLogout}
                className="rounded px-3 py-1 text-primary-text bg-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded px-3 py-1 text-secondary-text bg-primary-text"
              >
                SignIn
              </NavLink>
              <NavLink
                to="/register"
                className="rounded px-3 py-1 text-primary-text bg-white"
              >
                SignUp
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;