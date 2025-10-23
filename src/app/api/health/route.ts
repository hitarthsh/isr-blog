import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/config/env';

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: {
    wordpress: 'connected' | 'disconnected' | 'not_configured';
    ghost: 'connected' | 'disconnected' | 'not_configured';
    database: 'connected' | 'disconnected';
  };
  performance: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    uptime: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Check if this is a detailed health check
    const url = new URL(request.url);
    const detailed = url.searchParams.get('detailed') === 'true';
    
    const healthData: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: {
        wordpress: 'not_configured',
        ghost: 'not_configured',
        database: 'connected', // Next.js doesn't use a traditional database
      },
      performance: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100),
        },
        uptime: process.uptime(),
      },
    };

    // Test WordPress connection if configured
    if (config.wordpress.apiUrl && config.wordpress.username && config.wordpress.password) {
      try {
        const wpResponse = await fetch(`${config.wordpress.apiUrl}/posts?per_page=1`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${config.wordpress.username}:${config.wordpress.password}`).toString('base64')}`,
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        
        if (wpResponse.ok) {
          healthData.services.wordpress = 'connected';
        } else {
          healthData.services.wordpress = 'disconnected';
          healthData.status = 'unhealthy';
        }
      } catch (error) {
        healthData.services.wordpress = 'disconnected';
        healthData.status = 'unhealthy';
      }
    }

    // Test Ghost connection if configured
    if (config.ghost.apiUrl && config.ghost.contentApiKey) {
      try {
        const ghostResponse = await fetch(`${config.ghost.apiUrl}/ghost/api/v3/content/posts/?key=${config.ghost.contentApiKey}&limit=1`, {
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        
        if (ghostResponse.ok) {
          healthData.services.ghost = 'connected';
        } else {
          healthData.services.ghost = 'disconnected';
          healthData.status = 'unhealthy';
        }
      } catch (error) {
        healthData.services.ghost = 'disconnected';
        healthData.status = 'unhealthy';
      }
    }

    const responseTime = Date.now() - startTime;
    
    // Add response time to the health data
    const response = NextResponse.json({
      ...healthData,
      responseTime: `${responseTime}ms`,
    });

    // Set appropriate cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
