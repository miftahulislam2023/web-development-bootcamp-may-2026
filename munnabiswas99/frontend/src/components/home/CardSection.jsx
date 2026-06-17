import React from "react";
import { NavLink } from "react-router";
import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

import income from "../../assets/banner/income.png";
import expense from "../../assets/banner/expense.png";
import savings from "../../assets/banner/savings.png";
import investment from "../../assets/banner/investment.png";

const CardSection = () => {
  return (
    <div className="my-10 px-4 md:px-8">
      <h1 className="text-2xl md:text-5xl font-bold text-center mt-20 md:mt-30">
        Optimize And Track <br /> Your Financial Data
      </h1>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 2 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-14 md:mt-20 mb-10"
      >
        {/* Card 1 */}
        <div className="bg-secondary rounded-xl p-5 shadow-lg hover:bg-primary text-gray-200">
          <h1 className="text-xl md:text-2xl font-semibold">
            Monthly Income
          </h1>

          <img
            className="rounded-2xl my-5 w-full"
            src={income}
            alt=""
          />

          <h1 className="text-xl md:text-2xl font-bold mb-2">
            Understand Net Worth
          </h1>

          <p className="text-gray-300 text-sm md:text-base">
            View your assets and liabilities in one place.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-secondary rounded-xl p-5 shadow-lg hover:bg-primary text-gray-200">
          <h1 className="text-xl md:text-2xl font-semibold">
            Recent Transaction
          </h1>

          <img
            className="rounded-2xl my-5 w-full"
            src={expense}
            alt=""
          />

          <h1 className="text-xl md:text-2xl font-bold mb-2">
            Track Spending
          </h1>

          <p className="text-gray-300 text-sm md:text-base">
            See where your money goes every month.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-secondary rounded-xl p-5 shadow-lg hover:bg-primary text-gray-200">
          <h1 className="text-xl md:text-2xl font-semibold">
            Monthly Expense
          </h1>

          <img
            className="rounded-2xl my-5 w-full"
            src={savings}
            alt=""
          />

          <h1 className="text-xl md:text-2xl font-bold mb-2">
            Review Expense
          </h1>

          <p className="text-gray-300 text-sm md:text-base">
            Keep track of monthly expenses and save more effectively.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-secondary rounded-xl p-5 shadow-lg hover:bg-primary text-gray-200">
          <h1 className="text-xl md:text-2xl font-semibold">
            Investment Plan
          </h1>

          <img
            className="rounded-2xl my-5"
            src={investment}
            alt=""
          />

          <h1 className="text-xl md:text-2xl font-bold mb-2">
            Smart Investment
          </h1>

          <p className="text-gray-300 text-sm md:text-base">
            Monitor your investments and grow your financial future.
          </p>
        </div>
      </motion.div>

      <NavLink
        to="/register"
        className="bg-primary-text text-white px-6 py-3 rounded flex gap-2 items-center w-fit font-semibold mx-auto"
      >
        Get started for free
        <FaArrowRight />
      </NavLink>
    </div>
  );
};

export default CardSection;