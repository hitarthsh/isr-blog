import { BlogService } from "@/lib/blog-service";
import { UnifiedPost } from "@/types/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import Outline from "@/components/Outline";
import ShareArticle from "@/components/ShareArticle";
import DarkModeToggle from "@/components/DarkModeToggle";
import ScrollToTop from "@/components/ScrollToTop";
import ReadingProgress from "@/components/ReadingProgress";
import BookmarkButton from "@/components/BookmarkButton";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60; // CreativityCoder: revalidate every minute for dynamic content

// Generate static params for sample blog posts
export async function generateStaticParams() {
  const sampleSlugs = [
    "welcome-to-creativitycoder",
    "getting-started-with-nextjs-isr",
  ];

  return sampleSlugs.map((slug) => ({
    slug: slug,
  }));
}

async function getPost(slug: string): Promise<UnifiedPost> {
  try {
    return await BlogService.getPost(slug);
  } catch (error) {
    notFound();
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      <ReadingProgress />

      {/* Dark Mode Toggle - Floating */}
      <div className="fixed top-4 right-4 z-40">
        <DarkModeToggle />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-6">
          {/* Outline Sidebar - Desktop */}
          <div className="hidden xl:block shrink-0 w-64">
            <Outline content={post.content} />
          </div>

          {/* Main Content - Centered */}
          <article className="flex-1 max-w-4xl">
            {/* Header */}
            <header className="mb-6">
              <div className="mb-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-700 font-semibold transition-colors duration-200 group"
                >
                  <svg
                    className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Blog
                </Link>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight animate-fade-in-up">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      By {post.author.name}
                    </span>
                    {post.author.bio && (
                      <p className="text-xs text-gray-500 mt-1">
                        {post.author.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <time dateTime={post.publishedAt}>
                      {format(new Date(post.publishedAt), "MMMM dd, yyyy")}
                    </time>
                  </div>

                  {post.readingTime && (
                    <div className="flex items-center gap-2">
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
                      <span>{post.readingTime} min read</span>
                    </div>
                  )}

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.source === "wordpress"
                        ? "bg-primary-100 text-primary-700"
                        : "bg-secondary-100 text-secondary-700"
                    }`}
                  >
                    {post.source}
                  </span>

                  <BookmarkButton
                    postId={post.id}
                    postTitle={post.title}
                    postSlug={post.slug}
                  />
                </div>
              </div>

              {post.featuredImage && (
                <div className="relative w-full h-48 md:h-64 mb-4 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                </div>
              )}
            </header>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover-lift animate-fade-in-up">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Author Bio */}
            {post.author.bio && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-linear-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100 hover-lift animate-fade-in-up">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-linear-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        About {post.author.name}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {post.author.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Share Article Sidebar - Desktop */}
          <div className="hidden xl:block shrink-0 w-64 space-y-6">
            <ShareArticle title={post.title} url={`/blog/${post.slug}`} />

            {/* Tags in Sidebar */}
            {post.tags.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover-lift">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className="px-3 py-1 bg-linear-to-r from-primary-50 to-accent-50 text-gray-700 rounded-full text-xs font-medium border border-primary-100 hover:border-primary-200 transition-all duration-200 cursor-pointer hover:scale-105"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Outline and Share - Collapsible */}
        <div className="xl:hidden mt-8 space-y-4">
          {/* Mobile Outline */}
          <details className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover-lift">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
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
              <svg
                className="h-5 w-5 text-gray-400 transition-transform duration-200"
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
            </summary>
            <div className="px-4 pb-4">
              <Outline content={post.content} />
            </div>
          </details>

          {/* Mobile Share */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover-lift">
            <ShareArticle title={post.title} url={`/blog/${post.slug}`} />
          </div>

          {/* Mobile Tags */}
          {post.tags.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover-lift">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="px-3 py-1 bg-linear-to-r from-primary-50 to-accent-50 text-gray-700 rounded-full text-xs font-medium border border-primary-100 hover:border-primary-200 transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
