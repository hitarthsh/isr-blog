import { WordPressPost } from './wordpress';
import { GhostPost } from './ghost';

export type BlogPost = WordPressPost | GhostPost;

export interface UnifiedPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    slug: string;
    avatar?: string;
    bio?: string;
  };
  featuredImage?: {
    url: string;
    alt?: string;
    caption?: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  source: 'wordpress' | 'ghost';
  url: string;
  readingTime?: number;
}

export interface BlogMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogResponse {
  posts: UnifiedPost[];
  meta: BlogMeta;
}
