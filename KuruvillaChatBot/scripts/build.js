#!/usr/bin/env node

/**
 * Build wrapper script for Render.com deployment
 * Uses Node.js to change directory and run build process
 * This avoids relying on shell 'cd' command which doesn't work in Render's build environment
 */

import { execSync } from 'child_process';
import { chdir } from 'process';

try {
  console.log('Starting build process...');
  chdir('backend');
  console.log('Changed to backend directory');
  
  // Run TypeScript compiler
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
  
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
