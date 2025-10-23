import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';
import { config } from '@/config/env';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const result = await BlogService.searchPosts(query, limit);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, s-maxage=${config.isr.revalidateTime}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}
