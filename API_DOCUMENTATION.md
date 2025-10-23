# CreativityCoder Platform - API Documentation

## Overview

The CreativityCoder Platform provides a comprehensive REST API for accessing blog content from multiple sources (WordPress and Ghost) with advanced features like search, pagination, and real-time updates.

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication

Currently, the API is read-only and doesn't require authentication. For admin operations, implement authentication as needed.

## Rate Limiting

- **Limit**: 60 requests per minute per IP (configurable)
- **Headers**:
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

## Response Format

All API responses follow a consistent format:

```json
{
  "data": {}, // Response data
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "req_123456789"
}
```

## Endpoints

### Health Check

#### GET /api/health

Check the health status of the application and connected services.

**Query Parameters:**

- `detailed` (boolean): Include detailed service status

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "services": {
    "wordpress": "connected",
    "ghost": "connected",
    "database": "connected"
  },
  "performance": {
    "memory": {
      "used": 128,
      "total": 512,
      "percentage": 25
    },
    "uptime": 3600
  },
  "responseTime": "45ms"
}
```

### Blog Posts

#### GET /api/posts

Retrieve a list of blog posts from all configured sources.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Posts per page (default: 10, max: 100)
- `search` (string): Search query
- `source` (string): Filter by source (`wordpress` or `ghost`)
- `category` (string): Filter by category
- `tag` (string): Filter by tag
- `author` (string): Filter by author
- `sort` (string): Sort order (`newest`, `oldest`, `popular`)
- `published_after` (string): ISO date string
- `published_before` (string): ISO date string

**Response:**

```json
{
  "data": [
    {
      "id": "wp-123",
      "title": "Sample Blog Post",
      "slug": "sample-blog-post",
      "excerpt": "This is a sample blog post excerpt...",
      "content": "<p>Full blog post content...</p>",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "name": "John Doe",
        "slug": "john-doe",
        "avatar": "https://example.com/avatar.jpg",
        "bio": "Author bio"
      },
      "featuredImage": {
        "url": "https://example.com/image.jpg",
        "alt": "Image description"
      },
      "tags": [
        {
          "name": "Technology",
          "slug": "technology"
        }
      ],
      "categories": [
        {
          "name": "Web Development",
          "slug": "web-development"
        }
      ],
      "source": "wordpress",
      "url": "https://example.com/post/sample-blog-post",
      "readingTime": 5,
      "wordCount": 500
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/posts/[slug]

Retrieve a specific blog post by slug.

**Path Parameters:**

- `slug` (string): Post slug

**Query Parameters:**

- `source` (string): Specify source (`wordpress` or `ghost`)

**Response:**

```json
{
  "data": {
    "id": "wp-123",
    "title": "Sample Blog Post",
    "slug": "sample-blog-post",
    "excerpt": "This is a sample blog post excerpt...",
    "content": "<p>Full blog post content...</p>",
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "name": "John Doe",
      "slug": "john-doe",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Author bio"
    },
    "featuredImage": {
      "url": "https://example.com/image.jpg",
      "alt": "Image description"
    },
    "tags": [
      {
        "name": "Technology",
        "slug": "technology"
      }
    ],
    "categories": [
      {
        "name": "Web Development",
        "slug": "web-development"
      }
    ],
    "source": "wordpress",
    "url": "https://example.com/post/sample-blog-post",
    "readingTime": 5,
    "wordCount": 500,
    "relatedPosts": [
      {
        "id": "wp-124",
        "title": "Related Post",
        "slug": "related-post",
        "excerpt": "Related post excerpt..."
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Search

#### GET /api/search

Search across all blog posts.

**Query Parameters:**

- `q` (string): Search query (required)
- `limit` (number): Results per page (default: 10, max: 100)
- `page` (number): Page number (default: 1)
- `source` (string): Filter by source
- `category` (string): Filter by category
- `tag` (string): Filter by tag
- `author` (string): Filter by author
- `published_after` (string): ISO date string
- `published_before` (string): ISO date string

**Response:**

```json
{
  "data": [
    {
      "id": "wp-123",
      "title": "Sample Blog Post",
      "slug": "sample-blog-post",
      "excerpt": "This is a sample blog post excerpt...",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "name": "John Doe",
        "slug": "john-doe"
      },
      "source": "wordpress",
      "url": "https://example.com/post/sample-blog-post",
      "relevanceScore": 0.95,
      "highlightedContent": "This is a <mark>sample</mark> blog post excerpt..."
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "query": "sample",
    "searchTime": "45ms"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Categories

#### GET /api/categories

Retrieve all categories from all sources.

**Query Parameters:**

- `source` (string): Filter by source
- `limit` (number): Results per page (default: 50)

**Response:**

```json
{
  "data": [
    {
      "id": "cat-1",
      "name": "Web Development",
      "slug": "web-development",
      "description": "Posts about web development",
      "postCount": 25,
      "source": "wordpress"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Tags

#### GET /api/tags

Retrieve all tags from all sources.

**Query Parameters:**

- `source` (string): Filter by source
- `limit` (number): Results per page (default: 50)

**Response:**

```json
{
  "data": [
    {
      "id": "tag-1",
      "name": "JavaScript",
      "slug": "javascript",
      "postCount": 15,
      "source": "wordpress"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Authors

#### GET /api/authors

Retrieve all authors from all sources.

**Query Parameters:**

- `source` (string): Filter by source
- `limit` (number): Results per page (default: 50)

**Response:**

```json
{
  "data": [
    {
      "id": "author-1",
      "name": "John Doe",
      "slug": "john-doe",
      "bio": "Author bio",
      "avatar": "https://example.com/avatar.jpg",
      "postCount": 10,
      "source": "wordpress"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Revalidation

#### POST /api/revalidate

Trigger revalidation of cached content.

**Headers:**

- `Authorization`: Bearer token (if authentication is implemented)

**Body:**

```json
{
  "tags": ["posts", "categories", "tags"],
  "paths": ["/blog", "/api/posts"]
}
```

**Response:**

```json
{
  "message": "Revalidation triggered successfully",
  "revalidated": {
    "tags": ["posts", "categories", "tags"],
    "paths": ["/blog", "/api/posts"]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## WebSocket API

### Connection

Connect to WebSocket for real-time updates:

```javascript
const ws = new WebSocket("wss://your-domain.com/api/websocket");

ws.onopen = () => {
  console.log("Connected to WebSocket");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
};
```

### Message Types

#### Content Updates

```json
{
  "type": "content_update",
  "data": {
    "source": "wordpress",
    "action": "post_created",
    "post": {
      "id": "wp-123",
      "title": "New Post",
      "slug": "new-post"
    }
  }
}
```

#### System Status

```json
{
  "type": "system_status",
  "data": {
    "status": "healthy",
    "services": {
      "wordpress": "connected",
      "ghost": "connected"
    }
  }
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
class CreativityCoderClient {
  constructor(private baseUrl: string) {}

  async getPosts(params: {
    page?: number;
    limit?: number;
    search?: string;
    source?: string;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/api/posts?${searchParams}`);
    return response.json();
  }

  async getPost(slug: string, source?: string) {
    const searchParams = source ? `?source=${source}` : "";
    const response = await fetch(
      `${this.baseUrl}/api/posts/${slug}${searchParams}`
    );
    return response.json();
  }

  async search(
    query: string,
    params: {
      limit?: number;
      page?: number;
      source?: string;
    } = {}
  ) {
    const searchParams = new URLSearchParams({ q: query });
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/api/search?${searchParams}`);
    return response.json();
  }
}

// Usage
const client = new CreativityCoderClient("https://your-domain.com");
const posts = await client.getPosts({ page: 1, limit: 10 });
```

### Python

```python
import requests
from typing import Optional, Dict, Any

class CreativityCoderClient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    def get_posts(self, page: int = 1, limit: int = 10,
                  search: Optional[str] = None,
                  source: Optional[str] = None) -> Dict[str, Any]:
        params = {'page': page, 'limit': limit}
        if search:
            params['search'] = search
        if source:
            params['source'] = source

        response = requests.get(f"{self.base_url}/api/posts", params=params)
        response.raise_for_status()
        return response.json()

    def get_post(self, slug: str, source: Optional[str] = None) -> Dict[str, Any]:
        params = {'source': source} if source else {}
        response = requests.get(f"{self.base_url}/api/posts/{slug}", params=params)
        response.raise_for_status()
        return response.json()

    def search(self, query: str, limit: int = 10,
               page: int = 1, source: Optional[str] = None) -> Dict[str, Any]:
        params = {'q': query, 'limit': limit, 'page': page}
        if source:
            params['source'] = source

        response = requests.get(f"{self.base_url}/api/search", params=params)
        response.raise_for_status()
        return response.json()

# Usage
client = CreativityCoderClient('https://your-domain.com')
posts = client.get_posts(page=1, limit=10)
```

## Error Codes

| Code                     | HTTP Status | Description                  |
| ------------------------ | ----------- | ---------------------------- |
| `VALIDATION_ERROR`       | 400         | Invalid request parameters   |
| `AUTHENTICATION_ERROR`   | 401         | Authentication required      |
| `AUTHORIZATION_ERROR`    | 403         | Insufficient permissions     |
| `NOT_FOUND_ERROR`        | 404         | Resource not found           |
| `CONFLICT_ERROR`         | 409         | Resource conflict            |
| `RATE_LIMIT_ERROR`       | 429         | Rate limit exceeded          |
| `EXTERNAL_SERVICE_ERROR` | 502         | External service unavailable |
| `INTERNAL_SERVER_ERROR`  | 500         | Internal server error        |

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Default Limit**: 60 requests per minute per IP
- **Headers**: Rate limit information is included in response headers
- **Exceeded**: Returns 429 status with retry information

## Caching

The API uses CreativityCoder (Incremental Static Regeneration) for optimal performance:

- **Static Generation**: Content is pre-generated at build time
- **Revalidation**: Content is updated based on configured intervals
- **Cache Headers**: Appropriate cache headers are set for different content types

## Webhooks

Webhooks can be configured to receive real-time notifications:

```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["post.created", "post.updated", "post.deleted"],
  "secret": "webhook-secret"
}
```

## Support

For API support and questions:

- **Documentation**: https://docs.your-domain.com/api
- **Support**: api-support@your-domain.com
- **Status Page**: https://status.your-domain.com
