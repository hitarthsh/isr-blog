import { BlogService } from "@/lib/blog-service";
import { BlogResponse } from "@/types/blog";
import BlogList from "@/components/BlogList";
import SearchBar from "@/components/SearchBar";
import ScrollToTop from "@/components/ScrollToTop";
import ReadingProgress from "@/components/ReadingProgress";
import LiveSearch from "@/components/LiveSearch";
import { Suspense } from "react";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    source?: string;
  }>;
}

export const revalidate = 60; // CreativityCoder: revalidate every minute for dynamic content

async function getBlogData(
  searchParams: BlogPageProps["searchParams"]
): Promise<BlogResponse> {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const search = resolvedSearchParams.search;
  const source = resolvedSearchParams.source as
    | "wordpress"
    | "ghost"
    | "all"
    | undefined;

  return BlogService.getAllPosts({
    limit: 12,
    page,
    search,
    source,
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const blogData = await getBlogData(searchParams);

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-secondary-50 to-accent-50 transition-colors duration-300">
      <ReadingProgress />

      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-primary-50 via-secondary-50 to-accent-50 border-b border-primary-200 transition-colors duration-300 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-primary-400 to-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-accent-400 to-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-40 left-1/2 w-60 h-60 bg-linear-to-br from-secondary-400 to-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight animate-fade-in-up">
              Discover
              <span className="block gradient-text-sunset animate-glow">
                Amazing Stories
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up">
              Explore insights, tutorials, and stories from our WordPress and
              Ghost content. Find inspiration and knowledge that matters.
            </p>

            {/* Enhanced Live Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              <Suspense
                fallback={
                  <div className="animate-shimmer h-14 bg-gray-100 rounded-xl"></div>
                }
              >
                <LiveSearch placeholder="Search posts in real-time..." />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>
        <Suspense
          fallback={
            <div className="space-y-8">
              {/* Skeleton for filter buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-shimmer h-10 w-24 bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>

              {/* Skeleton for blog grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-shimmer bg-white rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-200 h-48"></div>
                    <div className="p-6 space-y-3">
                      <div className="flex gap-2">
                        <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
                        <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
                      </div>
                      <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-full"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                      <div className="flex justify-between items-center pt-4">
                        <div className="bg-gray-200 h-4 w-24 rounded"></div>
                        <div className="bg-gray-200 h-4 w-16 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <BlogList initialData={blogData} searchParams={await searchParams} />
        </Suspense>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-linear-to-r from-primary-400 to-secondary-500 rounded-full animate-sparkle opacity-60"></div>
        <div
          className="absolute top-1/3 right-20 w-3 h-3 bg-linear-to-r from-accent-400 to-primary-500 rounded-full animate-sparkle opacity-60"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-linear-to-r from-secondary-400 to-accent-500 rounded-full animate-sparkle opacity-60"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-linear-to-r from-primary-400 to-accent-500 rounded-full animate-sparkle opacity-60"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/2 w-3 h-3 bg-linear-to-r from-accent-400 to-secondary-500 rounded-full animate-sparkle opacity-60"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
}
