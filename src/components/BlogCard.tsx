import { UnifiedPost } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface BlogCardProps {
  post: UnifiedPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden hover-lift animate-fade-in-up">
      {post.featuredImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                post.source === "wordpress"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-secondary-100 text-secondary-700"
              }`}
            >
              {post.source}
            </span>
            <time className="text-sm text-gray-500 font-medium">
              {format(new Date(post.publishedAt), "MMM dd, yyyy")}
            </time>
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{post.readingTime} min</span>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <p
          className="text-gray-600 mb-4 line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: post.excerpt.replace(/<[^>]*>/g, ""),
          }}
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {post.author.name}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-700 font-semibold text-sm transition-all duration-200 group/link hover:scale-105"
          >
            <span>Read more</span>
            <svg
              className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer hover:scale-105"
              >
                {tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
