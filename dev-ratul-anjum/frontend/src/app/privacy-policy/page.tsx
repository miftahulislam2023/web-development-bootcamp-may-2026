export const metadata = {
  title: "Dialog | Privacy Policy",
  description:
    "Read the Privacy Policy of Dialog chat application. Understand how your data is collected, used, and protected while using our messaging platform.",
  keywords: [
    "dialog chat application",
    "Ratul Anjum",
    "privacy policy",
    "data protection",
    "user privacy",
    "chat app security",
  ],
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy-policy`,
    title: "Dialog | Privacy Policy",
    description:
      "Read the Privacy Policy of Dialog chat application. Understand how your data is collected, used, and protected while using our messaging platform.",
    siteName: "Dialog",
  },
  twitter: {
    card: "summary",
    title: "Dialog | Privacy Policy",
    description:
      "Read the Privacy Policy of Dialog chat application. Understand how your data is collected, used, and protected while using our messaging platform.",
    site: "@ratulanjum",
  },
};

const PrivacyPolicyPage = () => {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-sm text-gray-500">Last updated: 2026</p>

      <section className="space-y-6">
        <p>
          Your privacy matters to us. This Privacy Policy explains how our chat
          application collects, uses, and protects your information.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>
            We may collect basic account information such as your username,
            email address, and messages you send within the app. We do not
            collect sensitive personal data unless explicitly required.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and maintain chat functionality</li>
            <li>To improve user experience</li>
            <li>To ensure safety and prevent abuse</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Message Privacy</h2>
          <p>
            Messages are stored only as long as necessary to provide the
            service. We do not sell or share your messages with third parties.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p>
            We use reasonable technical measures to protect your data, but no
            system is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use
            of the app means you accept the updated policy.
          </p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
