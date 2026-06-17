import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Zap,
  BellRing,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Features | Dialog",
  description:
    "Discover the features that make Dialog the best chat application.",
};

const FeaturesPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Everything you need to{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-green-500 to-blue-500">
              Connect
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            From lightning-fast messaging to robust security, Dialog is packed
            with features designed to enhance your communication experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Real-time Messaging
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Experience zero latency. Our socket-based architecture ensures
                that your messages are delivered and read instantly across all
                devices.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Secure by Default
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Privacy is our priority. With industry-standard encryption, your
                conversations and shared data remain strictly confidential.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Cross Platform Ready
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Whether you&apos;re at your desk or on the go, our fully
                responsive design ensures a flawless experience on mobile,
                tablet, and desktop.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Lightning Fast UI
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Built with Next.js and Tailwind, our interface isn&apos;t just
                beautiful—it&apos;s highly optimized, lightweight, and
                incredibly responsive.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <BellRing className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Smart Notifications
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Stay updated without the noise. Customize your notification
                preferences so you only get pinged for what truly matters.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Community Groups
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create and manage group chats easily. Organize your teams,
                friends, or interests into dedicated, easy-to-navigate rooms.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
