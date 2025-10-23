import { WordPressAPI } from './wordpress';
import { ghostAPI } from './ghost';
import { WordPressPost } from '@/types/wordpress';
import { GhostPost } from '@/types/ghost';
import { UnifiedPost, BlogResponse, BlogMeta } from '@/types/blog';
// import { config } from '@/config/env'; // Unused import removed

export class BlogService {
  private static transformWordPressPost(post: WordPressPost): UnifiedPost {
    return {
      id: `wp-${post.id}`,
      title: post.title.rendered,
      slug: post.slug,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      publishedAt: post.date,
      updatedAt: post.modified,
      author: {
        name: 'WordPress Author', // You might want to fetch author details
        slug: 'wordpress-author',
      },
      featuredImage: post.featured_media ? {
        url: '', // You'll need to fetch media details
        alt: '',
      } : undefined,
      tags: [], // You'll need to fetch tag details
      categories: [], // You'll need to fetch category details
      source: 'wordpress',
      url: post.link,
    };
  }

  private static transformGhostPost(post: GhostPost): UnifiedPost {
    return {
      id: `ghost-${post.id}`,
      title: post.title,
      slug: post.slug,
      content: post.html,
      excerpt: post.excerpt || post.custom_excerpt || '',
      publishedAt: post.published_at,
      updatedAt: post.updated_at,
      author: {
        name: post.primary_author.name,
        slug: post.primary_author.slug,
        avatar: post.primary_author.profile_image || undefined,
        bio: post.primary_author.bio || undefined,
      },
      featuredImage: post.feature_image ? {
        url: post.feature_image,
        alt: post.feature_image_alt || '',
        caption: post.feature_image_caption || '',
      } : undefined,
      tags: post.tags.map(tag => ({
        name: tag.name,
        slug: tag.slug,
      })),
      categories: [], // Ghost doesn't have categories in the same way
      source: 'ghost',
      url: post.url,
      readingTime: post.reading_time,
    };
  }

  static async getAllPosts(params: {
    limit?: number;
    page?: number;
    search?: string;
    source?: 'wordpress' | 'ghost' | 'all';
  } = {}): Promise<BlogResponse> {
    const { limit = 10, page = 1, search, source = 'all' } = params;
    const posts: UnifiedPost[] = [];
    let totalPosts = 0;

    try {
      // Fetch WordPress posts if requested
      if (source === 'all' || source === 'wordpress') {
        try {
          const wpParams: Record<string, string | number> = {
            per_page: source === 'wordpress' ? limit : Math.ceil(limit / 2),
            page: source === 'wordpress' ? page : 1,
          };
          
          if (search) {
            wpParams.search = search;
          }

          const wpPosts = await WordPressAPI.getPosts(wpParams);
          const transformedWpPosts = wpPosts.map(this.transformWordPressPost);
          posts.push(...transformedWpPosts);
          
          if (source === 'wordpress') {
            totalPosts = wpPosts.length;
          }
        } catch (wpError) {
          console.warn('WordPress API not available:', wpError);
          // Continue without WordPress posts
        }
      }

      // Fetch Ghost posts if requested
      if (source === 'all' || source === 'ghost') {
        try {
          const ghostParams: Record<string, string | number> = {
            limit: source === 'ghost' ? limit : Math.ceil(limit / 2),
            page: source === 'ghost' ? page : 1,
          };
          
          if (search) {
            ghostParams.filter = `title:~'${search}' OR content:~'${search}'`;
          }

          const ghostResult = await ghostAPI.getPosts(ghostParams);
          const transformedGhostPosts = ghostResult.posts.map(this.transformGhostPost);
          posts.push(...transformedGhostPosts);
          
          if (source === 'ghost') {
            totalPosts = ghostResult.meta.pagination.total;
          }
        } catch (ghostError) {
          console.warn('Ghost API not available:', ghostError);
          // Continue without Ghost posts
        }
      }

      // If no posts from APIs, return sample data for development
      if (posts.length === 0) {
        const samplePosts: UnifiedPost[] = [
          {
            id: 'sample-1',
            title: 'Welcome to CreativityCoder',
            slug: 'welcome-to-creativitycoder',
            content: `
              <h1 id="welcome-title">Welcome to CreativityCoder: The Future of Content Delivery</h1>
              <p>Welcome to the most advanced blog platform built with Next.js 14 and Incremental Static Regeneration (CreativityCoder). This platform represents the cutting edge of web performance, combining the speed of static sites with the flexibility of dynamic content updates.</p>
              
              <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8 rounded-r-lg">
                <div class="flex">
                  <div class="shrink-0">
                    <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-blue-700">
                      <strong>Platform Status:</strong> This is a demonstration platform showcasing modern web technologies and best practices for content delivery.
                    </p>
                  </div>
                </div>
              </div>
              
              <h2 id="what-is-creativitycoder">What is CreativityCoder?</h2>
              <p>CreativityCoder is a revolutionary content management platform that leverages Next.js 14's Incremental Static Regeneration to deliver lightning-fast performance while maintaining content freshness. Unlike traditional static sites that require full rebuilds for updates, or dynamic sites that sacrifice speed for flexibility, CreativityCoder gives you the best of both worlds.</p>
              
              <h3 id="core-philosophy">Our Core Philosophy</h3>
              <p>We believe that modern web applications should be:</p>
              <ul>
                <li><strong>Blazingly Fast:</strong> Sub-second load times with global CDN distribution</li>
                <li><strong>Always Fresh:</strong> Content updates without compromising performance</li>
                <li><strong>Developer Friendly:</strong> Modern tooling and intuitive APIs</li>
                <li><strong>Scalable:</strong> Handle traffic spikes without breaking a sweat</li>
                <li><strong>Cost Effective:</strong> Optimized resource usage and smart caching</li>
              </ul>
              
              <h2 id="platform-features">Platform Features</h2>
              <p>CreativityCoder comes packed with enterprise-grade features designed for modern content creators and developers:</p>
              
              <h3 id="performance-features">Performance Features</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div class="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 class="text-lg font-bold text-gray-900">Lightning Fast CreativityCoder</h4>
                  </div>
                  <p class="text-gray-700">Incremental Static Regeneration ensures your content loads instantly while staying fresh with automatic background updates.</p>
                </div>
                
                <div class="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 class="text-lg font-bold text-gray-900">Multi-Source Integration</h4>
                  </div>
                  <p class="text-gray-700">Seamlessly integrate content from WordPress, Ghost, and other CMS platforms into one unified experience.</p>
                </div>
                
                <div class="bg-linear-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h4 class="text-lg font-bold text-gray-900">Advanced Search</h4>
                  </div>
                  <p class="text-gray-700">Real-time search with intelligent filtering, suggestions, and content discovery across all your sources.</p>
                </div>
                
                <div class="bg-linear-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 01-2-2V5a2 2 0 012-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 class="text-lg font-bold text-gray-900">Mobile First</h4>
                  </div>
                  <p class="text-gray-700">Responsive design that looks stunning on every device, from mobile phones to large desktop screens.</p>
                </div>
              </div>
              
              <h3 id="developer-features">Developer Features</h3>
              <ul>
                <li><strong>TypeScript Support:</strong> Full type safety for robust development</li>
                <li><strong>REST API:</strong> Complete programmatic access to all content</li>
                <li><strong>Webhook Support:</strong> Real-time content updates and notifications</li>
                <li><strong>Custom Themes:</strong> Flexible theming system with Tailwind CSS</li>
                <li><strong>Plugin Architecture:</strong> Extensible platform for custom functionality</li>
                <li><strong>Performance Monitoring:</strong> Built-in analytics and performance tracking</li>
              </ul>
              
              <h2 id="technical-architecture">Technical Architecture</h2>
              <p>CreativityCoder is built on a modern, scalable architecture that ensures optimal performance and reliability:</p>
              
              <h3 id="frontend-stack">Frontend Stack</h3>
              <div class="bg-gray-100 p-6 rounded-lg my-8">
                <h4 class="font-bold text-lg mb-4">Core Technologies</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span class="text-white font-bold text-sm">Next.js</span>
                    </div>
                    <p class="text-sm font-medium">Next.js 14</p>
                  </div>
                  <div class="text-center">
                    <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span class="text-white font-bold text-sm">TS</span>
                    </div>
                    <p class="text-sm font-medium">TypeScript</p>
                  </div>
                  <div class="text-center">
                    <div class="w-16 h-16 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span class="text-white font-bold text-sm">TW</span>
                    </div>
                    <p class="text-sm font-medium">Tailwind CSS</p>
                  </div>
                  <div class="text-center">
                    <div class="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span class="text-white font-bold text-sm">React</span>
                    </div>
                    <p class="text-sm font-medium">React 18</p>
                  </div>
                </div>
              </div>
              
              <h3 id="performance-optimizations">Performance Optimizations</h3>
              <ul>
                <li><strong>Static Generation:</strong> Pages are pre-rendered at build time for maximum speed</li>
                <li><strong>CreativityCoder Implementation:</strong> Smart revalidation keeps content fresh without full rebuilds</li>
                <li><strong>Image Optimization:</strong> Next.js Image component with automatic optimization</li>
                <li><strong>Code Splitting:</strong> Automatic code splitting for optimal loading</li>
                <li><strong>Edge Caching:</strong> Global CDN distribution for worldwide performance</li>
                <li><strong>Bundle Analysis:</strong> Optimized JavaScript bundles for minimal payload</li>
              </ul>
              
              <h2 id="content-management">Content Management</h2>
              <p>CreativityCoder supports multiple content sources, giving you flexibility in how you manage your content:</p>
              
              <h3 id="supported-platforms">Supported Platforms</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <span class="text-white font-bold text-lg">W</span>
                    </div>
                    <h4 class="text-lg font-bold text-gray-900">WordPress</h4>
                  </div>
                  <p class="text-gray-700 mb-4">Integrate with any WordPress site using the REST API. Perfect for existing WordPress users who want better performance.</p>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• REST API integration</li>
                    <li>• Custom post types support</li>
                    <li>• Media library access</li>
                    <li>• User authentication</li>
                  </ul>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                      <span class="text-white font-bold text-lg">G</span>
                    </div>
                    <h4 class="text-lg font-bold text-gray-900">Ghost</h4>
                  </div>
                  <p class="text-gray-700 mb-4">Connect to Ghost CMS for a modern, API-first content management experience with built-in SEO features.</p>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Content API integration</li>
                    <li>• Admin API support</li>
                    <li>• Built-in SEO features</li>
                    <li>• Membership support</li>
                  </ul>
                </div>
              </div>
              
              <h3 id="content-sync">Content Synchronization</h3>
              <p>CreativityCoder automatically syncs content from your connected sources:</p>
              <ul>
                <li><strong>Real-time Updates:</strong> Content changes are reflected immediately</li>
                <li><strong>Smart Caching:</strong> Intelligent caching reduces API calls and improves performance</li>
                <li><strong>Conflict Resolution:</strong> Automatic handling of content conflicts and duplicates</li>
                <li><strong>Backup & Recovery:</strong> Built-in content backup and recovery mechanisms</li>
              </ul>
              
              <h2 id="getting-started">Getting Started</h2>
              <p>Ready to experience the future of content delivery? Here's how to get started with CreativityCoder:</p>
              
              <h3 id="for-content-creators">For Content Creators</h3>
              <div class="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 my-8">
                <h4 class="text-lg font-bold text-gray-900 mb-4">Quick Start Guide</h4>
                <ol class="space-y-3">
                  <li class="flex items-start">
                    <span class="shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    <div>
                      <strong>Connect Your CMS:</strong> Link your WordPress or Ghost site to CreativityCoder
                    </div>
                  </li>
                  <li class="flex items-start">
                    <span class="shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    <div>
                      <strong>Customize Your Theme:</strong> Choose from our collection of beautiful, responsive themes
                    </div>
                  </li>
                  <li class="flex items-start">
                    <span class="shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    <div>
                      <strong>Configure Settings:</strong> Set up SEO, analytics, and performance preferences
                    </div>
                  </li>
                  <li class="flex items-start">
                    <span class="shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                    <div>
                      <strong>Go Live:</strong> Deploy your lightning-fast blog in minutes
                    </div>
                  </li>
                </ol>
              </div>
              
              <h3 id="for-developers">For Developers</h3>
              <div class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto my-8">
                <pre><code># Clone the repository
git clone https://github.com/your-org/creativitycoder.git
cd creativitycoder

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev

# Build for production
npm run build
npm start</code></pre>
              </div>
              
              <h3 id="api-usage">API Usage</h3>
              <p>CreativityCoder provides a comprehensive REST API for programmatic access:</p>
              <div class="bg-gray-100 p-6 rounded-lg my-8">
                <h4 class="font-bold text-lg mb-4">Available Endpoints</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between bg-white p-3 rounded border">
                    <span class="font-mono text-sm">GET /api/posts</span>
                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Public</span>
                  </div>
                  <div class="flex items-center justify-between bg-white p-3 rounded border">
                    <span class="font-mono text-sm">GET /api/posts/[slug]</span>
                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Public</span>
                  </div>
                  <div class="flex items-center justify-between bg-white p-3 rounded border">
                    <span class="font-mono text-sm">GET /api/search</span>
                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Public</span>
                  </div>
                  <div class="flex items-center justify-between bg-white p-3 rounded border">
                    <span class="font-mono text-sm">POST /api/revalidate</span>
                    <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Admin</span>
                  </div>
                </div>
              </div>
              
              <h2 id="performance-metrics">Performance Metrics</h2>
              <p>CreativityCoder delivers exceptional performance across all key metrics:</p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div class="text-center bg-white border border-gray-200 rounded-xl p-6">
                  <div class="text-3xl font-bold text-green-600 mb-2">95+</div>
                  <div class="text-sm text-gray-600">Lighthouse Performance Score</div>
                </div>
                <div class="text-center bg-white border border-gray-200 rounded-xl p-6">
                  <div class="text-3xl font-bold text-blue-600 mb-2">&lt;1s</div>
                  <div class="text-sm text-gray-600">First Contentful Paint</div>
                </div>
                <div class="text-center bg-white border border-gray-200 rounded-xl p-6">
                  <div class="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div class="text-sm text-gray-600">Uptime Guarantee</div>
                </div>
              </div>
              
              <h2 id="use-cases">Use Cases</h2>
              <p>CreativityCoder is perfect for a wide range of applications:</p>
              
              <h3 id="content-platforms">Content Platforms</h3>
              <ul>
                <li><strong>Corporate Blogs:</strong> Professional company blogs with enterprise-grade performance</li>
                <li><strong>News Sites:</strong> High-traffic news sites requiring fast content delivery</li>
                <li><strong>Documentation:</strong> Technical documentation with search and navigation</li>
                <li><strong>E-learning:</strong> Educational content with multimedia support</li>
              </ul>
              
              <h3 id="developer-tools">Developer Tools</h3>
              <ul>
                <li><strong>API Documentation:</strong> Interactive API docs with live examples</li>
                <li><strong>Changelog Sites:</strong> Product update and release notes</li>
                <li><strong>Portfolio Sites:</strong> Developer portfolios with project showcases</li>
                <li><strong>Open Source Projects:</strong> Project documentation and community sites</li>
              </ul>
              
              <h2 id="roadmap">Platform Roadmap</h2>
              <p>We're constantly improving CreativityCoder with new features and capabilities:</p>
              
              <div class="bg-linear-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 my-8">
                <h4 class="text-lg font-bold text-gray-900 mb-4">Upcoming Features</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <h5 class="font-semibold text-gray-800">Q1 2024</h5>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li>• Advanced analytics dashboard</li>
                      <li>• Custom theme builder</li>
                      <li>• Multi-language support</li>
                    </ul>
                  </div>
                  <div class="space-y-2">
                    <h5 class="font-semibold text-gray-800">Q2 2024</h5>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li>• AI-powered content suggestions</li>
                      <li>• Advanced SEO tools</li>
                      <li>• Membership features</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h2 id="community-support">Community & Support</h2>
              <p>Join our growing community of developers and content creators:</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div class="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 class="text-lg font-bold text-gray-900 mb-4">Get Help</h4>
                  <ul class="space-y-2 text-sm">
                    <li><a href="#" class="text-blue-600 hover:text-blue-800">📚 Documentation</a></li>
                    <li><a href="#" class="text-blue-600 hover:text-blue-800">💬 Community Forum</a></li>
                    <li><a href="#" class="text-blue-600 hover:text-blue-800">🐛 Issue Tracker</a></li>
                    <li><a href="#" class="text-blue-600 hover:text-blue-800">📧 Support Email</a></li>
                  </ul>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 class="text-lg font-bold text-gray-900 mb-4">Contribute</h4>
                  <ul class="space-y-2 text-sm">
                    <li><a href="#" class="text-blue-600 hover:text-blue-800">🔧 GitHub Repository</a></li>
                    <li><a href="#" class="text-blue-600 hover:text-blue-800">📝 Submit PR</a></li>
                    <li><a href="#" class="text-blue-600 hover:text-blue-800">💡 Feature Requests</a></li>
                    <li><a href="#" class="text-blue-600 hover:text-blue-800">⭐ Star the Project</a></li>
                  </ul>
                </div>
              </div>
              
              <h2 id="conclusion">Conclusion</h2>
              <p>CreativityCoder represents the future of content delivery, combining the best of static site performance with dynamic content flexibility. Whether you're a content creator looking for better performance, a developer building modern web applications, or an organization seeking scalable content solutions, CreativityCoder provides the tools and infrastructure you need to succeed.</p>
              
              <p>With its modern architecture, comprehensive feature set, and commitment to performance, CreativityCoder is more than just a blogging platform—it's a complete content delivery solution for the modern web.</p>
              
              <div class="bg-linear-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl my-8">
                <h3 class="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p class="mb-6">Join thousands of developers and content creators who are already experiencing the power of CreativityCoder.</p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <a href="/admin" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-center">
                    🚀 Try the Demo
                  </a>
                  <a href="/api/posts" class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 text-center">
                    📡 Explore the API
                  </a>
                </div>
              </div>
              
              <p class="text-center text-gray-600 mt-8">
                <em>Welcome to the future of content delivery. Welcome to CreativityCoder.</em>
              </p>
            `,
            excerpt: 'Welcome to the most advanced blog platform built with Next.js 14 and Incremental Static Regeneration. Experience lightning-fast performance with dynamic content updates.',
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              name: 'Hitarth Shah',
              slug: 'hitarth-shah',
              bio: 'The creator behind the most advanced blog platform built with Next.js 14 and Incremental Static Regeneration.',
            },
            featuredImage: {
              url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
              alt: 'Sample blog post image',
            },
            tags: [
              { name: 'Next.js', slug: 'nextjs' },
              { name: 'CreativityCoder', slug: 'creativitycoder' },
              { name: 'Performance', slug: 'performance' },
              { name: 'Platform', slug: 'platform' },
              { name: 'Welcome', slug: 'welcome' },
            ],
            categories: [],
            source: 'wordpress',
            url: '/blog/welcome-to-creativitycoder',
            readingTime: 8,
          },
          {
            id: 'sample-2',
            title: 'Getting Started with Next.js CreativityCoder',
            slug: 'getting-started-with-nextjs-isr',
            content: '<p>Learn how to implement Incremental Static Regeneration in your Next.js applications for optimal performance.</p>',
            excerpt: 'Learn how to implement Incremental Static Regeneration in your Next.js applications.',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            author: {
              name: 'Kenil Gamer',
              slug: 'kenil-gamer',
            },
            featuredImage: {
              url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
              alt: 'Next.js development',
            },
            tags: [
              { name: 'Next.js', slug: 'nextjs' },
              { name: 'CreativityCoder', slug: 'creativitycoder' },
              { name: 'Performance', slug: 'performance' },
            ],
            categories: [],
            source: 'ghost',
            url: '/blog/getting-started-with-nextjs-isr',
            readingTime: 5,
          },
        ];

        posts.push(...samplePosts);
        totalPosts = samplePosts.length;
      }

      // Sort posts by published date (newest first)
      posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // If fetching from all sources, we need to estimate total
      if (source === 'all' && totalPosts === 0) {
        totalPosts = posts.length;
      }

      const meta: BlogMeta = {
        total: totalPosts,
        page,
        limit,
        totalPages: Math.ceil(totalPosts / limit),
      };

      return {
        posts: posts.slice(0, limit),
        meta,
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error(`Failed to fetch blog posts: ${error}`);
    }
  }

  static async getPost(slug: string, source?: 'wordpress' | 'ghost'): Promise<UnifiedPost> {
    try {
      // If source is specified, try that first
      if (source === 'wordpress') {
        try {
          const wpPost = await WordPressAPI.getPost(slug);
          return this.transformWordPressPost(wpPost);
        } catch (wpError) {
          console.warn('WordPress API not available:', wpError);
          throw new Error(`WordPress API not available`);
        }
      }
      
      if (source === 'ghost') {
        try {
          const ghostPost = await ghostAPI.getPost(slug);
          return this.transformGhostPost(ghostPost);
        } catch (ghostError) {
          console.warn('Ghost API not available:', ghostError);
          throw new Error(`Ghost API not available`);
        }
      }

      // If no source specified, try both
      try {
        const ghostPost = await ghostAPI.getPost(slug);
        return this.transformGhostPost(ghostPost);
      } catch {
        try {
          const wpPost = await WordPressAPI.getPost(slug);
          return this.transformWordPressPost(wpPost);
        } catch {
          // Return sample post if APIs are not available
          if (slug === 'welcome-to-creativitycoder') {
            return {
              id: 'sample-1',
              title: 'Welcome to CreativityCoder',
              slug: 'welcome-to-creativitycoder',
              content: `
                <h1 id="welcome-title">Welcome to CreativityCoder: Your Modern Content Platform</h1>
                <p>Welcome to the future of content management! This CreativityCoder platform demonstrates the power of Incremental Static Regeneration combined with multi-source content integration. Whether you're a developer, content creator, or business owner, this platform showcases how modern web technologies can deliver exceptional performance and user experience.</p>
                
                <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>Getting Started:</strong> This is a sample blog post demonstrating the platform's capabilities. Configure your WordPress and Ghost APIs to see real content from your sources.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h2 id="platform-features">🚀 Platform Features</h2>
                <p>This platform showcases cutting-edge web development practices and modern content management:</p>
                
                <h3 id="core-technologies">Core Technologies</h3>
                <ul>
                  <li><strong>Incremental Static Regeneration (CreativityCoder)</strong> - Automatic content updates with optimal performance</li>
                  <li><strong>Multi-source content integration</strong> - Seamlessly combine WordPress and Ghost content</li>
                  <li><strong>Advanced search functionality</strong> - Real-time search with filtering and suggestions</li>
                  <li><strong>Responsive design</strong> - Mobile-first, beautiful UI with Tailwind CSS</li>
                  <li><strong>TypeScript support</strong> - Full type safety for robust development</li>
                  <li><strong>REST API</strong> - Complete API for programmatic access</li>
                </ul>
                
                <div class="bg-gray-100 p-6 rounded-lg my-8">
                  <h4 class="font-bold text-lg mb-4">Performance Benefits</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="font-semibold text-gray-900 mb-2">⚡ Speed</h5>
                      <p class="text-sm text-gray-700">Static pages load instantly from CDN with automatic background updates</p>
                    </div>
                    <div>
                      <h5 class="font-semibold text-gray-900 mb-2">🔄 Fresh Content</h5>
                      <p class="text-sm text-gray-700">Content updates automatically without full site rebuilds</p>
                    </div>
                    <div>
                      <h5 class="font-semibold text-gray-900 mb-2">📱 Mobile-First</h5>
                      <p class="text-sm text-gray-700">Responsive design optimized for all devices</p>
                    </div>
                    <div>
                      <h5 class="font-semibold text-gray-900 mb-2">🔍 Smart Search</h5>
                      <p class="text-sm text-gray-700">Real-time search with intelligent filtering</p>
                    </div>
                  </div>
                </div>
                
                <h2 id="getting-started">🛠️ Getting Started</h2>
                <p>Setting up your CreativityCoder platform is straightforward. Follow these steps to get your content sources connected:</p>
                
                <h3 id="environment-setup">Environment Setup</h3>
                <p>Create a <code>.env.local</code> file in your project root with your API credentials:</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code># WordPress Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_USERNAME=your-username
WORDPRESS_PASSWORD=your-application-password

# Ghost Configuration
GHOST_API_URL=https://your-ghost-site.com
GHOST_CONTENT_API_KEY=your-ghost-content-api-key

# CreativityCoder Configuration
CreativityCoder_REVALIDATE_TIME=3600</code></pre>
                
                <h3 id="wordpress-configuration">WordPress Configuration</h3>
                <p>Set up your WordPress REST API with application passwords for secure access:</p>
                
                <div class="bg-green-50 border-l-4 border-green-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-green-700">
                        <strong>WordPress Setup:</strong> Go to Users → Profile → Application Passwords to generate secure API credentials. Use these instead of your regular password for API access.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 id="ghost-configuration">Ghost Configuration</h3>
                <p>Enable the Content API in your Ghost admin and generate API keys:</p>
                
                <div class="bg-green-50 border-l-4 border-green-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-green-700">
                        <strong>Ghost Setup:</strong> Navigate to Settings → Integrations → Add custom integration to create a Content API key. This allows read-only access to your Ghost content.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h2 id="development-workflow">💻 Development Workflow</h2>
                <p>This platform is designed with developers in mind, offering a smooth development experience:</p>
                
                <h3 id="available-scripts">Available Scripts</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code># Development
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run setup    # Interactive environment setup</code></pre>
                
                <h3 id="project-structure">Project Structure</h3>
                <div class="bg-gray-100 p-6 rounded-lg my-8">
                  <h4 class="font-bold text-lg mb-4">Key Directories</h4>
                  <ul class="space-y-2 text-sm">
                    <li><strong>src/app/</strong> - Next.js App Router pages and API routes</li>
                    <li><strong>src/components/</strong> - Reusable React components</li>
                    <li><strong>src/lib/</strong> - Utility functions and service classes</li>
                    <li><strong>src/types/</strong> - TypeScript type definitions</li>
                    <li><strong>src/config/</strong> - Configuration files and environment setup</li>
                  </ul>
                </div>
                
                <h2 id="deployment">🚀 Deployment</h2>
                <p>Deploy your CreativityCoder platform to any platform that supports Next.js:</p>
                
                <h3 id="vercel-deployment">Vercel (Recommended)</h3>
                <ol>
                  <li><strong>Connect your repository</strong> to Vercel</li>
                  <li><strong>Set environment variables</strong> in Vercel dashboard</li>
                  <li><strong>Deploy</strong> - Automatic deployments on push</li>
                </ol>
                
                <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>Pro Tip:</strong> Vercel provides the best CreativityCoder experience with automatic edge caching and global distribution. Your content will be served from locations closest to your users worldwide.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 id="other-platforms">Other Platforms</h3>
                <p>The application can also be deployed to:</p>
                <ul>
                  <li>Netlify</li>
                  <li>AWS Amplify</li>
                  <li>Railway</li>
                  <li>DigitalOcean App Platform</li>
                </ul>
                
                <h2 id="best-practices">✨ Best Practices</h2>
                <p>Follow these recommendations to get the most out of your CreativityCoder platform:</p>
                
                <h3 id="content-strategy">Content Strategy</h3>
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-yellow-700">
                        <strong>Content Management:</strong> Use WordPress for traditional blog posts and Ghost for modern content. The platform automatically combines content from both sources for a unified experience.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 id="performance-optimization">Performance Optimization</h3>
                <ul>
                  <li><strong>Optimize images:</strong> Use Next.js Image component for automatic optimization</li>
                  <li><strong>Monitor revalidation:</strong> Track how often your content updates</li>
                  <li><strong>Use appropriate revalidation times:</strong> Balance freshness with performance</li>
                  <li><strong>Implement proper error handling:</strong> Graceful fallbacks for failed requests</li>
                </ul>
                
                <h2 id="api-endpoints">🔌 API Endpoints</h2>
                <p>The platform provides a complete REST API for programmatic access:</p>
                
                <h3 id="posts-api">Posts API</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code># Get all posts
GET /api/posts?limit=10&page=1&source=all

# Get specific post
GET /api/posts/[slug]?source=wordpress

# Search posts
GET /api/search?q=javascript&limit=5</code></pre>
                
                <h3 id="admin-api">Admin API</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code># Test connections
GET /api/admin/test-connections</code></pre>
                
                <h2 id="conclusion">🎉 Conclusion</h2>
                <p>This CreativityCoder platform represents the cutting edge of modern web development, combining the performance benefits of static site generation with the flexibility of dynamic content updates. Built with Next.js 14, TypeScript, and Tailwind CSS, it provides an excellent foundation for any content-driven application.</p>
                
                <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>Next Steps:</strong> Configure your content sources, customize the design to match your brand, and start publishing amazing content. The platform will automatically handle the rest, ensuring your content is always fresh and your site performs optimally.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p>Whether you're building a personal blog, corporate website, or content platform, this CreativityCoder provides the perfect foundation for success. Happy coding! 🚀</p>
              `,
              excerpt: 'This is a sample blog post to demonstrate the CreativityCoder platform.',
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              author: {
                name: 'Hitarth Shah',
                slug: 'hitarth-shah',
              },
              featuredImage: {
                url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
                alt: 'Sample blog post image',
              },
              tags: [
                { name: 'Sample', slug: 'sample' },
                { name: 'Blog', slug: 'blog' },
              ],
              categories: [],
              source: 'wordpress',
              url: '/blog/welcome-to-creativitycoder',
              readingTime: 2,
            };
          }
          if (slug === 'getting-started-with-nextjs-isr') {
            return {
              id: 'sample-2',
              title: 'Getting Started with Next.js CreativityCoder',
              slug: 'getting-started-with-nextjs-isr',
              content: `
                <h1 id="getting-started-title">Getting Started with Next.js CreativityCoder: The Complete Guide</h1>
                <p>Incremental Static Regeneration (CreativityCoder) is one of Next.js's most powerful features, allowing you to combine the benefits of static site generation with dynamic content updates. This comprehensive guide will take you from CreativityCoder basics to advanced implementation patterns.</p>
                
                <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>Prerequisites:</strong> Basic knowledge of Next.js, React, and static site generation concepts.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h2 id="what-is-isr">What is Incremental Static Regeneration?</h2>
                <p>Incremental Static Regeneration (CreativityCoder) is a Next.js feature that allows you to update static content after build time without rebuilding the entire site. It bridges the gap between static site generation (SSG) and server-side rendering (SSR), giving you the best of both worlds.</p>
                
                <h3 id="how-isr-works">How CreativityCoder Works</h3>
                <p>Here's the magic behind CreativityCoder:</p>
                <ol>
                  <li><strong>Initial Request:</strong> When a user visits a page for the first time, Next.js serves the statically generated version</li>
                  <li><strong>Background Revalidation:</strong> If the page is older than the specified revalidation time, Next.js triggers a background regeneration</li>
                  <li><strong>Stale-While-Revalidate:</strong> Users continue to see the cached version while the new version is being generated</li>
                  <li><strong>Fresh Content:</strong> Once regeneration is complete, subsequent users get the updated content</li>
                </ol>
                
                <div class="bg-gray-100 p-6 rounded-lg my-8">
                  <h4 class="font-bold text-lg mb-4">CreativityCoder Flow Diagram</h4>
                  <pre class="text-sm"><code>User Request → Static Page (if fresh) → Serve immediately
                ↓
User Request → Static Page (if stale) → Serve stale + Regenerate in background
                ↓
Next User → Fresh Static Page → Serve immediately</code></pre>
                </div>
                
                <h2 id="benefits-of-isr">Why Use CreativityCoder? The Benefits</h2>
                <p>CreativityCoder provides several compelling advantages:</p>
                
                <h3 id="performance-benefits">Performance Benefits</h3>
                <ul>
                  <li><strong>Lightning-fast loading:</strong> Static pages load instantly from CDN</li>
                  <li><strong>Reduced server load:</strong> Only regenerates pages when needed</li>
                  <li><strong>Better Core Web Vitals:</strong> Improved LCP, FID, and CLS scores</li>
                  <li><strong>Global distribution:</strong> Content served from edge locations worldwide</li>
                </ul>
                
                <h3 id="developer-benefits">Developer Benefits</h3>
                <ul>
                  <li><strong>No full rebuilds:</strong> Update content without redeploying</li>
                  <li><strong>Flexible revalidation:</strong> Control when and how content updates</li>
                  <li><strong>Fallback support:</strong> Graceful handling of regeneration failures</li>
                  <li><strong>SEO friendly:</strong> Search engines can crawl static content</li>
                </ul>
                
                <h3 id="business-benefits">Business Benefits</h3>
                <ul>
                  <li><strong>Cost effective:</strong> Reduced server costs compared to SSR</li>
                  <li><strong>Scalable:</strong> Handles traffic spikes without performance degradation</li>
                  <li><strong>Reliable:</strong> Static content is highly available</li>
                  <li><strong>Fast time-to-market:</strong> Quick content updates without deployment cycles</li>
                </ul>
                
                <h2 id="basic-implementation">Basic CreativityCoder Implementation</h2>
                <p>Let's start with the simplest CreativityCoder implementation. Here's how to add CreativityCoder to any Next.js page:</p>
                
                <h3 id="page-level-revalidation">Page-Level Revalidation</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// pages/blog/[slug].js or app/blog/[slug]/page.js
export const revalidate = 3600; // Revalidate every hour (3600 seconds)

export default async function BlogPost({ params }) {
  const post = await fetchPost(params.slug);
  
  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;div dangerouslySetInnerHTML={{ __html: post.content }} /&gt;
    &lt;/article&gt;
  );
}</code></pre>
                
                <h3 id="api-route-revalidation">API Route Revalidation</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/api/posts/route.js
export const revalidate = 1800; // Revalidate every 30 minutes

export async function GET() {
  const posts = await fetchPosts();
  return Response.json(posts);
}</code></pre>
                
                <h2 id="advanced-revalidation">Advanced Revalidation Strategies</h2>
                
                <h3 id="revalidate-tag">Using revalidateTag for Granular Control</h3>
                <p><code>revalidateTag</code> allows you to invalidate specific cached data based on tags, providing more granular control than time-based revalidation.</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/blog/[slug]/page.js
import { revalidateTag } from 'next/cache';

export const revalidate = 3600;

export default async function BlogPost({ params }) {
  const post = await fetch('https://api.example.com/posts/' + params.slug, {
    next: { tags: ['posts', 'post-' + params.slug] }
  });
  
  return &lt;article&gt;{/* Post content */}&lt;/article&gt;;
}

// app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  const { tag } = await request.json();
  
  revalidateTag(tag);
  
  return Response.json({ revalidated: true, tag });
}</code></pre>
                
                <h3 id="on-demand-revalidation">On-Demand Revalidation</h3>
                <p>Trigger revalidation programmatically when content changes:</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/api/revalidate/route.js
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const { path } = await request.json();
  
  // Revalidate specific path
  revalidatePath(path);
  
  return Response.json({ revalidated: true, path });
}

// Usage: Trigger revalidation when content is updated
// POST /api/revalidate
// Body: { "path": "/blog/my-post" }</code></pre>
                
                <h3 id="conditional-revalidation">Conditional Revalidation</h3>
                <p>Implement smart revalidation based on content freshness:</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/blog/[slug]/page.js
export const revalidate = 0; // Always check for updates

export default async function BlogPost({ params }) {
  const post = await fetchPost(params.slug);
  
  // Check if post was updated recently
  const lastModified = new Date(post.updatedAt);
  const now = new Date();
  const hoursSinceUpdate = (now - lastModified) / (1000 * 60 * 60);
  
  // Only revalidate if post was updated in the last 24 hours
  if (hoursSinceUpdate < 24) {
    revalidateTag('post-' + params.slug);
  }
  
  return &lt;article&gt;{/* Post content */}&lt;/article&gt;;
}</code></pre>
                
                <h2 id="real-world-examples">Real-World Implementation Examples</h2>
                
                <h3 id="blog-platform">Blog Platform with CreativityCoder</h3>
                <p>Here's a complete example of a blog platform using CreativityCoder:</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/blog/page.js
export const revalidate = 3600; // 1 hour

async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    &lt;div&gt;
      &lt;h1&gt;Blog Posts&lt;/h1&gt;
      {posts.map(post => (
        &lt;article key={post.id}&gt;
          &lt;h2&gt;{post.title}&lt;/h2&gt;
          &lt;p&gt;{post.excerpt}&lt;/p&gt;
        &lt;/article&gt;
      ))}
    &lt;/div&gt;
  );
}

// app/blog/[slug]/page.js
export const revalidate = 1800; // 30 minutes for individual posts

async function getPost(slug) {
  const res = await fetch('https://api.example.com/posts/' + slug, {
    next: { tags: ['posts', 'post-' + slug] }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return res.json();
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  
  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;div dangerouslySetInnerHTML={{ __html: post.content }} /&gt;
    &lt;/article&gt;
  );
}</code></pre>
                
                <h3 id="ecommerce-product-pages">E-commerce Product Pages</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/products/[id]/page.js
export const revalidate = 600; // 10 minutes for product data

async function getProduct(id) {
  const res = await fetch('https://api.example.com/products/' + id, {
    next: { tags: ['products', 'product-' + id] }
  });
  
  return res.json();
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  
  return (
    &lt;div&gt;
      &lt;h1&gt;{product.name}&lt;/h1&gt;
      &lt;p&gt;Price: {product.price}&lt;/p&gt;
      &lt;p&gt;Stock: {product.stock}&lt;/p&gt;
      &lt;img src={product.image} alt={product.name} /&gt;
    &lt;/div&gt;
  );
}

// app/api/webhook/product-updated/route.js
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  const { productId } = await request.json();
  
  // Revalidate specific product
  revalidateTag('product-' + productId);
  
  // Also revalidate products list
  revalidateTag('products');
  
  return Response.json({ revalidated: true });
}</code></pre>
                
                <h2 id="performance-optimization">Performance Optimization Techniques</h2>
                
                <h3 id="optimal-revalidation-times">Choosing Optimal Revalidation Times</h3>
                <p>Select revalidation times based on your content update patterns:</p>
                
                <div class="bg-gray-100 p-6 rounded-lg my-8">
                  <h4 class="font-bold text-lg mb-4">Revalidation Time Guidelines</h4>
                  <ul class="space-y-2">
                    <li><strong>News/Blog posts:</strong> 300-1800 seconds (5-30 minutes)</li>
                    <li><strong>Product catalogs:</strong> 600-3600 seconds (10-60 minutes)</li>
                    <li><strong>User profiles:</strong> 0-300 seconds (real-time to 5 minutes)</li>
                    <li><strong>Static content:</strong> 86400+ seconds (24+ hours)</li>
                    <li><strong>Analytics dashboards:</strong> 300-900 seconds (5-15 minutes)</li>
                  </ul>
                </div>
                
                <h3 id="caching-strategies">Advanced Caching Strategies</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// Multi-level caching with different revalidation times
export const revalidate = 3600; // Base revalidation

async function getData() {
  // Critical data - short revalidation
  const criticalData = await fetch('https://api.example.com/critical', {
    next: { revalidate: 300, tags: ['critical'] }
  });
  
  // Regular data - medium revalidation
  const regularData = await fetch('https://api.example.com/regular', {
    next: { revalidate: 1800, tags: ['regular'] }
  });
  
  // Static data - long revalidation
  const staticData = await fetch('https://api.example.com/static', {
    next: { revalidate: 86400, tags: ['static'] }
  });
  
  return {
    critical: await criticalData.json(),
    regular: await regularData.json(),
    static: await staticData.json()
  };
}</code></pre>
                
                <h3 id="error-handling">Error Handling and Fallbacks</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/blog/[slug]/page.js
export const revalidate = 3600;

async function getPost(slug) {
  try {
    const res = await fetch('https://api.example.com/posts/' + slug, {
      next: { tags: ['posts', 'post-' + slug] }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch post: ' + res.status);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    
    // Return fallback data or throw to trigger 404
    return {
      title: 'Post Not Available',
      content: 'This post is temporarily unavailable. Please try again later.',
      isFallback: true
    };
  }
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  
  if (post.isFallback) {
    return (
      &lt;div className="text-center py-12"&gt;
        &lt;h1&gt;{post.title}&lt;/h1&gt;
        &lt;p&gt;{post.content}&lt;/p&gt;
      &lt;/div&gt;
    );
  }
  
  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;div dangerouslySetInnerHTML={{ __html: post.content }} /&gt;
    &lt;/article&gt;
  );
}</code></pre>
                
                <h2 id="monitoring-and-debugging">Monitoring and Debugging CreativityCoder</h2>
                
                <h3 id="vercel-analytics">Using Vercel Analytics</h3>
                <p>Monitor CreativityCoder performance with Vercel Analytics:</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// Install Vercel Analytics
npm install @vercel/analytics

// app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    &lt;html&gt;
      &lt;body&gt;
        {children}
        &lt;Analytics /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>
                
                <h3 id="custom-monitoring">Custom CreativityCoder Monitoring</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// lib/isr-monitor.js
export class CreativityCoderMonitor {
  static async logRevalidation(path, duration, success) {
    const logData = {
      timestamp: new Date().toISOString(),
      path,
      duration,
      success,
      environment: process.env.NODE_ENV
    };
    
    // Log to your monitoring service
    console.log('CreativityCoder Revalidation:', logData);
    
    // Send to analytics service
    if (process.env.ANALYTICS_ENDPOINT) {
      await fetch(process.env.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
    }
  }
}

// Usage in your pages
import { CreativityCoderMonitor } from '@/lib/isr-monitor';

export default async function MyPage() {
  const startTime = Date.now();
  
  try {
    const data = await fetchData();
    const duration = Date.now() - startTime;
    
    await CreativityCoderMonitor.logRevalidation('/my-page', duration, true);
    
    return &lt;div&gt;{/* Page content */}&lt;/div&gt;;
  } catch (error) {
    const duration = Date.now() - startTime;
    await CreativityCoderMonitor.logRevalidation('/my-page', duration, false);
    throw error;
  }
}</code></pre>
                
                <h2 id="common-pitfalls">Common Pitfalls and How to Avoid Them</h2>
                
                <h3 id="pitfall-1">Pitfall 1: Too Frequent Revalidation</h3>
                <div class="bg-red-50 border-l-4 border-red-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700">
                        <strong>Problem:</strong> Setting revalidate to very low values (like 1 second) defeats the purpose of CreativityCoder and can cause performance issues.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-green-50 border-l-4 border-green-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-green-700">
                        <strong>Solution:</strong> Choose revalidation times based on your content update frequency. Use on-demand revalidation for immediate updates when needed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 id="pitfall-2">Pitfall 2: Not Handling Stale Data Gracefully</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// Bad: No fallback for stale data
export default async function MyPage() {
  const data = await fetch('https://api.example.com/data');
  return &lt;div&gt;{data.content}&lt;/div&gt;;
}

// Good: Graceful handling of stale data
export default async function MyPage() {
  try {
    const data = await fetch('https://api.example.com/data', {
      next: { revalidate: 3600 }
    });
    
    if (!data.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return &lt;div&gt;{data.content}&lt;/div&gt;;
  } catch (error) {
    // Fallback to cached version or show error state
    return &lt;div&gt;Content temporarily unavailable&lt;/div&gt;;
  }
}</code></pre>
                
                <h3 id="pitfall-3">Pitfall 3: Ignoring Build-Time vs Runtime Data</h3>
                <p>Remember that CreativityCoder pages are generated at build time first, then revalidated at runtime. Ensure your data fetching works in both contexts.</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// Ensure your fetch works in both build and runtime environments
async function fetchData() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.example.com' 
    : 'http://localhost:3000/api';
    
  const res = await fetch(baseUrl + '/data', {
    headers: {
      'Authorization': 'Bearer ' + process.env.API_TOKEN
    }
  });
  
  return res.json();
}</code></pre>
                
                <h2 id="best-practices">CreativityCoder Best Practices</h2>
                
                <h3 id="content-strategy">Content Strategy</h3>
                <ol>
                  <li><strong>Analyze your content update patterns</strong> - How often does your content actually change?</li>
                  <li><strong>Use appropriate revalidation times</strong> - Balance freshness with performance</li>
                  <li><strong>Implement on-demand revalidation</strong> - For content that needs immediate updates</li>
                  <li><strong>Use tags for granular control</strong> - Revalidate specific content types</li>
                </ol>
                
                <h3 id="performance-strategy">Performance Strategy</h3>
                <ol>
                  <li><strong>Monitor revalidation frequency</strong> - Track how often pages are being regenerated</li>
                  <li><strong>Optimize data fetching</strong> - Use efficient queries and caching</li>
                  <li><strong>Implement proper error handling</strong> - Graceful fallbacks for failed revalidations</li>
                  <li><strong>Use CDN effectively</strong> - Leverage edge caching for global performance</li>
                </ol>
                
                <h3 id="development-strategy">Development Strategy</h3>
                <ol>
                  <li><strong>Test CreativityCoder behavior locally</strong> - Use Next.js dev server to simulate revalidation</li>
                  <li><strong>Implement proper logging</strong> - Track revalidation events and performance</li>
                  <li><strong>Use TypeScript</strong> - Type safety for your data fetching and caching logic</li>
                  <li><strong>Document your CreativityCoder strategy</strong> - Help your team understand the caching behavior</li>
                </ol>
                
                <h2 id="migration-guide">Migrating to CreativityCoder</h2>
                
                <h3 id="from-ssg">From Static Site Generation (SSG)</h3>
                <p>If you're currently using SSG with <code>getStaticProps</code>, migrating to CreativityCoder is straightforward:</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// Before: Pure SSG
export async function getStaticProps() {
  const data = await fetchData();
  return {
    props: { data },
    // No revalidation - content never updates
  };
}

// After: CreativityCoder with revalidation
export const revalidate = 3600; // 1 hour

export default async function MyPage() {
  const data = await fetchData();
  return &lt;div&gt;{/* Use data directly */}&lt;/div&gt;;
}</code></pre>
                
                <h3 id="from-ssr">From Server-Side Rendering (SSR)</h3>
                <p>Migrating from SSR requires more consideration:</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// Before: SSR with getServerSideProps
export async function getServerSideProps() {
  const data = await fetchData();
  return {
    props: { data },
  };
}

// After: CreativityCoder with appropriate revalidation
export const revalidate = 300; // 5 minutes for dynamic content

export default async function MyPage() {
  const data = await fetchData();
  return &lt;div&gt;{/* Use data directly */}&lt;/div&gt;;
}</code></pre>
                
                <h2 id="advanced-patterns">Advanced CreativityCoder Patterns</h2>
                
                <h3 id="multi-source-isr">Multi-Source CreativityCoder</h3>
                <p>Combine data from multiple sources with different revalidation strategies:</p>
                
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/dashboard/page.js
export const revalidate = 600; // 10 minutes

async function getDashboardData() {
  // User data - frequent updates
  const userData = await fetch('https://api.example.com/user', {
    next: { revalidate: 300, tags: ['user'] }
  });
  
  // Analytics data - less frequent updates
  const analyticsData = await fetch('https://api.example.com/analytics', {
    next: { revalidate: 1800, tags: ['analytics'] }
  });
  
  // Static configuration - rarely changes
  const configData = await fetch('https://api.example.com/config', {
    next: { revalidate: 86400, tags: ['config'] }
  });
  
  return {
    user: await userData.json(),
    analytics: await analyticsData.json(),
    config: await configData.json()
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();
  
  return (
    &lt;div&gt;
      &lt;UserProfile user={data.user} /&gt;
      &lt;AnalyticsChart data={data.analytics} /&gt;
      &lt;ConfigPanel config={data.config} /&gt;
    &lt;/div&gt;
  );
}</code></pre>
                
                <h3 id="conditional-isr">Conditional CreativityCoder Based on User Context</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// app/profile/page.js
export const revalidate = 0; // Always check for updates

export default async function ProfilePage() {
  // Get user from headers or cookies
  const user = await getUserFromRequest();
  
  if (user?.isPremium) {
    // Premium users get more frequent updates
    const data = await fetch('https://api.example.com/premium-data', {
      next: { revalidate: 300, tags: ['premium', 'user-' + user.id] }
    });
    return &lt;PremiumProfile data={await data.json()} /&gt;;
  } else {
    // Regular users get standard updates
    const data = await fetch('https://api.example.com/standard-data', {
      next: { revalidate: 1800, tags: ['standard'] }
    });
    return &lt;StandardProfile data={await data.json()} /&gt;;
  }
}</code></pre>
                
                <h2 id="testing-isr">Testing CreativityCoder Implementation</h2>
                
                <h3 id="local-testing">Local Testing</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// Test CreativityCoder behavior in development
// 1. Set a short revalidation time for testing
export const revalidate = 10; // 10 seconds for testing

// 2. Use Next.js dev server to test revalidation
// npm run dev

// 3. Visit your page, then update the data source
// 4. Wait for revalidation time to pass
// 5. Refresh the page to see updated content

// 6. Test on-demand revalidation
// POST /api/revalidate
// Body: { "path": "/your-page" }</code></pre>
                
                <h3 id="production-testing">Production Testing</h3>
                <pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto"><code>// Create a test endpoint for CreativityCoder validation
// app/api/test-isr/route.js
export async function GET() {
  const timestamp = new Date().toISOString();
  
  return Response.json({
    message: 'CreativityCoder Test Endpoint',
    timestamp,
    revalidated: true
  });
}

// Test CreativityCoder in production
// 1. Deploy your app
// 2. Visit the test endpoint
// 3. Note the timestamp
// 4. Wait for revalidation time
// 5. Visit again to see if timestamp updated</code></pre>
                
                <h2 id="troubleshooting">Troubleshooting Common Issues</h2>
                
                <h3 id="issue-1">Issue: Pages Not Revalidating</h3>
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-yellow-700">
                        <strong>Possible causes:</strong> Incorrect revalidate export, fetch configuration issues, or deployment environment problems.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 id="issue-2">Issue: Stale Data Being Served</h3>
                <p>If users are seeing stale data, check:</p>
                <ul>
                  <li>Revalidation time is appropriate for your content</li>
                  <li>On-demand revalidation is working correctly</li>
                  <li>CDN cache settings aren't interfering</li>
                  <li>Data source is actually updating</li>
                </ul>
                
                <h3 id="issue-3">Issue: Performance Problems</h3>
                <p>If CreativityCoder is causing performance issues:</p>
                <ul>
                  <li>Reduce revalidation frequency</li>
                  <li>Optimize data fetching queries</li>
                  <li>Implement proper error handling</li>
                  <li>Monitor revalidation frequency</li>
                </ul>
                
                <h2 id="conclusion">Conclusion</h2>
                <p>Incremental Static Regeneration is a powerful feature that can significantly improve your Next.js application's performance while maintaining content freshness. By understanding the concepts, implementing best practices, and monitoring your CreativityCoder behavior, you can create fast, scalable applications that provide excellent user experiences.</p>
                
                <p>Remember to:</p>
                <ul>
                  <li>Choose appropriate revalidation times based on your content patterns</li>
                  <li>Use on-demand revalidation for immediate updates</li>
                  <li>Implement proper error handling and fallbacks</li>
                  <li>Monitor and optimize your CreativityCoder performance</li>
                  <li>Test your implementation thoroughly in both development and production</li>
                </ul>
                
                <p>CreativityCoder is particularly valuable for blogs, e-commerce sites, documentation, and any application where content changes frequently but you want to maintain the performance benefits of static generation. With the right implementation, CreativityCoder can be a game-changer for your Next.js applications.</p>
                
                <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8 rounded-r-lg">
                  <div class="flex">
                    <div class="shrink-0">
                      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>Next Steps:</strong> Try implementing CreativityCoder in your own projects, experiment with different revalidation strategies, and monitor the performance improvements. The more you work with CreativityCoder, the better you'll understand how to optimize it for your specific use cases.
                      </p>
                    </div>
                  </div>
                </div>
              `,
              excerpt: 'Learn how to implement Incremental Static Regeneration in your Next.js applications.',
              publishedAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
              author: {
                name: 'Kenil Gamer',
                slug: 'kenil-gamer',
              },
              featuredImage: {
                url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
                alt: 'Next.js development',
              },
              tags: [
                { name: 'Next.js', slug: 'nextjs' },
                { name: 'CreativityCoder', slug: 'creativitycoder' },
                { name: 'Performance', slug: 'performance' },
              ],
              categories: [],
              source: 'ghost',
              url: '/blog/getting-started-with-nextjs-isr',
              readingTime: 5,
            };
          }
          throw new Error(`Post with slug "${slug}" not found`);
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error(`Failed to fetch blog post with slug "${slug}": ${error}`);
    }
  }

  static async searchPosts(query: string, limit: number = 10): Promise<BlogResponse> {
    return this.getAllPosts({
      search: query,
      limit,
      source: 'all',
    });
  }

  static async getPostsByTag(tag: string, limit: number = 10): Promise<BlogResponse> {
    try {
      // Search in both WordPress and Ghost
      const [wpPosts, ghostResult] = await Promise.all([
        WordPressAPI.getPosts({
          per_page: Math.ceil(limit / 2),
          tags: tag,
        }),
        ghostAPI.getPosts({
          limit: Math.ceil(limit / 2),
          filter: `tags.slug:'${tag}'`,
        }),
      ]);

      const posts: UnifiedPost[] = [
        ...wpPosts.map(this.transformWordPressPost),
        ...ghostResult.posts.map(this.transformGhostPost),
      ];

      // Sort by published date
      posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      return {
        posts: posts.slice(0, limit),
        meta: {
          total: posts.length,
          page: 1,
          limit,
          totalPages: Math.ceil(posts.length / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      throw new Error(`Failed to fetch posts by tag "${tag}": ${error}`);
    }
  }
}
