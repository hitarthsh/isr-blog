import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';
import { config } from '@/config/env';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') as 'wordpress' | 'ghost' | undefined;

    const post = await BlogService.getPost(slug, source);

    return NextResponse.json(post, {
      headers: {
        'Cache-Control': `public, s-maxage=${config.isr.revalidateTime}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }
}
