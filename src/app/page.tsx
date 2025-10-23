import Link from "next/link";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-cyan-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <span className="text-xl font-bold text-slate-900">
                CreativityCoder
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8 animate-slide-in-right">
              <Link
                href="/blog"
                className="text-slate-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Blog
              </Link>
              <Link
                href="/admin"
                className="text-slate-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Admin
              </Link>
              <Link
                href="/api/posts"
                className="text-slate-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105"
              >
                API
              </Link>
            </div>
            <div className="md:hidden flex items-center space-x-3">
              <Link
                href="/blog"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:scale-105 animate-bounce-slow"
              >
                🚀 Explore
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold mb-8 shadow-lg animate-fade-in-up hover:scale-105 transition-transform duration-300">
              <span className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></span>
              Powered by Next.js CreativityCoder
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in-up">
              <span className="block">Modern</span>
              <span className="block bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Blog Platform
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
              Experience lightning-fast content delivery with our
              CreativityCoder-powered blog platform. Seamlessly integrate
              WordPress and Ghost content sources for optimal performance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up">
              <Link
                href="/blog"
                className="group bg-linear-to-r from-blue-600 to-blue-800 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 hover-lift"
              >
                <span className="flex items-center justify-center gap-2">
                  🚀 Explore Blog
                  <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </span>
              </Link>
              <Link
                href="/api/posts"
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold border-2 border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
              >
                <span className="flex items-center justify-center gap-2">
                  View API
                  <span className="text-lg group-hover:rotate-12 transition-transform duration-200">
                    &lt;/&gt;
                  </span>
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover-lift animate-scale-in">
                <div className="text-4xl font-bold text-blue-500 mb-2 animate-bounce-slow">
                  ⚡
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  CreativityCoder
                </div>
                <div className="text-slate-600">
                  Incremental Static Regeneration
                </div>
              </div>
              <div
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover-lift animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div
                  className="text-4xl font-bold text-cyan-500 mb-2 animate-bounce-slow"
                  style={{ animationDelay: "0.5s" }}
                >
                  🔗
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  Multi-Source
                </div>
                <div className="text-slate-600">
                  WordPress & Ghost Integration
                </div>
              </div>
              <div
                className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-500/20 hover-lift animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div
                  className="text-4xl font-bold text-blue-600 mb-2 animate-bounce-slow"
                  style={{ animationDelay: "1s" }}
                >
                  🚀
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  Fast
                </div>
                <div className="text-slate-600">Optimized Performance</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built with cutting-edge technologies and modern design principles
              for the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200/50">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <div className="text-3xl text-white">⚡</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Lightning Fast CreativityCoder
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Incremental Static Regeneration ensures your content is always
                fresh and loads instantly, providing the best performance for
                your readers.
              </p>
            </div>

            <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200/50">
              <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-cyan-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <div className="text-3xl text-white">🔗</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Multi-Source Magic
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Seamlessly integrate content from WordPress and Ghost platforms
                into one unified, beautiful blog experience.
              </p>
            </div>

            <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200/50">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <div className="text-3xl text-white">🔍</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Smart Search
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced search functionality with real-time suggestions,
                filtering, and intelligent content discovery.
              </p>
            </div>

            <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200/50">
              <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 01-2-2V5a2 2 0 012-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Mobile First
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Responsive design that looks stunning on every device, from
                mobile phones to large desktop screens.
              </p>
            </div>

            <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200/50">
              <div className="w-16 h-16 bg-linear-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Type Safe
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Built with TypeScript for robust type checking, better developer
                experience, and fewer runtime errors.
              </p>
            </div>

            <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200/50">
              <div className="w-16 h-16 bg-linear-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Developer API
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Complete REST API for programmatic access to all blog content,
                perfect for integrations and custom applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">CC</span>
                </div>
                <span className="text-xl font-bold">CreativityCoder</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                A modern blog platform powered by Next.js CreativityCoder,
                integrating WordPress and Ghost content sources for optimal
                performance and user experience.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Admin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api/posts"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              &copy; 2024 CreativityCoder Platform. Built with Next.js,
              WordPress, and Ghost.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
