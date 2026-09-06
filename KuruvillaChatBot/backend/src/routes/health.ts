/**
 * Health check routes
 */

import type { FastifyInstance } from 'fastify';

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  uptime: number;
}

export async function createHealthRoutes(app: FastifyInstance): Promise<void> {
  // Health check endpoint
  app.get<{ Reply: HealthResponse }>('/api/health', async (_request, _reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
    };
  });
  
  // Simple root endpoint
  app.get('/', async (_request, _reply) => {
    return {
      message: 'Profile AI Knowledge System API',
      status: 'running',
    };
  });
}
