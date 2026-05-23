import { signOut } from 'firebase/auth';
import { LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import auth from '../../firebase/firebase.config';
import { Link, NavLink } from 'react-router';
import {  MdDashboard, MdOutlineAddCircle } from 'react-icons/md';
import logo from '../../assets/logo.png';
import { PiUserCircleGearFill } from "react-icons/pi";
import { SiMoneygram } from 'react-icons/si';

const Aside = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    };

    const navLinks = [
        { to: '/dashboard/dashboardhome', end: true, icon:<MdDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/dashboard/add-transaction', icon: <MdOutlineAddCircle className="w-5 h-5" />, label: 'Add Transaction' },
        { to: '/dashboard/Profile', icon: <PiUserCircleGearFill className="w-5 h-5" />, label: 'Profile' },
        { to: '/dashboard/transactions', icon: <SiMoneygram className="w-5 h-5" />, label: 'Transction' },
    ];

    const activeClass = 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm';
    const inactiveClass = 'text-base-content hover:bg-blue-50 hover:text-blue-600';

    
    const desktopSidebar = (
        <aside className={`hidden md:flex h-screen sticky top-0 ${isOpen ? 'w-56' : 'w-20'} bg-base-100 border-r border-base-content/10 flex-col shadow-lg transition-all duration-300 z-50 shrink-0`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute top-4 ${isOpen ? 'right-4' : 'left-1/2 -translate-x-1/2'} bg-base-100 border border-base-content/10 rounded-full p-1.5 shadow-md hover:border-blue-300 transition-all duration-200 z-20`}
            >
                {isOpen ? <ChevronLeft size={16} className="text-base-content/60" /> : <ChevronRight size={16} className="text-base-content/60" />}
            </button>

            <div className="px-4 pt-12 pb-5 border-b border-base-content/10 bg-base-100 shrink-0">
                <Link to="/" className={`flex items-center gap-2 hover:opacity-90 transition-opacity ${!isOpen ? 'justify-center' : ''}`}>
                    <img src={logo} alt="Logo" className="w-10 h-10 shrink-0" />
                    {isOpen && (
                        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Cashnivo
                        </span>
                    )}
                </Link>
            </div>

            <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
                {navLinks.map(({ to, end, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? activeClass : inactiveClass} ${!isOpen ? 'justify-center' : ''}`
                        }
                    >
                        {icon}
                        {isOpen && <span className="font-medium text-[13px] whitespace-nowrap">{label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-2 border-t border-base-content/10 bg-base-100 shrink-0">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-base-content hover:bg-red-50 hover:text-red-600 border border-base-content/10 hover:border-red-200 transition-all duration-200 ${!isOpen ? 'justify-center' : ''}`}
                >
                    <LogOut size={18} />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );

   
    const mobileSidebar = (
        <>
            <aside className="md:hidden h-screen sticky top-0 w-14 bg-base-100 border-r border-base-content/10 flex flex-col shadow-sm z-40 shrink-0">
                <Link to="/" className="flex items-center justify-center pt-10 pb-5 border-b border-base-content/10 hover:opacity-90 transition-opacity">
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                </Link>

                <nav className="flex-1 flex flex-col items-center gap-1 py-4 overflow-y-auto">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2.5 rounded-lg text-base-content hover:bg-blue-50 hover:text-blue-600 transition-all"
                        title="Open menu"
                    >
                        <ChevronRight size={18} />
                    </button>

                    {navLinks.map(({ to, end, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            title={label}
                            className={({ isActive }) =>
                                `p-2.5 rounded-lg transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
                            }
                        >
                            {icon}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-2 border-t border-base-content/10">
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="w-full flex justify-center p-2.5 rounded-lg text-base-content hover:bg-red-50 hover:text-red-600 border border-base-content/10 hover:border-red-200 transition-all"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

  
            {isOpen && (
                <>
                
                    <div
                        className="md:hidden fixed inset-0 bg-black/40 z-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="md:hidden fixed top-0 left-0 h-screen w-56 bg-base-100 shadow-2xl z-50 flex flex-col">
                        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-base-content/10">
                            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                                <img src={logo} alt="Logo" className="w-9 h-9" />
                                <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Cashnivo
                                </span>
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-base-200 transition-colors"
                            >
                                <X size={18} className="text-base-content/60" />
                            </button>
                        </div>

                        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
                            {navLinks.map(({ to, end, icon, label }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
                                    }
                                >
                                    {icon}
                                    <span className="font-medium text-[13px]">{label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        <div className="p-3 border-t border-base-content/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-base-content hover:bg-red-50 hover:text-red-600 border border-base-content/10 hover:border-red-200 transition-all"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );

    return (
        <>
            {desktopSidebar}
            {mobileSidebar}
        </>
    );
};

export default Aside;