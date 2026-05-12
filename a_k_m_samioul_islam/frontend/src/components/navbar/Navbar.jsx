import React, { useState } from 'react';
import { Menu, Wallet, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const navigate = useNavigate();

    // Navbar styles

    const navClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium transition-all duration-500
    rounded-full
    text-white hover:bg-white/10 transition-all
    ${isActive ? "text-white bg-white/10" : "text-gray-400"}`;

    return (
        <div className='inter w-full bg-black flex items-center h-25 shadow-2xl sticky top-0 z-50'>
            <nav className='w-full max-w-360 flex justify-between items-center mx-auto px-5'>
                
                {/* Logo */}

                <NavLink to="/" className='lobster flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-lg bg-white text-black flex justify-center items-center'><Wallet/></div>
                    
                    <h1 className='text-xl text-white font-bold'>WalletWatch</h1>
                </NavLink>

                {/* Home route */}

                <div className='hidden lg:flex gap-5 items-center'>
                    <NavLink to="/" className={navClass}>Home</NavLink>
                </div>

                {/* Authentication routes */}

                <div className='hidden lg:flex gap-5 items-center'>
                    <NavLink to="/login" className={navClass}>Log in</NavLink>
                    <button onClick={() => navigate("/register")} className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium border transition-colors duration-500
                    ${location.pathname === "/register"
                    ? "bg-white text-black border-black"
                    : "bg-black text-white border-white hover:bg-white hover:text-black hover:border-black"
                    }`}>Get Started</button>
                </div>

                {/* Hamburger menu */}

                <div className='flex items-center lg:hidden'>
                    <button onClick={toggleMenu} className="cursor-pointer">
                        {
                            isOpen
                                ?
                                <X className='text-white' />
                                :
                                <Menu className='text-white' />
                        }
                    </button>
                </div>

                {/* For Small Devices */}

                <div className={`absolute font-medium top-25 left-0 w-full bg-black flex flex-col items-center py-6 shadow-lg lg:hidden gap-6 z-50 transform transition-all duration-300 ease-in-out
                        ${isOpen ? "translate-y-0 opacity-100 max-h-125" : "-translate-y-10 opacity-0 max-h-0 overflow-hidden"}`}>
                    <NavLink onClick={toggleMenu} to="/" className={navClass}>Home</NavLink>
                    <NavLink onClick={toggleMenu} to="/login" className={navClass}>Log in</NavLink>
                    <button onClick={() => {
                        navigate("/register");
                        toggleMenu();
                    }} className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium border transition-colors duration-500
                    ${location.pathname === "/register"
                    ? "bg-white text-black border-black"
                    : "bg-black text-white border-white hover:bg-white hover:text-black hover:border-black"
                    }`}>Get Started</button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;