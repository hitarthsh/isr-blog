import { GET } from '@/app/api/health/route';
import { NextRequest } from 'next/server';

// Mock the config module
jest.mock('@/config/env', () => ({
  config: {
    wordpress: {
      apiUrl: 'https://test-wordpress.com/wp-json/wp/v2',
      username: 'testuser',
      password: 'testpass',
    },
    ghost: {
      apiUrl: 'https://test-ghost.com',
      contentApiKey: 'test-key',
    },
  },
}));

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return healthy status with basic information', async () => {
    // Mock successful external service calls
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
    expect(data.environment).toBe('test');
    expect(data.uptime).toBeGreaterThan(0);
    expect(data.services).toBeDefined();
    expect(data.performance).toBeDefined();
    expect(data.responseTime).toBeDefined();
  });

  it('should return unhealthy status when external services fail', async () => {
    // Mock failed external service calls
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('unhealthy');
    expect(data.services.wordpress).toBe('disconnected');
    expect(data.services.ghost).toBe('disconnected');
  });

  it('should handle network errors gracefully', async () => {
    // Mock network errors
    global.fetch = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('unhealthy');
    expect(data.services.wordpress).toBe('disconnected');
    expect(data.services.ghost).toBe('disconnected');
  });

  it('should return not_configured for services without credentials', async () => {
    // Temporarily replace the config module to test not_configured state
    const originalConfig = require('@/config/env').config;
    jest.resetModules();
    jest.doMock('@/config/env', () => ({
      config: {
        wordpress: {
          apiUrl: '',
          username: '',
          password: '',
        },
        ghost: {
          apiUrl: '',
          contentApiKey: '',
        },
      },
    }));

    // Re-import the route handler with the new mock
    const { GET: GETWithEmptyConfig } = require('@/app/api/health/route');
    
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GETWithEmptyConfig(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.services.wordpress).toBe('not_configured');
    expect(data.services.ghost).toBe('not_configured');
    
    // Restore original mock
    jest.resetModules();
    jest.doMock('@/config/env', () => ({
      config: originalConfig,
    }));
  });

  it('should include performance metrics', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, status: 200 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(data.performance).toBeDefined();
    expect(data.performance.memory).toBeDefined();
    expect(data.performance.memory.used).toBeGreaterThan(0);
    expect(data.performance.memory.total).toBeGreaterThan(0);
    expect(data.performance.memory.percentage).toBeGreaterThan(0);
    expect(data.performance.uptime).toBeGreaterThan(0);
  });

  it('should set appropriate cache headers', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, status: 200 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);

    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
    expect(response.headers.get('Pragma')).toBe('no-cache');
    expect(response.headers.get('Expires')).toBe('0');
  });
});
