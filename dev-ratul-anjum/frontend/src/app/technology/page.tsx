import {
  ArrowLeft,
  Layers,
  Server,
  Zap,
  Database,
  HardDrive,
  Cpu,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Technology | Dialog",
  description: "Explore the modern tech stack powering the Dialog application.",
};

const TechnologyPage = () => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
            <Cpu className="w-4 h-4" />
            Powered by Modern Tech
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Under the Hood
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Dialog is engineered for speed, scalability, and developer
            experience. Here are the core technologies making it happen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Frontend */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <Layers className="text-black" />
            </div>
            <h3 className="font-bold text-xl mb-2">Next.js</h3>
            <p className="text-gray-600">
              The React framework for the web. Provides server-side rendering,
              static site generation, and optimal performance out of the box.
            </p>
          </div>

          {/* Backend Runtime */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
              <Server className="text-green-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Node.js</h3>
            <p className="text-gray-600">
              A JavaScript runtime built on Chrome&apos;s V8 engine, enabling
              scalable and fast backend services and real-time operations.
            </p>
          </div>

          {/* API Framework */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-yellow-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Express</h3>
            <p className="text-gray-600">
              Fast, unopinionated, minimalist web framework for Node.js, routing
              our robust RESTful API architecture.
            </p>
          </div>

          {/* ORM */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <Database className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Prisma</h3>
            <p className="text-gray-600">
              Next-generation Node.js and TypeScript ORM that brings type safety
              and intuitive data modeling to our database layer.
            </p>
          </div>

          {/* Database */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <HardDrive className="text-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">PostgreSQL</h3>
            <p className="text-gray-600">
              The world&apos;s most advanced open-source relational database,
              offering reliability, data integrity, and powerful features.
            </p>
          </div>

          {/* Styling */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-6">
              <Layers className="text-cyan-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Tailwind CSS</h3>
            <p className="text-gray-600">
              A utility-first CSS framework packed with classes that can be
              composed to build any design, directly in your markup.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TechnologyPage;
