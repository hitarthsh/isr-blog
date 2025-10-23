"use client";

import { useState } from "react";
import { BlogResponse, UnifiedPost } from "@/types/blog";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface BlogListProps {
  initialData: BlogResponse;
  searchParams: {
    page?: string;
    search?: string;
    source?: string;
  };
}

export default function BlogList({ initialData, searchParams }: BlogListProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  const handlePageChange = async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParamsHook.toString());
      params.set("page", page.toString());

      const response = await fetch(`/api/posts?${params.toString()}`);
      const newData = await response.json();
      setData(newData);

      router.push(`/blog?${params.toString()}`);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceFilter = async (source: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParamsHook.toString());
      if (source === "all") {
        params.delete("source");
      } else {
        params.set("source", source);
      }
      params.delete("page"); // Reset to first page

      const response = await fetch(`/api/posts?${params.toString()}`);
      const newData = await response.json();
      setData(newData);

      router.push(`/blog?${params.toString()}`);
    } catch (error) {
      console.error("Error filtering posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = async (sortBy: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParamsHook.toString());
      params.set("sort", sortBy);
      params.delete("page"); // Reset to first page

      const response = await fetch(`/api/posts?${params.toString()}`);
      const newData = await response.json();
      setData(newData);

      router.push(`/blog?${params.toString()}`);
    } catch (error) {
      console.error("Error sorting posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (data.posts.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No posts found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Sorting */}
      <div className="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Filter by Source
        </h2>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSourceFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 border-2 ${
                !searchParams.source || searchParams.source === "all"
                  ? "bg-accent-500 text-white shadow-lg border-accent-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                All Sources
              </span>
            </button>
            <button
              onClick={() => handleSourceFilter("wordpress")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 border-2 ${
                searchParams.source === "wordpress"
                  ? "bg-accent-500 text-white shadow-lg border-accent-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-3.186 7.2-7.125 7.2-1.347 0-2.597-.375-3.675-1.012L9 19.5l1.5-4.5-3-3 4.5-1.5L9 1.5l1.188 3.563C10.5 3.75 9.75 3 8.25 3c-1.657 0-3 1.343-3 3 0 .75.281 1.438.75 1.969L3 9.75l1.5 4.5-3-3 4.5-1.5L3 19.5l1.188-3.563C3.75 17.25 3 18 1.5 18c-1.657 0-3-1.343-3-3 0-1.875.75-3.563 1.969-4.781L1.5 9.75l3-3-1.5-4.5 3 3 1.5-4.5-3 3 1.5 4.5-3-3z" />
                </svg>
                WordPress
              </span>
            </button>
            <button
              onClick={() => handleSourceFilter("ghost")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 border-2 ${
                searchParams.source === "ghost"
                  ? "bg-accent-500 text-white shadow-lg border-accent-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Ghost
              </span>
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <select
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="author">Author</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 animate-scale-in">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-200 border-t-accent-500"></div>
            <p className="text-gray-600 font-medium">Loading posts...</p>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {data.posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {data.meta.totalPages > 1 && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
}
