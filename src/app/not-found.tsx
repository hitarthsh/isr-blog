import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | CreativityCoder",
  description:
    "The page you're looking for doesn't exist. Let's get you back on track!",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">CC</span>
                </div>
                <span className="text-xl font-bold text-slate-900">
                  CreativityCoder
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 font-medium transition-all duration-200"
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  className="text-slate-600 hover:text-blue-600 font-medium transition-all duration-200"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-20">
          {/* 404 Animation */}
          <div className="relative mb-12">
            <div className="text-9xl md:text-[12rem] font-bold text-slate-200 select-none animate-bounce-slow">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl md:text-8xl animate-float">🚀</div>
            </div>
            <div className="absolute top-1/4 left-1/4 text-4xl animate-spin-slow">
              ⭐
            </div>
            <div className="absolute top-1/3 right-1/4 text-3xl animate-pulse">
              ✨
            </div>
            <div className="absolute bottom-1/4 left-1/3 text-2xl animate-bounce-slow">
              🌟
            </div>
            <div className="absolute bottom-1/3 right-1/3 text-3xl animate-glow">
              💫
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 animate-fade-in-up">
              Oops! Page Not Found
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-4 animate-fade-in-up">
              The page you're looking for seems to have
              <span className="text-blue-600 font-semibold">
                {" "}
                vanished into the digital void
              </span>
              .
            </p>
            <p className="text-lg text-slate-500 animate-fade-in-up">
              Don't worry though - even the best explorers sometimes take a
              wrong turn!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up">
            <Link
              href="/"
              className="group bg-linear-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="flex items-center justify-center gap-2">
                🏠 Back to Home
                <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </span>
            </Link>
            <Link
              href="/blog"
              className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold border-2 border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                📚 Explore Blog
                <span className="text-lg group-hover:rotate-12 transition-transform duration-200">
                  📖
                </span>
              </span>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-lg animate-scale-in">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Maybe you were looking for:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/blog"
                className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  📝
                </div>
                <div className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Blog Posts
                </div>
                <div className="text-sm text-slate-600">
                  Read our latest articles
                </div>
              </Link>
              <Link
                href="/admin"
                className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  ⚙️
                </div>
                <div className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Admin Panel
                </div>
                <div className="text-sm text-slate-600">
                  Manage your content
                </div>
              </Link>
              <Link
                href="/api/posts"
                className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  🔌
                </div>
                <div className="font-semibold text-slate-900 group-hover:text-blue-600">
                  API Endpoints
                </div>
                <div className="text-sm text-slate-600">
                  Developer resources
                </div>
              </Link>
            </div>
          </div>

          {/* Fun Fact */}
          <div className="mt-12 p-6 bg-linear-to-r from-blue-100 to-cyan-100 rounded-2xl border border-blue-200 animate-fade-in-up">
            <div className="text-4xl mb-4">🤔</div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Did you know?
            </h4>
            <p className="text-slate-700">
              The first 404 error was recorded in 1992 at CERN, where the web
              was born. The room where the original web servers were located was
              called "Room 404"!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
