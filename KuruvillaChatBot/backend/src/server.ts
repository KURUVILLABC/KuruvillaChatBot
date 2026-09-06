/**
 * Main Fastify server
 */

import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config, validateConfig } from './config.js';
import { createHealthRoutes } from './routes/health.js';
import { createChatRoutes } from './routes/chat.js';
import { createSyncRoutes } from './routes/sync.js';
import { MockAIProvider, OpenAIProvider, GroqProvider, GeminiProvider } from './providers/ai.js';
import { MockGitHubProvider, RealGitHubProvider } from './providers/github.js';
import { MockLinkedInProvider, RealLinkedInProvider } from './providers/linkedin.js';

async function startServer(): Promise<void> {
  try {
    // Validate configuration
    validateConfig();

    // Create Fastify instance
    const app = Fastify({
      logger: {
        level: process.env.LOG_LEVEL ?? 'info',
      },
    });

    // Register security middleware
    await app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    });

    // Register CORS
    await app.register(cors, {
      origin: [
        config.frontendUrl,
        'https://kuruvilla-chat.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
      ],
      credentials: true,
    });

    // Register rate limiting
    await app.register(rateLimit, {
      max: 100,
      timeWindow: '15 minutes',
      allowList: ['/api/health'],
    });

    // Initialize providers
    const githubProvider = config.github.useMock
      ? new MockGitHubProvider()
      : new RealGitHubProvider(config.profileGitHubUsername);
    const linkedinProvider = config.linkedin.useMock 
      ? new MockLinkedInProvider()
      : new RealLinkedInProvider();
    const aiProvider = config.ai.provider === 'openai' 
      ? new OpenAIProvider(config.ai.apiKey || '')
      : config.ai.provider === 'groq'
      ? new GroqProvider(config.ai.groqApiKey || '')
      : config.ai.provider === 'gemini'
      ? new GeminiProvider(config.ai.geminiApiKey || '')
      : new MockAIProvider();

    // Register routes
    await createHealthRoutes(app);
    await createChatRoutes(app, aiProvider);
    await createSyncRoutes(app, githubProvider, linkedinProvider, aiProvider);

    // Start server
    const address = await app.listen({ port: config.port, host: config.host });
    console.log(`🚀 Server listening on ${address}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`👤 Profile: ${config.profileDisplayName}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
