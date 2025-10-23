import { config } from '@/config/env';
import { WordPressPost, WordPressMedia } from '@/types/wordpress';

const baseUrl = config.wordpress.apiUrl;

export class WordPressAPI {
  private static isConfigured(): boolean {
    return !!(config.wordpress.apiUrl && config.wordpress.username && config.wordpress.password);
  }

  private static async fetchWithAuth(url: string): Promise<Response> {
    if (!this.isConfigured()) {
      console.warn('WordPress API not configured: Missing API URL, username, or password');
      throw new Error('WordPress API not configured');
    }

    const credentials = btoa(`${config.wordpress.username}:${config.wordpress.password}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: config.isr.revalidateTime },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  static async getPosts(params: {
    per_page?: number;
    page?: number;
    search?: string;
    categories?: string;
    tags?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<WordPressPost[]> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const url = `${baseUrl}/posts?${searchParams.toString()}`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  }

  static async getPost(slug: string): Promise<WordPressPost> {
    const url = `${baseUrl}/posts?slug=${slug}`;
    const response = await this.fetchWithAuth(url);
    const posts = await response.json();
    
    if (posts.length === 0) {
      throw new Error(`Post with slug "${slug}" not found`);
    }
    
    return posts[0];
  }

  static async getPostById(id: number): Promise<WordPressPost> {
    const url = `${baseUrl}/posts/${id}`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  }

  static async getMedia(mediaId: number): Promise<WordPressMedia> {
    const url = `${baseUrl}/media/${mediaId}`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  }

  static async getCategories(): Promise<any[]> {
    const url = `${baseUrl}/categories`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  }

  static async getTags(): Promise<any[]> {
    const url = `${baseUrl}/tags`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  }

  static async searchPosts(query: string, limit: number = 10): Promise<WordPressPost[]> {
    return this.getPosts({
      search: query,
      per_page: limit,
    });
  }
}
