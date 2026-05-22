"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Khorcha free to use?",
    answer:
      "Yes! Khorcha is completely free to use. You can track all your transactions, create categories, and view charts without paying anything. We believe financial tracking should be accessible to everyone.",
  },
  {
    question: "How secure is my financial data?",
    answer:
      "Your privacy is our priority. Khorcha uses secure authentication and your data is stored securely. We don't post or share your personal information with third parties. Your financial data stays private and secure.",
  },
  {
    question: "Can I access my data on multiple devices?",
    answer:
      "Yes! Your data is stored securely in our database. Simply sign in with your Google account from any device to access all your transactions, categories, and financial history. Your data syncs automatically.",
  },
  {
    question: "How do I categorize my transactions?",
    answer:
      "When adding a transaction, you can select or create a category. You can create custom categories for both income and expense types that fit your needs. Categories help you analyze spending patterns.",
  },
  {
    question: "What charts and analytics does Khorcha provide?",
    answer:
      "Khorcha offers a radar chart showing category distribution and a transaction history chart for visual analysis. You can view monthly and yearly summaries to understand your financial trends over time.",
  },
  {
    question: "Can I edit or delete transactions?",
    answer:
      "Absolutely! You can update or remove any transaction at any time. This helps keep your records accurate even if you make a mistake or circumstances change.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for? Reach out to us.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}