"use client";

import { useState, useEffect } from "react";

interface OutlineItem {
  id: string;
  text: string;
  level: number;
}

interface OutlineProps {
  content: string;
}

export default function Outline({ content }: OutlineProps) {
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Extract headings from the content - more flexible regex
    const headingRegex =
      /<h([1-6])(?:\s+[^>]*)?id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings: OutlineItem[] = [];
    let match;

    // Also try a simpler regex for headings without IDs
    const simpleHeadingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    let simpleMatch;

    // First try headings with IDs
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const id = match[2];
      const text = match[3].replace(/<[^>]*>/g, ""); // Remove HTML tags

      if (text.trim()) {
        headings.push({
          id,
          text: text.trim(),
          level,
        });
      }
    }

    // If no headings with IDs found, try simple headings
    if (headings.length === 0) {
      while ((simpleMatch = simpleHeadingRegex.exec(content)) !== null) {
        const level = parseInt(simpleMatch[1]);
        const text = simpleMatch[2].replace(/<[^>]*>/g, ""); // Remove HTML tags
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        if (text.trim()) {
          headings.push({
            id,
            text: text.trim(),
            level,
          });
        }
      }
    }

    console.log("Content length:", content.length);
    console.log("Found headings:", headings);
    setOutline(headings);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = outline
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading) {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveId(heading.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [outline]);

  const scrollToHeading = (id: string) => {
    // First try to find by ID
    let element = document.getElementById(id);

    // If not found by ID, try to find by text content
    if (!element) {
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      for (const heading of headings) {
        const headingText = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        if (headingText === id) {
          element = heading as HTMLElement;
          break;
        }
      }
    }

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Always show the outline container, even if empty
  // if (outline.length === 0) {
  //   return null;
  // }

  const maxVisibleItems = 8;
  const visibleOutline = showAll ? outline : outline.slice(0, maxVisibleItems);
  const hasMoreItems = outline.length > maxVisibleItems;

  return (
    <div className="sticky top-8 w-64 bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        Outline
      </h3>

      <div className="space-y-0.5">
        {outline.length > 0 ? (
          <>
            {visibleOutline.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToHeading(item.id)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-all duration-200 ${
                  activeId === item.id
                    ? "bg-primary-50 text-primary-700 font-semibold border-l-2 border-primary-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{ paddingLeft: `${8 + (item.level - 1) * 12}px` }}
              >
                {item.text}
              </button>
            ))}

            {hasMoreItems && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-center px-2 py-2 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-all duration-200 border-t border-gray-100 mt-2 pt-2"
              >
                {showAll ? (
                  <>
                    <svg
                      className="w-3 h-3 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    Show Less
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3 h-3 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    Show More ({outline.length - maxVisibleItems} more)
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-500 italic">
              No headings found in this article.
            </div>
            <div className="text-xs text-gray-400">
              Content preview: {content.substring(0, 100)}...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
