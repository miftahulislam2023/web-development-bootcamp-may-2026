import React from "react";
import CommonPageHeader from "../../components/CommonPageHeader";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: ["Access to database", "Create 1 Watchlist", "Basic Search"],
    },
    {
      name: "Pro",
      price: "$9.99",
      features: [
        "Unlimited Watchlists",
        "Ad-free experience",
        "4K Meta-data",
        "Priority Support",
      ],
      popular: true,
    },
    {
      name: "Ultra",
      price: "$19.99",
      features: [
        "Everything in Pro",
        "API Access",
        "Early Access Features",
        "Offline Mode",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 py-20">
      <CommonPageHeader
        title="Simple Pricing"
        subtitle="Choose the plan that fits your viewing habits."
      />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-center ">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative p-8 rounded-4xl ${
              plan.popular
                ? "bg-base-100 border-2 border-primary shadow-2xl scale-105 z-10"
                : "bg-base-200/50 border border-base-content/10"
            }`}
          >
            {plan.popular && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-base-content/70">
              {plan.name}
            </h3>
            <div className="my-6">
              <span className="text-4xl font-black">{plan.price}</span>
              {plan.price !== "Free" && (
                <span className="text-base-content/50">/month</span>
              )}
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="p-1 rounded-full bg-green-500/10 text-green-500">
                    <Check size={14} />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.popular
                  ? "bg-primary text-white hover:bg-red-700"
                  : "bg-base-300 hover:bg-base-content hover:text-base-100"
              }`}
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Pricing;
