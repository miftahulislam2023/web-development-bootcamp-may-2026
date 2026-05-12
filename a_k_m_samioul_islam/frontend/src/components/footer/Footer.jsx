import { Wallet } from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { AiOutlineGlobal } from "react-icons/ai";

const Footer = () => {
  return (
    <div>
      <footer className="footer footer-horizontal footer-center bg-black text-inter p-10">
        <aside>
          <NavLink to="/" className="lobster flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white text-black flex justify-center items-center">
              <Wallet />
            </div>
            <h1 className="text-xl text-white font-bold">WalletWatch</h1>
          </NavLink>
        </aside>

        {/* Social links */}

        <nav>
          <div className="grid grid-flow-col gap-4">
            <a href="https://akm-samioul-islam.vercel.app/" target="_blank"><AiOutlineGlobal className='w-6 h-6' /></a>
            <a href="https://github.com/Samioul51" target="_blank"><FaGithub className='w-6 h-6' /></a>
            <a href="https://www.linkedin.com/in/a-k-m-samioul-islam/" target="_blank"><FaLinkedin className='w-6 h-6' /></a>
          </div>
        </nav>

        {/* Copyright */}

        <p>&copy; {new Date().getFullYear()} A. K. M Samioul Islam - All right reserved</p>

      </footer>
    </div>
  );
};

export default Footer;
