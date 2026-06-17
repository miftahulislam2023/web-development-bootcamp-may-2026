import {
  MessageSquareDashed,
  Menu,
  Layers,
  Server,
  Zap,
  Database,
  HardDrive,
  MessageCircle,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dialog | Welcome to Seamless Conversations",
  description:
    "Start chatting instantly, explore public rooms, or create your own private space. Dialog brings your conversations together in one simple, intuitive platform.",
  keywords: [
    "dialog chat application",
    "Ratul Anjum",
    "real-time messaging",
    "group chat",
    "private chat",
    "community chat",
    "online chat platform",
  ],
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    title: "Dialog Chat Application | Connect Instantly",
    description:
      "Connect instantly with friends, communities, and colleagues using Dialog chat application. Enjoy seamless private and group messaging in real-time.",
    siteName: "Dialog",
  },
  twitter: {
    card: "summary",
    title: "Dialog Chat Application | Connect Instantly",
    description:
      "Connect instantly with friends, communities, and colleagues using Dialog chat application. Enjoy seamless private and group messaging in real-time.",
    site: "@yourtwitterhandle",
  },
};

const HomePage = () => {
  return (
    <div className="bg-gray-50 text-gray-800 flex flex-col min-h-screen">
      {/* Header / Navbar 
        Note: Using a CSS-only "checkbox hack" for the mobile menu 
        so this remains a Server Component without needing 'use client'.
      */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="bg-linear-to-br from-green-500 to-blue-500 text-white p-2 rounded-lg">
                <MessageSquareDashed className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900">
                Dialog
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/features"
                prefetch={true}
                className="text-gray-500 hover:text-green-600 font-medium transition"
              >
                Features
              </Link>
              <Link
                href="/technology"
                prefetch={true}
                className="text-gray-500 hover:text-green-600 font-medium transition"
              >
                Technology
              </Link>
              <Link
                href="/about"
                prefetch={true}
                className="text-gray-500 hover:text-green-600 font-medium transition"
              >
                About
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex">
              <Link
                href="/sign-up"
                className="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle (CSS Only) */}
            <div className="md:hidden flex items-center">
              <label
                htmlFor="mobile-menu-toggle"
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </label>
            </div>
          </div>
        </div>

        {/* Hidden Checkbox for Toggle State */}
        <input
          type="checkbox"
          id="mobile-menu-toggle"
          className="peer hidden"
        />

        {/* Mobile Menu - Shown when checkbox is checked */}
        <div className="hidden peer-checked:block md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              href="/features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              Features
            </Link>
            <Link
              href="/technology"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              Technology
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              About
            </Link>
            <div className="pt-4">
              <Link
                href="/sign-up"
                className="block w-full text-center bg-gray-900 text-white px-5 py-3 rounded-lg font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Now available in Beta
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Communication <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-green-500 to-blue-500">
                Reimagined.
              </span>
            </h1>

            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Dialog is the seamless way to connect with your team. Experience
              real-time messaging with a focus on speed, security, and
              simplicity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="px-8 py-3.5 rounded-lg bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-500/30"
              >
                Start Your Chat
              </Link>
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-lg bg-white text-gray-700 font-bold text-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Go Online
              </Link>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Built on Modern Architecture
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We leverage the latest technologies to ensure Dialog is fast,
                scalable, and reliable.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {/* Next.js */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition group">
                <div className="w-12 h-12 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                  <Layers className="text-black" />
                </div>
                <h3 className="font-bold text-lg">Next.js</h3>
                <p className="text-sm text-gray-500 mt-1">Frontend Framework</p>
              </div>

              {/* Node.js */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition group">
                <div className="w-12 h-12 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                  <Server className="text-green-600" />
                </div>
                <h3 className="font-bold text-lg">Node.js</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Runtime Environment
                </p>
              </div>

              {/* Express */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition group">
                <div className="w-12 h-12 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                  <Zap className="text-yellow-600" />
                </div>
                <h3 className="font-bold text-lg">Express</h3>
                <p className="text-sm text-gray-500 mt-1">Backend API</p>
              </div>

              {/* Prisma */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition group">
                <div className="w-12 h-12 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                  <Database className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg">Prisma</h3>
                <p className="text-sm text-gray-500 mt-1">Modern ORM</p>
              </div>

              {/* Postgres */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition group">
                <div className="w-12 h-12 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                  <HardDrive className="text-blue-600" />
                </div>
                <h3 className="font-bold text-lg">Postgres</h3>
                <p className="text-sm text-gray-500 mt-1">Relational DB</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Designed for how you work
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                      <MessageCircle />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Real-time Messaging
                      </h4>
                      <p className="text-gray-600 mt-1">
                        Instant delivery with socket-based architecture ensures
                        you never miss a beat.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShieldCheck />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Secure by Default
                      </h4>
                      <p className="text-gray-600 mt-1">
                        End-to-end encryption keeps your private conversations
                        private.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                      <Smartphone />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Cross Platform
                      </h4>
                      <p className="text-gray-600 mt-1">
                        Seamlessly switch between desktop, mobile, and web
                        versions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Abstract Visual Representation */}
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="space-y-4">
                  {/* Mock Chat Bubbles */}
                  <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none max-w-[80%]">
                      <p className="text-sm text-gray-600">
                        Has the new Dialog update dropped yet?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-green-500"></div>
                    <div className="bg-green-500 p-3 rounded-2xl rounded-br-none max-w-[80%] text-white">
                      <p className="text-sm">
                        Yes! It&apos;s built with Next.js and Prisma now. super
                        fast. 🚀
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none max-w-[80%]">
                      <p className="text-sm text-gray-600">
                        That sounds amazing. Signing up now.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4 text-white">
                <MessageSquareDashed className="w-6 h-6" />
                <span className="font-bold text-xl">Dialog</span>
              </div>
              <p className="text-sm text-gray-400">
                Connecting people through seamless technology.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-white transition"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-white transition"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            © 2026 Dialog. Built with ❤️ by{" "}
            <a
              href="https://github.com/dev-ratul-anjum"
              target="_blank"
              className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Ratul Anjum
            </a>{" "}
            using Next.js, Express & Prisma.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
