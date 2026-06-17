import React from "react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6";
import { Link, NavLink } from "react-router";
import { LuCopyright } from "react-icons/lu";
import Logo from "../logo/Logo";

const Footer = () => {
  return (
    <div className="bg-gray-900 p-10 rounded-xl my-4 text-secondary-text">
        <div className="flex justify-center md:justify-start"><Logo></Logo></div>
        <div className="flex justify-center gap-5 md:gap-20 my-10">
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/dashboard'>Dashboard</NavLink>
            <NavLink to='/about'>About Us</NavLink>
        </div>
        <div className="flex justify-center gap-4 md:gap-10 text-2xl my-5">
            <Link to="https://github.com/munnabiswas99"><FaGithub /></Link>
            <Link to="https://www.linkedin.com/in/munnabiswas99/"><FaLinkedin /></Link>
            <Link to="https://www.facebook.com/munnabiswas999/"><FaFacebook /></Link>
        </div>
        <div className="md:flex text-center justify-center my-10">
            <p className="flex gap-2 items-center justify-center">Copyright <span className="text-xl"><LuCopyright /></span> {new Date().getFullYear()}</p>
            <p>- All right reserved by Munna Biswas</p>
        </div>
    </div>
  );
};

export default Footer;
