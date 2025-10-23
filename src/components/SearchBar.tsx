"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { BlogResponse } from "@/types/blog";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", query);
      params.delete("page");
      router.push(`/blog?${params.toString()}`);
      setShowResults(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleResultClick = (slug: string) => {
    router.push(`/blog/${slug}`);
    setShowResults(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search blog posts..."
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto animate-fade-in-up">
          {results.posts.length > 0 ? (
            <div className="py-2">
              {results.posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handleResultClick(post.slug)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    {post.featuredImage && (
                      <div className="relative w-12 h-12 shrink-0">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {post.author.name} •{" "}
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {results.meta.total > 5 && (
                <div className="px-4 py-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("search", query);
                      router.push(`/blog?${params.toString()}`);
                      setShowResults(false);
                    }}
                    className="text-sm text-primary-500 hover:text-primary-700 transition-colors duration-200"
                  >
                    View all {results.meta.total} results
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No posts found for "{query}"
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
