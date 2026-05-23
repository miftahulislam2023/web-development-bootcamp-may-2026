import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import logo from '../../assets/logo.png';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Provider/AuthProvider';
import auth from '../../firebase/firebase.config';
import { signOut } from 'firebase/auth';


const Navbar = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    const handleThemeChange = () => {
        setIsChecked(prev => {
            const newState = !prev;
            const theme = newState ? "dark" : "light";
            localStorage.setItem("theme", theme);
            document.documentElement.setAttribute("data-theme", theme);
            window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
            return newState;
        });
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const handleSignOut = () => {
        signOut(auth);
        navigate("/login");
        Swal.fire({
            title: "Successfully Logged Out",
            icon: "success"
        });
    }

    const navLinkClass = ({ isActive }) => {
        return `font-bold text-lg leading-none ${isActive
            ? "bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            : "text-base-content hover:text-blue-600"}`;
    };

    const mobileNavLinkClass = ({ isActive }) => {
        return `font-bold text-lg leading-none ${isActive
            ? "bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            : "text-base-content hover:text-blue-600"}`;
    };

    return (
        <div className="navbar bg-base-100 shadow-sm border-b border-base-300 h-20 lg:px-30 mx-auto sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>

                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1000 mt-3 w-64 max-w-[90vw] p-2 shadow-lg border border-base-300 space-y-1"
                    >
                        <li>
                            <NavLink to="/" className={mobileNavLinkClass}>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/dashboard/dashboardhome" className={mobileNavLinkClass}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/categories" className={mobileNavLinkClass}>
                                Categories
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about-us" className={mobileNavLinkClass}>
                                About Us
                            </NavLink>
                        </li>
                         <li>
                            <NavLink to="/contact" className={mobileNavLinkClass}>
                                Contact Us
                            </NavLink>
                        </li>
                        <li className="block lg:hidden pt-2 border-t border-base-content/10 mt-2">
                            <div className='flex items-center justify-between py-2'>
                                <span className="font-semibold text-sm text-base-content">Theme</span>
                                <label className="swap swap-rotate cursor-pointer hover:scale-110 transition-transform duration-200 text-base-content relative">
                                    <input 
                                        type="checkbox" 
                                        className="theme-controller opacity-0 absolute" 
                                        value="synthwave"
                                        checked={isChecked}
                                        onChange={handleThemeChange}
                                    />
                                    <svg
                                        className={`h-6 w-6 fill-current transition-all duration-300 ${isChecked ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                                    </svg>
                                    <svg
                                        className={`h-6 w-6 fill-current transition-all duration-300 absolute top-0 left-0 ${isChecked ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                                    </svg>
                                </label>
                            </div>
                        </li>
                    </ul>
                </div>

                <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <img src={logo} alt="Expense Tracker Logo" className="w-10 h-10 md:w-12 md:h-12" />
                    <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Cashnivo
                    </span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex md:pl-15">
                <ul className="menu menu-horizontal px-1 pt-3 space-x-4">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/dashboard/dashboardhome" className={navLinkClass}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/categories" className={navLinkClass}>
                        Categories
                    </NavLink>

                    <NavLink to="/about-us" className={navLinkClass}>
                        About Us
                    </NavLink>
                    <NavLink to="/contact" className={navLinkClass}>
                        Contact Us
                    </NavLink>
                </ul>
            </div>

            <div className="navbar-end flex items-center gap-3">
                <div className='shrink-0 lg:block hidden'>
                    <label className="swap swap-rotate cursor-pointer hover:scale-110 transition-transform duration-200 text-base-content">
                        <input 
                            type="checkbox" 
                            className="theme-controller opacity-0 absolute" 
                            value="synthwave"
                            checked={isChecked}
                            onChange={handleThemeChange}
                        />
                        <svg
                            className={`h-8 w-8 fill-current transition-all duration-300 ${isChecked ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                        </svg>
                        <svg
                            className={`h-8 w-8 fill-current transition-all duration-300 absolute top-0 left-0 ${isChecked ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                    </label>
                </div>

                {user && (
                    <div className='flex gap-2 items-center'>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform duration-200">
                                <div className="w-10 rounded-full ring-2 ring-blue-500 ring-offset-base-100 ring-offset-2 hover:ring-4 transition-all duration-300">
                                    <img
                                        alt="User Avatar"
                                        src={user?.photoURL}
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-72 p-4 shadow-xl border border-base-300 dark:border-base-content/10">
                                <li className="menu-title px-0 py-2 mb-2">
                                    <div className="flex flex-col gap-1 w-full">
                                        <span className="text-base font-bold text-blue-600 dark:text-blue-400 truncate">
                                            {user?.displayName}
                                        </span>
                                        <span className="text-xs text-base-content/70 wrap-break-word leading-relaxed">
                                            {user?.email}
                                        </span>
                                    </div>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <button onClick={handleSignOut} className="text-base-content hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors duration-200 py-2.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="font-semibold">Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {!user && (
                    <Link
                        to={'/login'}
                        className="btn bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-none shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-lg font-bold px-6"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;