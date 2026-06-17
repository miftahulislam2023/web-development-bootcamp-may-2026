"use client";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <section className="w-full max-w-2xl text-center">
        {/* Error Code */}
        <p className="text-sm sm:text-base font-semibold text-indigo-600 tracking-wide">
          404 ERROR
        </p>

        {/* Main Heading */}
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto">
          Sorry, the page you’re looking for doesn’t exist or may have been
          moved. Please check the URL or return to the homepage.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
          >
            Go back home
          </Link>

          <button
            onClick={() => history.back()}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Go back
          </button>
        </div>
      </section>
    </main>
  );
}
