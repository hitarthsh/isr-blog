import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '60');

// Security headers middleware
function addSecurityHeaders(response: NextResponse) {
  // Remove X-Powered-By header
  response.headers.delete('X-Powered-By');
  
  // Add additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  return response;
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }
  
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  current.count++;
  return true;
}

// Clean up expired rate limit entries
function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// CORS configuration
function handleCORS(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Clean up rate limit store periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupRateLimit();
  }
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return addSecurityHeaders(handleCORS(request, response));
  }
  
  // Skip rate limiting for static assets and health checks
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml')
  ) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60 
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
  }
  
  // Block suspicious requests
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
  ];
  
  // Allow legitimate bots (Google, Bing, etc.)
  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
  ];
  
  const isAllowedBot = allowedBots.some(pattern => pattern.test(userAgent));
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent)) && !isAllowedBot;
  
  if (isSuspicious && pathname.startsWith('/api/')) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Forbidden',
        message: 'Access denied for automated requests.',
      }),
      { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  // Continue with the request
  const response = NextResponse.next();
  
  // Add security headers
  const securedResponse = addSecurityHeaders(response);
  
  // Handle CORS for API routes
  if (pathname.startsWith('/api/')) {
    return handleCORS(request, securedResponse);
  }
  
  return securedResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
