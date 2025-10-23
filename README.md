# CreativityCoder Platform

A corporate-ready, enterprise-grade blog platform built with Next.js 16, featuring Incremental Static Regeneration (CreativityCoder) and multi-source content integration from WordPress and Ghost. Designed for scalability, security, and performance in production environments.

## 🏢 Enterprise Features

- **🔒 Security First** - Comprehensive security headers, rate limiting, and input validation
- **📊 Monitoring & Observability** - Built-in health checks, logging, and performance metrics
- **🚀 Performance Optimized** - CreativityCoder with intelligent caching and CDN support
- **🔧 DevOps Ready** - Docker, CI/CD, and infrastructure as code
- **📈 Scalable Architecture** - Microservices-ready with horizontal scaling support
- **🛡️ Corporate Compliance** - Audit trails, error tracking, and compliance features
- **🌐 Multi-Source Integration** - Seamlessly combine WordPress and Ghost content
- **🔍 Advanced Search** - Real-time search with filtering and suggestions
- **📱 Responsive Design** - Mobile-first, accessible UI with Tailwind CSS
- **🔧 Type Safety** - Full TypeScript support for robust development
- **🔌 REST API** - Complete API with comprehensive documentation
- **⚡ Real-time Updates** - WebSocket support for live content updates

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Content Sources**: WordPress REST API, Ghost Content API
- **Security**: Custom middleware, rate limiting, security headers
- **Monitoring**: Health checks, structured logging, error tracking
- **Testing**: Jest, React Testing Library, E2E testing
- **DevOps**: Docker, GitHub Actions, infrastructure as code
- **Deployment**: Vercel, AWS, Azure, on-premises

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Git

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/creativitycoder.git
   cd creativitycoder
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

For production deployment, see our comprehensive [Corporate Deployment Guide](./CORPORATE_DEPLOYMENT.md).

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Security
npm run security:audit # Security audit
npm run security:fix   # Fix security issues

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
npm run health       # Check application health
```

### Environment Variables

See [env.example](./env.example) for all available environment variables.

### Code Quality Standards

- **ESLint**: Comprehensive linting with security rules
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **Jest**: Unit and integration testing

## 🔧 Configuration

### WordPress Setup

1. **Enable REST API** - Ensure your WordPress site has the REST API enabled
2. **Create Application Password** - Generate an application password in WordPress admin
3. **Update Environment Variables** - Add your WordPress URL and credentials

### Ghost Setup

1. **Enable Content API** - Ensure your Ghost site has the Content API enabled
2. **Generate API Key** - Create a Content API key in Ghost admin
3. **Update Environment Variables** - Add your Ghost URL and API key

### CreativityCoder Configuration

- **Revalidation Time**: Set `ISR_REVALIDATE_TIME` (in seconds) to control how often content is regenerated
- **Default**: 3600 seconds (1 hour)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── posts/        # Blog posts API
│   │   └── search/       # Search API
│   ├── blog/             # Blog pages
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── BlogCard.tsx      # Individual blog post card
│   ├── BlogList.tsx      # Blog posts listing
│   ├── Pagination.tsx    # Pagination component
│   └── SearchBar.tsx     # Search functionality
├── lib/                  # Utility libraries
│   ├── blog-service.ts  # Unified blog service
│   ├── ghost.ts         # Ghost API client
│   └── wordpress.ts     # WordPress API client
├── types/               # TypeScript type definitions
│   ├── blog.ts          # Unified blog types
│   ├── ghost.ts         # Ghost API types
│   └── wordpress.ts     # WordPress API types
└── config/              # Configuration
    └── env.ts           # Environment configuration
```

## 🔌 API Endpoints

### Blog Posts

- `GET /api/posts` - Get all blog posts
  - Query parameters: `limit`, `page`, `search`, `source`
- `GET /api/posts/[slug]` - Get specific blog post
  - Query parameters: `source`

### Search

- `GET /api/search` - Search blog posts
  - Query parameters: `q` (search query), `limit`

### Example API Usage

```javascript
// Get all posts
const response = await fetch("/api/posts?limit=10&page=1");
const data = await response.json();

// Search posts
const searchResponse = await fetch("/api/search?q=javascript&limit=5");
const searchData = await searchResponse.json();

// Get specific post
const postResponse = await fetch("/api/posts/my-blog-post");
const post = await postResponse.json();
```

## 🎨 Customization

### Styling

- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration for custom design system
- Components use Tailwind classes for easy customization

### Content Sources

- Add new content sources by extending the `BlogService` class
- Implement new API clients following the existing pattern
- Update type definitions in the `types/` directory

### CreativityCoder Behavior

- Adjust revalidation times in environment variables
- Implement custom revalidation logic in API routes
- Use `revalidateTag` for more granular control

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔍 Performance Features

- **Static Generation** - Pages are pre-rendered at build time
- **CreativityCoder** - Content updates automatically without full rebuilds
- **Image Optimization** - Next.js Image component with automatic optimization
- **Code Splitting** - Automatic code splitting for optimal loading
- **Caching** - Intelligent caching with stale-while-revalidate

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run setup    # Interactive environment setup
```

### Adding New Features

1. **New Content Sources**: Extend `BlogService` and create new API clients
2. **New Components**: Add to `src/components/` directory
3. **New Pages**: Add to `src/app/` directory following App Router conventions
4. **API Routes**: Add to `src/app/api/` directory

## 📝 Content Management

### WordPress

- Use WordPress admin to create and manage posts
- Posts automatically appear in the blog after revalidation
- Supports all WordPress post features (categories, tags, featured images)

### Ghost

- Use Ghost admin to create and manage posts
- Posts automatically appear in the blog after revalidation
- Supports all Ghost post features (tags, authors, featured images)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference
- **[Corporate Deployment Guide](./CORPORATE_DEPLOYMENT.md)** - Production deployment
- **[Configuration Guide](./CONFIGURATION.md)** - Detailed configuration options
- **[Environment Setup](./ENVIRONMENT_SETUP.md)** - Environment configuration
- **[Blog Editor Setup](./BLOG_EDITOR_SETUP.md)** - Content management setup

## 🔒 Security

This platform implements enterprise-grade security features:

- **Security Headers**: Comprehensive security headers including CSP, HSTS, and XSS protection
- **Rate Limiting**: Configurable rate limiting to prevent abuse
- **Input Validation**: Strict input validation and sanitization
- **Dependency Auditing**: Regular security audits of dependencies
- **Error Handling**: Secure error handling without information leakage
- **CORS Protection**: Configurable CORS policies
- **Authentication Ready**: Prepared for authentication integration

## 📊 Monitoring & Observability

Built-in monitoring and observability features:

- **Health Checks**: Comprehensive health monitoring at `/api/health`
- **Structured Logging**: JSON-formatted logs with configurable levels
- **Performance Metrics**: Built-in performance monitoring
- **Error Tracking**: Integration-ready error tracking
- **Real-time Monitoring**: WebSocket-based real-time updates

## 🚀 Performance

Optimized for enterprise performance:

- **CreativityCoder (Incremental Static Regeneration)**: Automatic content updates
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Code Splitting**: Automatic code splitting for optimal loading
- **Caching**: Intelligent caching with stale-while-revalidate
- **CDN Ready**: Optimized for CDN deployment
- **Bundle Analysis**: Built-in bundle size analysis

## 🏗️ Architecture

The platform is built with scalability in mind:

- **Microservices Ready**: Modular architecture for easy scaling
- **Container Ready**: Docker support with multi-stage builds
- **Cloud Native**: Optimized for cloud deployment
- **API First**: Complete REST API for integrations
- **Real-time**: WebSocket support for live updates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run quality checks: `npm run precommit`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

### Corporate Support

- **Technical Support**: support@your-company.com
- **Documentation**: https://docs.your-company.com
- **Emergency Contact**: +1-XXX-XXX-XXXX
- **Status Page**: https://status.your-company.com

### Community Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/your-org/creativitycoder/issues)
- **Discussions**: [Community discussions](https://github.com/your-org/creativitycoder/discussions)
- **Discord**: [Join our community](https://discord.gg/your-invite)

## 🔄 Updates

The platform automatically updates content from both WordPress and Ghost sources using CreativityCoder. Content is revalidated based on the configured time interval, ensuring your blog is always up-to-date while maintaining optimal performance.

## 🏆 Enterprise Features

- **SLA Support**: 99.9% uptime guarantee
- **24/7 Monitoring**: Continuous monitoring and alerting
- **Custom Integrations**: Tailored integrations for your needs
- **Training & Support**: Comprehensive training and support
- **Compliance**: SOC 2, GDPR, and other compliance standards
