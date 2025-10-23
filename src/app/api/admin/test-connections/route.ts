import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';
import { ghostAPI } from '@/lib/ghost';
import { WordPressAPI } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      wordpress: {
        connected: false,
        error: null as string | null,
        siteInfo: null as any,
      },
      ghost: {
        connected: false,
        error: null as string | null,
        siteInfo: null as any,
      },
    };

    // Test WordPress connection
    try {
      const wpPosts = await BlogService.getAllPosts({ 
        source: 'wordpress', 
        limit: 1 
      });
      
      results.wordpress = {
        connected: true,
        error: null,
        siteInfo: {
          postsCount: wpPosts.meta.total,
          apiUrl: process.env.WORDPRESS_API_URL || 'Not configured',
        },
      };
    } catch (error) {
      results.wordpress = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        siteInfo: null,
      };
    }

    // Test Ghost connection
    try {
      const ghostPosts = await BlogService.getAllPosts({ 
        source: 'ghost', 
        limit: 1 
      });
      
      results.ghost = {
        connected: true,
        error: null,
        siteInfo: {
          postsCount: ghostPosts.meta.total,
          apiUrl: process.env.GHOST_API_URL || 'Not configured',
        },
      };
    } catch (error) {
      results.ghost = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        siteInfo: null,
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to test connections',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, platform, credentials } = await request.json();

    if (action === 'test-credentials') {
      if (platform === 'wordpress') {
        const { apiUrl, username, password } = credentials;
        
        // Temporarily override config for testing
        const originalConfig = {
          apiUrl: process.env.WORDPRESS_API_URL,
          username: process.env.WORDPRESS_USERNAME,
          password: process.env.WORDPRESS_PASSWORD,
        };

        // Test with provided credentials
        try {
          const testUrl = `${apiUrl}/posts?per_page=1`;
          const credentials = btoa(`${username}:${password}`);
          
          const response = await fetch(testUrl, {
            headers: {
              'Authorization': `Basic ${credentials}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const posts = await response.json();
          
          return NextResponse.json({
            success: true,
            message: 'WordPress credentials are valid',
            data: {
              postsCount: posts.length,
              apiUrl,
            },
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: 'WordPress credentials are invalid',
            error: error instanceof Error ? error.message : 'Unknown error',
          }, { status: 400 });
        }
      }

      if (platform === 'ghost') {
        const { apiUrl, contentApiKey } = credentials;
        
        try {
          const testUrl = `${apiUrl}/ghost/api/content/posts/?key=${contentApiKey}&limit=1`;
          
          const response = await fetch(testUrl);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          
          return NextResponse.json({
            success: true,
            message: 'Ghost credentials are valid',
            data: {
              postsCount: data.posts?.length || 0,
              apiUrl,
            },
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: 'Ghost credentials are invalid',
            error: error instanceof Error ? error.message : 'Unknown error',
          }, { status: 400 });
        }
      }
    }

    return NextResponse.json(
      { error: 'Invalid action or platform' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
