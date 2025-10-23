import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Verify the secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    const results = [];

    // Revalidate specific path
    if (path) {
      revalidatePath(path);
      results.push(`Revalidated path: ${path}`);
    }

    // Revalidate specific tag
    if (tag) {
      revalidateTag(tag, 'force-cache');
      results.push(`Revalidated tag: ${tag}`);
    }

    // If no specific path or tag, revalidate common paths
    if (!path && !tag) {
      revalidatePath('/blog');
      revalidatePath('/');
      revalidateTag('posts', 'force-cache');
      revalidateTag('blog', 'force-cache');
      results.push('Revalidated common paths and tags');
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to revalidate',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing revalidation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const tag = searchParams.get('tag');

  if (!path && !tag) {
    return NextResponse.json(
      { error: 'Path or tag parameter is required' },
      { status: 400 }
    );
  }

  try {
    const results = [];

    if (path) {
      revalidatePath(path);
      results.push(`Revalidated path: ${path}`);
    }

    if (tag) {
      revalidateTag(tag, 'force-cache');
      results.push(`Revalidated tag: ${tag}`);
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to revalidate',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
