import React from "react";
import {
  FaPiggyBank,
  FaChartLine,
  FaCalendarCheck,
  FaBell,
  FaShieldAlt,
  FaCloudUploadAlt,
  FaTags,
  FaMobileAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    title: "Smart Expense Tracking",
    desc: "Automatically categorize and track every expense in real time.",
    icon: <FaPiggyBank />,
  },
  {
    title: "Income Analytics",
    desc: "Understand your income vs spending with clear visual insights.",
    icon: <FaChartLine />,
  },
  {
    title: "Monthly Reports",
    desc: "Get detailed monthly summaries of your financial activities.",
    icon: <FaCalendarCheck />,
  },
  {
    title: "Smart Notifications",
    desc: "Get alerts when you exceed budget or hit spending limits.",
    icon: <FaBell />,
  },
  {
    title: "Bank-Level Security",
    desc: "Your data is encrypted and protected with modern security systems.",
    icon: <FaShieldAlt />,
  },
  {
    title: "Cloud Backup",
    desc: "All your data is safely backed up and synced across devices.",
    icon: <FaCloudUploadAlt />,
  },
  {
    title: "Expense Categories",
    desc: "Organize spending into custom categories for better control.",
    icon: <FaTags />,
  },
  {
    title: "Mobile Friendly",
    desc: "Fully responsive design that works smoothly on any device.",
    icon: <FaMobileAlt />,
  },
];

const Features = () => {
  const { dark, t } = useTheme();

  return (
    <section id=""
      className="relative overflow-hidden py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-10"
      style={{ background: t.pageBg }}
    >
      {/* background effects */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl"
        style={{ background: t.orb }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ background: t.orb2 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold"
            style={{
              background: t.badge,
              border: `1px solid ${t.badgeBd}`,
              color: t.badgeTx,
            }}
          >
            FEATURES
          </span>

          <h1
            className="mt-6 text-3xl sm:text-4xl lg:text-6xl font-black leading-tight"
            style={{ color: t.text }}
          >
            Powerful Features
            <span style={{ color: t.accent }}> For Your Finance</span>
          </h1>

          <p
            className="mt-6 text-sm sm:text-base lg:text-lg leading-7 sm:leading-8"
            style={{ color: t.textSub }}
          >
            Everything you need to manage your personal expenses in one place.
            Simple, fast, and intelligent tools built for your daily life.
          </p>
        </motion.div>

        {/* grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl p-6 border overflow-hidden"
              style={{
                background: t.cardBg,
                borderColor: t.border,
                boxShadow: `0 10px 28px ${t.shadow}`,
              }}
            >
              {/* hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: dark
                    ? "linear-gradient(to bottom right, rgba(225,29,72,0.12), transparent)"
                    : "linear-gradient(to bottom right, rgba(225,29,72,0.06), transparent)",
                }}
              />

              <div className="relative z-10">
                {/* icon */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{
                    background: t.accent,
                    color: "#ffffff",
                  }}
                >
                  {item.icon}
                </motion.div>

                {/* title */}
                <h3
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: t.text }}
                >
                  {item.title}
                </h3>

                {/* desc */}
                <p
                  className="mt-3 text-sm leading-6"
                  style={{ color: t.textSub }}
                >
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;