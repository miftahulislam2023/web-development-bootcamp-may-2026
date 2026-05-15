import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  ChevronDown,
  Send,
  Globe,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommonPageHeader from "../../components/CommonPageHeader";

const Support = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-base-100 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-primary/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[150px] -z-10" />

      {/* --- Header --- */}
      <CommonPageHeader
        title="Help & Support"
        subtitle="We're here to help you with any questions or issues you may have."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* ==================== 1. CONTACT CHANNELS (Bento Grid) ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Email Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-4xl bg-base-100 border border-base-content/10 shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <Mail size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-base-content/60 mb-4 text-sm">
              Get a response within 24 hours.
            </p>
            <a
              href="mailto:support@moviemaster.com"
              className="text-blue-500 font-bold hover:underline "
            >
              <p className="truncate">
                support@moviemaster.com
              </p>
            </a>
          </motion.div>

          {/* Card 2: Live Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-4xl bg-linear-to-br from-primary to-red-900 text-white shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p className="text-white/80 mb-4 text-sm">
              Chat with our support team instantly.
            </p>
            <button className="px-6 py-2 rounded-xl bg-white text-primary font-bold hover:bg-gray-100 transition-colors">
              Start Chat
            </button>
          </motion.div>

          {/* Card 3: Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-4xl bg-base-100 border border-base-content/10 shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Headquarters</h3>
            <p className="text-base-content/60 mb-4 text-sm">
              Dhaka, Bangladesh
            </p>
            <a href="#" className="text-green-500 font-bold hover:underline">
              View on Map
            </a>
          </motion.div>
        </div>

        {/* ==================== 2. FAQ & FORM SECTION ==================== */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* --- Left: FAQ --- */}
          <div>
            <div className="mb-8">
              <span className="text-primary font-bold tracking-widest uppercase text-xs">
                Common Questions
              </span>
              <h2 className="text-3xl font-black mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-base-content/10 rounded-2xl overflow-hidden bg-base-100/50"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-base-content hover:bg-base-200/50 transition-colors"
                  >
                    {faq.question}
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        activeFAQ === index
                          ? "rotate-180 text-primary"
                          : "text-base-content/40"
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-base-content/70 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* --- Right: Contact Form --- */}
          <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-content/10 shadow-xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Send size={100} />
            </div>

            <h3 className="text-2xl font-black mb-6">Send us a Message</h3>

            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-base-content/50 ml-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-4 rounded-xl bg-base-200/50 border border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-base-content/50 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full p-4 rounded-xl bg-base-200/50 border border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-base-content/50 ml-1">
                  Subject
                </label>
                <select className="w-full p-4 rounded-xl bg-base-200/50 border border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Technical Issue</option>
                  <option>Account Support</option>
                  <option>Feature Request</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-base-content/50 ml-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full p-4 rounded-xl bg-base-200/50 border border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* ==================== 3. ABOUT SECTION ==================== */}
        <div className="bg-base-200/50 rounded-[3rem] p-10 md:p-16 text-center border border-base-content/5">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            About MovieMaster Pro
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-base-content/70 leading-relaxed mb-10">
            MovieMaster is the world's most popular and authoritative source for
            movie, TV and celebrity content. Find ratings and reviews for the
            newest movie and TV shows. We dedicated to providing you the best
            experience of exploring the cinematic world.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <StatItem label="Active Users" value="2.5M+" />
            <StatItem label="Movies Listed" value="150k+" />
            <StatItem label="Reviews" value="800k+" />
            <StatItem label="Countries" value="120+" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const StatItem = ({ label, value }) => (
  <div>
    <h4 className="text-3xl font-black text-primary mb-1">{value}</h4>
    <p className="text-sm font-bold text-base-content/50 uppercase tracking-widest">
      {label}
    </p>
  </div>
);

// --- Dummy Data ---
const faqs = [
  {
    question: "Is MovieMaster Pro free to use?",
    answer:
      "Yes! Creating an account and browsing movies is completely free. We also offer a Pro subscription for ad-free experience and exclusive content.",
  },
  {
    question: "How can I add a movie to the database?",
    answer:
      "You need to be logged in. Navigate to your Dashboard and click on 'Add Movie'. Fill in the details and submit for review.",
  },
  {
    question: "Can I download movies from this site?",
    answer:
      "No, MovieMaster is a discovery and tracking platform. We provide streaming links to legal platforms but do not host copyrighted content.",
  },
  {
    question: "I forgot my password, what should I do?",
    answer:
      "Go to the Login page and click 'Forgot Password'. Enter your email address and we will send you a reset link.",
  },
];

export default Support;
