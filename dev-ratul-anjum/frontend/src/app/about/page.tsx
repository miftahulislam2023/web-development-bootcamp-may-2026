import { ArrowLeft, Users, Target } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About | Dialog",
  description: "Learn more about the mission and vision behind Dialog.",
};

const AboutPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Simple Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            About <span className="bg-clip-text text-transparent bg-linear-to-r from-green-500 to-blue-500">Dialog</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Dialog was built with a simple goal: to make communication seamless, fast, and secure for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide a reliable platform where teams, communities, and friends can connect instantly without friction. We believe that communication should empower, not hinder.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-gray-600">
              We are a passionate team of developers dedicated to building modern tools. Dialog is our answer to the clutter and complexity of traditional messaging apps.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
