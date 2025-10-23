"use client";

import { useState, useEffect } from "react";

interface BookmarkButtonProps {
  postId: string;
  postTitle: string;
  postSlug: string;
}

export default function BookmarkButton({
  postId,
  postTitle,
  postSlug,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.some((bookmark: any) => bookmark.id === postId));
  }, [postId]);

  const toggleBookmark = () => {
    setIsAnimating(true);

    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(
        (bookmark: any) => bookmark.id !== postId
      );
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      const newBookmark = {
        id: postId,
        title: postTitle,
        slug: postSlug,
        bookmarkedAt: new Date().toISOString(),
      };
      const updatedBookmarks = [...bookmarks, newBookmark];
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-lg transition-all duration-300 ${
        isBookmarked
          ? "bg-yellow-100 text-yellow-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${isAnimating ? "scale-110" : "hover:scale-105"}`}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <svg
        className={`w-5 h-5 transition-all duration-300 ${
          isAnimating ? "animate-bounce" : ""
        }`}
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
