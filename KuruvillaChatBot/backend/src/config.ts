/**
 * Application configuration
 * Loaded from environment variables
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// From backend/src/config.ts, go up 2 levels to project root
dotenv.config({ path: join(__dirname, '../../.env') });

interface AppConfig {
  nodeEnv: 'development' | 'staging' | 'production';
  port: number;
  host: string;
  frontendUrl: string;
  
  // Profile configuration
  profileDisplayName: string;
  profileGitHubUsername: string;
  profileLinkedInUrl?: string;
  
  // Provider configuration
  github: {
    token?: string;
    useMock: boolean;
  };
  
  linkedin: {
    clientId?: string;
    clientSecret?: string;
    useMock: boolean;
  };
  
  ai: {
    provider: 'openai' | 'anthropic' | 'groq' | 'gemini' | 'mock';
    apiKey?: string;
    groqApiKey?: string;
    geminiApiKey?: string;
  };
  
  // Feature flags
  features: {
    enableSync: boolean;
    enableAdmin: boolean;
  };
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Required environment variable ${key} is missing`);
  }
  return value;
}

function getEnvOptional(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ?? defaultValue;
}

function getEnvInt(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid integer for environment variable ${key}: ${value}`);
  }
  return parsed;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  const lowerValue = value.toLowerCase();
  if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') return false;
  return lowerValue === 'true' || value === '1';
}

export const config: AppConfig = {
  nodeEnv: (process.env.NODE_ENV as any) ?? 'development',
  port: getEnvInt('PORT', 3000),
  host: getEnvOptional('HOST') ?? '0.0.0.0',
  frontendUrl: getEnvOptional('FRONTEND_URL') ?? 'http://localhost:5173',
  
  profileDisplayName: getEnv('PROFILE_DISPLAY_NAME', 'Kuruvilla'),
  profileGitHubUsername: getEnv('PROFILE_GITHUB_USERNAME', 'kuruvillaChatBot'),
  profileLinkedInUrl: getEnvOptional('PROFILE_LINKEDIN_URL'),
  
  github: {
    token: getEnvOptional('GITHUB_TOKEN'),
    useMock: getEnvBoolean('GITHUB_MOCK', true),
  },
  
  linkedin: {
    clientId: getEnvOptional('LINKEDIN_CLIENT_ID'),
    clientSecret: getEnvOptional('LINKEDIN_CLIENT_SECRET'),
    useMock: getEnvBoolean('LINKEDIN_MOCK', true),
  },
  
  ai: {
    provider: (process.env.AI_PROVIDER as any) ?? 'mock',
    apiKey: getEnvOptional('OPENAI_API_KEY'),
    groqApiKey: getEnvOptional('GROQ_API_KEY'),
    geminiApiKey: getEnvOptional('GEMINI_API_KEY'),
  },
  
  features: {
    enableSync: getEnvBoolean('ENABLE_SYNC', true),
    enableAdmin: getEnvBoolean('ENABLE_ADMIN', true),
  },
};

export function validateConfig(): void {
  // Validate required fields
  if (!config.profileDisplayName) {
    throw new Error('PROFILE_DISPLAY_NAME must be set');
  }
  
  if (!config.profileGitHubUsername) {
    throw new Error('PROFILE_GITHUB_USERNAME must be set');
  }
  
  // Warn about mock mode
  if (config.github.useMock) {
    console.warn('[CONFIG] GitHub running in MOCK mode');
  }
  
  if (config.linkedin.useMock) {
    console.warn('[CONFIG] LinkedIn running in MOCK mode');
  }
  
  if (config.ai.provider === 'mock') {
    console.warn('[CONFIG] AI running in MOCK mode');
  }
}
