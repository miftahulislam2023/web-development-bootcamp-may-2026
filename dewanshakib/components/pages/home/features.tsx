"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  PieChart,
  BarChart3,
  TrendingUp,
  Calendar,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Transaction Tracking",
    description:
      "Easily record your income and expenses. Add amounts, descriptions, and categorize every transaction in seconds.",
  },
  {
    icon: PieChart,
    title: "Smart Categories",
    description:
      "Create custom categories for your spending. Organize expenses your way with personalized income and expense categories.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description:
      "See your finances at a glance with radar charts and transaction history graphs. Understand your spending patterns.",
  },
  {
    icon: TrendingUp,
    title: "Monthly & Yearly History",
    description:
      "Track your financial journey over time. View daily, monthly, and yearly summaries to spot trends and plan ahead.",
  },
  // {
  //   icon: Calendar,
  //   title: "Calendar View",
  //   description:
  //     "Browse transactions by date. Filter and search through your history to find exactly what you need.",
  // },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data stays yours. We prioritize privacy with secure authentication and local-first data storage.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Manage Money
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khorcha gives you powerful tools to track, organize, and understand your finances—all in one beautiful app.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-background/60 backdrop-blur hover:border-primary/20 transition-colors"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}