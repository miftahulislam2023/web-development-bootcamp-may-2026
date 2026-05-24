import React from "react";
import CommonPageHeader from "../../components/CommonPageHeader";
import {
  ScrollText,
  ShieldAlert,
  Users,
  Ban,
  Scale,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";

const termsData = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: CheckCircle2,
    content:
      "By accessing and using MovieMaster Pro, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.",
  },
  {
    id: "accounts",
    title: "2. User Accounts",
    icon: Users,
    content:
      "To access certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. We reserve the right to terminate accounts that violate our policies.",
  },
  {
    id: "usage",
    title: "3. Prohibited Usage",
    icon: Ban,
    content:
      "You agree not to use the service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the service in any way that could damage the site, the services, or the general business of MovieMaster Pro.",
  },
  {
    id: "intellectual",
    title: "4. Intellectual Property",
    icon: ScrollText,
    content:
      "The site and its original content, features, and functionality are owned by MovieMaster Pro and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.",
  },
  {
    id: "liability",
    title: "5. Limitation of Liability",
    icon: ShieldAlert,
    content:
      "In no event shall MovieMaster Pro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
  },
  {
    id: "changes",
    title: "6. Changes to Terms",
    icon: Scale,
    content:
      "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-base-100 py-20 relative overflow-hidden">
      {/* --- Background Ambience --- */}
      <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      {/* --- Header --- */}
      <CommonPageHeader
        title="Terms of Service"
        subtitle="Please read these terms carefully before using our service."
      />

      {/* --- Main Content --- */}
      <div className="max-w-4xl mx-auto px-6">
        {/* Info Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 p-6 rounded-3xl bg-base-200/50 border border-base-content/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <AlertCircle size={20} />
            </div>
            <div className="text-sm">
              <span className="block font-bold text-base-content">
                Last Updated
              </span>
              <span className="text-base-content/60">December 24, 2025</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-base-100 border border-base-content/10 rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm">
            <FileText size={16} />
            Download PDF
          </button>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {termsData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group p-8 rounded-4xl bg-base-100 border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 mt-1 w-12 h-12 rounded-2xl bg-base-200 group-hover:bg-primary/10 flex items-center justify-center text-base-content/50 group-hover:text-primary transition-all duration-500">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-base-content/70 leading-relaxed text-lg">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-base-content/50 text-sm">
            If you have any questions about these Terms, please contact us at{" "}
            <br />
            <span className="text-primary font-bold cursor-pointer hover:underline">
              legal@moviemaster.pro
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
