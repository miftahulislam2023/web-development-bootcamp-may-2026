import React from "react";
import CommonPageHeader from "../../components/CommonPageHeader";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Mail,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

// --- Data for Policy Sections ---
const policySections = [
  {
    id: "collection",
    title: "Data We Collect",
    icon: Database,
    content:
      "We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, and profile picture.",
  },
  {
    id: "usage",
    title: "How We Use Data",
    icon: Eye,
    content:
      "We use the information we collect to provide, maintain, and improve our services. This includes creating your personalized watchlist, analyzing usage trends, and preventing fraudulent activity.",
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: Cookie,
    content:
      "We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
  },
  {
    id: "security",
    title: "Data Security",
    icon: Lock,
    content:
      "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your Personal Data.",
  },
];

const Privacy = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[150px] -z-10" />

      <CommonPageHeader
        title="Privacy Policy"
        subtitle="Your privacy is our priority. Transparent and secure."
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- LEFT SIDEBAR (Sticky Navigation) --- */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 p-6 rounded-4xl bg-base-200/50 border border-base-content/5 backdrop-blur-md">
              <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/50 mb-6">
                Table of Contents
              </h3>
              <ul className="space-y-4">
                {policySections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center gap-3 text-base-content/70 hover:text-primary transition-colors group w-full text-left"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-base-content/20 group-hover:bg-primary transition-colors" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-base-content/10">
                <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  <FileText size={16} /> Download as PDF
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT CONTENT (Policy Cards) --- */}
          <div className="lg:col-span-8 space-y-8">
            {/* Intro Card */}
            <div className="p-8 rounded-4xl bg-linear-to-br from-primary/10 to-base-100 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content mb-2">
                    Effective Date: December 2025
                  </h3>
                  <p className="text-base-content/70 leading-relaxed">
                    At MovieMaster Pro, we are committed to maintaining the
                    trust and confidence of our visitors. In this Privacy
                    Policy, we’ve provided detailed information on when and why
                    we collect your personal information and how we use it.
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Sections */}
            {policySections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="group p-8 rounded-4xl bg-base-100 border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 scroll-mt-32"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/60 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-base-content">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-lg text-base-content/70 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              );
            })}

            {/* Contact Box */}
            <div className="mt-12 p-8 rounded-4xl bg-base-content text-base-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[50px]" />

              <div className="relative z-10">
                <Mail className="w-10 h-10 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">
                  Have questions about your data?
                </h3>
                <p className="text-base-100/70 mb-6 max-w-lg mx-auto">
                  Our data protection officer is available to help you
                  understand your rights and our obligations.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-base-100 text-base-content font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  Contact Support <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
