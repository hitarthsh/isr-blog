import GhostContentAPI from '@tryghost/content-api';
import { config } from '@/config/env';
import { GhostPost, GhostTag, GhostAuthor, GhostSettings } from '@/types/ghost';

export class GhostAPIClient {
  private api: any;
  private isConfigured: boolean = false;

  constructor() {
    // Only initialize if we have the required configuration
    if (config.ghost.apiUrl && config.ghost.contentApiKey) {
      try {
        this.api = new GhostContentAPI({
          url: config.ghost.apiUrl,
          key: config.ghost.contentApiKey,
          version: 'v5.0',
        });
        this.isConfigured = true;
      } catch (error) {
        console.warn('Failed to initialize Ghost API:', error);
        this.isConfigured = false;
      }
    } else {
      console.warn('Ghost API not configured: Missing API URL or key');
      this.isConfigured = false;
    }
  }

  async getPosts(params: {
    limit?: number;
    page?: number;
    filter?: string;
    order?: string;
    include?: string[];
    fields?: string;
  } = {}): Promise<{ posts: GhostPost[]; meta: any }> {
    if (!this.isConfigured) {
      console.warn('Ghost API not configured: Missing API URL or key');
      return { posts: [], meta: { pagination: { total: 0, page: 1, limit: 10, pages: 0 } } };
    }

    try {
      const result = await this.api.posts.browse({
        limit: params.limit || 10,
        page: params.page || 1,
        filter: params.filter,
        order: params.order || 'published_at DESC',
        include: params.include || ['tags', 'authors'],
        fields: params.fields,
      });

      return {
        posts: result.posts as GhostPost[],
        meta: result.meta,
      };
    } catch (error) {
      console.error('Ghost API error:', error);
      throw new Error(`Failed to fetch Ghost posts: ${error}`);
    }
  }

  async getPost(slug: string): Promise<GhostPost> {
    if (!this.isConfigured) {
      console.warn('Ghost API not configured: Missing API URL or key');
      throw new Error('Ghost API not configured');
    }

    try {
      const post = await this.api.posts.read({
        slug,
        include: ['tags', 'authors'],
      });

      return post as GhostPost;
    } catch (error) {
      console.error('Ghost API error:', error);
      throw new Error(`Failed to fetch Ghost post with slug "${slug}": ${error}`);
    }
  }

  async getPostById(id: string): Promise<GhostPost> {
    if (!this.isConfigured) {
      console.warn('Ghost API not configured: Missing API URL or key');
      throw new Error('Ghost API not configured');
    }

    try {
      const post = await this.api.posts.read({
        id,
        include: ['tags', 'authors'],
      });

      return post as GhostPost;
    } catch (error) {
      console.error('Ghost API error:', error);
      throw new Error(`Failed to fetch Ghost post with id "${id}": ${error}`);
    }
  }

  async getTags(params: {
    limit?: number;
    page?: number;
    filter?: string;
    order?: string;
    include?: string[];
    fields?: string;
  } = {}): Promise<{ tags: GhostTag[]; meta: any }> {
    if (!this.isConfigured) {
      console.warn('Ghost API not configured: Missing API URL or key');
      return { tags: [], meta: { pagination: { total: 0, page: 1, limit: 10, pages: 0 } } };
    }

    try {
      const result = await this.api.tags.browse({
        limit: params.limit || 10,
        page: params.page || 1,
        filter: params.filter,
        order: params.order || 'name ASC',
        include: params.include || [],
        fields: params.fields,
      });

      return {
        tags: result.tags as GhostTag[],
        meta: result.meta,
      };
    } catch (error) {
      console.error('Ghost API error:', error);
      throw new Error(`Failed to fetch Ghost tags: ${error}`);
    }
  }

  async getAuthors(params: {
    limit?: number;
    page?: number;
    filter?: string;
    order?: string;
    include?: string[];
    fields?: string;
  } = {}): Promise<{ authors: GhostAuthor[]; meta: any }> {
    if (!this.isConfigured) {
      console.warn('Ghost API not configured: Missing API URL or key');
      return { authors: [], meta: { pagination: { total: 0, page: 1, limit: 10, pages: 0 } } };
    }

    try {
      const result = await this.api.authors.browse({
        limit: params.limit || 10,
        page: params.page || 1,
        filter: params.filter,
        order: params.order || 'name ASC',
        include: params.include || [],
        fields: params.fields,
      });

      return {
        authors: result.authors as GhostAuthor[],
        meta: result.meta,
      };
    } catch (error) {
      console.error('Ghost API error:', error);
      throw new Error(`Failed to fetch Ghost authors: ${error}`);
    }
  }

  async getSettings(): Promise<GhostSettings> {
    if (!this.isConfigured) {
      console.warn('Ghost API not configured: Missing API URL or key');
      throw new Error('Ghost API not configured');
    }

    try {
      const settings = await this.api.settings.browse();
      return settings as GhostSettings;
    } catch (error) {
      console.error('Ghost API error:', error);
      throw new Error(`Failed to fetch Ghost settings: ${error}`);
    }
  }

  async searchPosts(query: string, limit: number = 10): Promise<{ posts: GhostPost[]; meta: any }> {
    if (!this.isConfigured) {
      console.warn('Ghost API not configured: Missing API URL or key');
      return { posts: [], meta: { pagination: { total: 0, page: 1, limit: 10, pages: 0 } } };
    }

    try {
      const result = await this.api.posts.browse({
        limit,
        filter: `title:~'${query}' OR content:~'${query}'`,
        include: ['tags', 'authors'],
      });

      return {
        posts: result.posts as GhostPost[],
        meta: result.meta,
      };
    } catch (error) {
      console.error('Ghost API error:', error);
      throw new Error(`Failed to search Ghost posts: ${error}`);
    }
  }
}

// Export a singleton instance
export const ghostAPI = new GhostAPIClient();
