import React from "react";
import { FaWallet, FaChartLine, FaShieldAlt, FaBullseye } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineTrackChanges } from "react-icons/md";
import { NavLink } from "react-router";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-16 px-5 md:px-12 lg:px-20 rounded-lg">
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          About Our Finance Tracker
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          A smart personal finance management platform designed to help users
          track income, expenses, savings, investments, and wallet balances in
          one centralized dashboard.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {/* Mission */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:bg-gray-300">
          <div className="w-16 h-16 bg-blue-100 text-black rounded-2xl flex items-center justify-center text-3xl mb-6">
            <FaBullseye />
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>

          <p className="text-gray-600 text-lg">
            Our mission is to help people easily track their income, expenses,
            and wallet balances with building smarter financial habits in
            everyday life.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:bg-gray-300">
          <div className="w-16 h-16 bg-blue-100 text-black-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
            <MdOutlineTrackChanges />
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h2>

          <p className="text-gray-600 text-lg">
            Our vision is to help people make confident financial decisions,
            stay organized, and build a more secure financial future with the
            support of modern technology.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us ?
          </h2>

          <p className="text-gray-600 text-lg">
            Powerful features designed for modern financial tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:bg-gray-300">
            <div className="text-5xl mb-6">
              <FaWallet />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-black">
              Wallet Management
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Manage multiple wallets including bank accounts, mobile banking,
              and cash balances with real-time updates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:bg-gray-300">
            <div className="text-5xl mb-6">
              <FaChartLine />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-black">
              Expense Analytics
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Analyze income, expenses, savings, and investments using visual
              charts and monthly financial reports.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:bg-gray-300">
            <div className="text-5xl mb-6">
              <FaShieldAlt />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-black">
              Secure Transactions
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Your financial data is protected with authentication, secure APIs,
              and controlled transaction management.
            </p>
          </div>
        </div>
        <div className="w-fit flex mx-auto mt-10">
          <NavLink
            to="/register"
            className="bg-primary-text text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            Get started for free <FaArrowRight></FaArrowRight>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default About;
