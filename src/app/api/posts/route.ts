import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';
import { config } from '@/config/env';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || undefined;
    const source = searchParams.get('source') as 'wordpress' | 'ghost' | 'all' || 'all';

    const result = await BlogService.getAllPosts({
      limit,
      page,
      search,
      source,
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, s-maxage=${config.isr.revalidateTime}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
