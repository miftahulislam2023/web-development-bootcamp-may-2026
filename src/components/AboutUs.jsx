import React from "react";
import { motion } from "framer-motion";
import {
  FaWallet,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaRocket,
  FaMobileAlt,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Helmet } from "react-helmet-async";

export default function About() {
  const { t, dark } = useTheme();

  const features = [
    {
      icon: <FaWallet />,
      title: "Smart Expense Tracking",
      desc: "Easily track your daily expenses and manage your money smarter.",
    },
    {
      icon: <FaChartLine />,
      title: "Financial Insights",
      desc: "Visual charts help you understand where your money goes.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Data",
      desc: "Your financial data is safe with modern security practices.",
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile Friendly",
      desc: "Works perfectly on all devices — mobile, tablet, and desktop.",
    },
  ];

  return (
      <>
    <Helmet>
        <title>Spendora || AboutUs</title>
      </Helmet>
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: t.pageBg,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
        
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            ABOUT US
          </span>

          <h1
            className="mt-6 text-3xl sm:text-4xl lg:text-6xl font-black"
            style={{ color: t.text }}
          >
            We Help You Control
            <span style={{ color: t.accent }}> Your Money</span>
          </h1>

          <p
            className="mt-6 text-sm sm:text-base lg:text-lg leading-7 sm:leading-8"
            style={{ color: t.textSub }}
          >
            Spendora is a personal expense tracker built to help you manage,
            analyze, and improve your financial habits. Simple, fast, and
            powerful — everything you need in one place.
          </p>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
        >
          {[
            { label: "Users", value: "10K+" },
            { label: "Transactions", value: "1M+" },
            { label: "Accuracy", value: "99%" },
            { label: "Uptime", value: "24/7" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center border"
              style={{
                background: t.cardBg,
                borderColor: t.border,
              }}
            >
              <h2 className="text-2xl font-bold" style={{ color: t.text }}>
                {item.value}
              </h2>
              <p className="text-sm mt-2" style={{ color: t.textDim }}>
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="rounded-3xl p-6 border"
              style={{
                background: t.cardBg,
                borderColor: t.border,
                boxShadow: `0 10px 25px ${t.shadow}`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{
                  background: t.accent,
                  color: "#fff",
                }}
              >
                {f.icon}
              </div>

              <h3
                className="text-lg font-bold"
                style={{ color: t.text }}
              >
                {f.title}
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{ color: t.textSub }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center rounded-3xl p-10 border"
          style={{
            background: dark
              ? "linear-gradient(135deg, rgba(225,29,72,0.15), rgba(0,0,0,0.2))"
              : "linear-gradient(135deg, rgba(225,29,72,0.08), #fff)",
            borderColor: t.border,
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: t.text }}>
            Start Managing Your Money Smarter Today
          </h2>

          <p className="mt-4 text-sm sm:text-base" style={{ color: t.textSub }}>
            Join thousands of users already using Spendora.
          </p>

          <button
            className="mt-6 px-6 py-3 rounded-xl font-semibold"
            style={{
              background: t.accent,
              color: "#fff",
            }}
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
    </>
  );
}