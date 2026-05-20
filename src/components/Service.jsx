import React from "react";
import {
  FaWallet,
  FaChartPie,
  FaReceipt,
  FaChartLine,
  FaLock,
  FaMobileAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const services = [
  {
    title: "Expense Tracking",
    desc: "Track your daily, weekly, and monthly expenses with smart categorization and real-time updates.",
    icon: <FaWallet />,
  },
  {
    title: "Budget Planning",
    desc: "Set monthly budgets and monitor your spending habits to stay financially disciplined.",
    icon: <FaChartPie />,
  },
  {
    title: "Transaction History",
    desc: "View complete transaction history with advanced filtering and expense insights.",
    icon: <FaReceipt />,
  },
  {
    title: "Analytics Dashboard",
    desc: "Visualize income, savings, and expenses using beautiful charts and statistics.",
    icon: <FaChartLine />,
  },
  {
    title: "Secure Cloud Storage",
    desc: "Your expense data stays protected with secure cloud synchronization and backups.",
    icon: <FaLock / >,
  },
  {
    title: "Multi Device Access",
    desc: "Access your expense tracker seamlessly from desktop, tablet, or mobile devices.",
    icon: <FaMobileAlt />,
  },
];

const Service = () => {
  const { dark, t } = useTheme();

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-10"
      style={{
        background: t.pageBg,
      }}
    >
      {/* background blur orbs */}
      <div
        className="absolute top-0 left-0 w-60 sm:w-72 h-60 sm:h-72 rounded-full blur-3xl"
        style={{ background: t.orb }}
      />

      <div
        className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl"
        style={{ background: t.orb2 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide"
            style={{
              background: t.badge,
              border: `1px solid ${t.badgeBd}`,
              color: t.badgeTx,
            }}
          >
            OUR SERVICES
          </span>

          <h1
            className="mt-6 text-3xl sm:text-4xl lg:text-6xl font-black leading-tight"
            style={{ color: t.text }}
          >
            Smart Financial Tools
            <span style={{ color: t.accent }}>
              {" "}
              For Everyday Life
            </span>
          </h1>

          <p
            className="mt-6 text-sm sm:text-base lg:text-lg leading-7 sm:leading-8 px-2"
            style={{ color: t.textSub }}
          >
            Manage your personal finances effortlessly with Spendora.
            Track expenses, analyze spending patterns, and achieve your
            financial goals with modern tools built for smarter money
            management.
          </p>
        </motion.div>

        {/* services grid */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                transition: { duration: 0.25 },
              }}
              className="group relative overflow-hidden rounded-3xl p-6 sm:p-7 lg:p-8 border"
              style={{
                background: t.cardBg,
                borderColor: t.border,
                boxShadow: `0 12px 32px ${t.shadow}`,
              }}
            >
              {/* hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: dark
                    ? "linear-gradient(to bottom right, rgba(225,29,72,0.14), transparent)"
                    : "linear-gradient(to bottom right, rgba(225,29,72,0.08), transparent)",
                }}
              />

              <div className="relative z-10">
                {/* icon */}
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl"
                  style={{
                    background: t.accent,
                    color: "#ffffff",
                    border: `1px solid ${t.borderLight}`,
                  }}
                >
                  {service.icon}
                </motion.div>

                {/* title */}
                <h3
                  className="mt-6 text-xl sm:text-2xl font-bold"
                  style={{ color: t.text }}
                >
                  {service.title}
                </h3>

                {/* description */}
                <p
                  className="mt-4 text-sm sm:text-base leading-7"
                  style={{ color: t.textSub }}
                >
                  {service.desc}
                </p>

                {/* button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.03 }}
                  className="mt-7 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{
                    background: t.pillBg,
                    color: t.accent,
                    border: `1px solid ${t.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = t.accent;
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = t.pillBg;
                    e.currentTarget.style.color = t.accent;
                  }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;