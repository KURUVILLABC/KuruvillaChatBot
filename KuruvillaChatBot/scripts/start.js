#!/usr/bin/env node

/**
 * Start wrapper script for Render.com deployment
 * Uses Node.js to change directory and run start process
 * This avoids relying on shell 'cd' command which doesn't work in Render's build environment
 */

import { execSync } from 'child_process';
import { chdir } from 'process';

try {
  console.log('Starting application...');
  chdir('backend');
  console.log('Changed to backend directory');
  
  // Run Node.js server
  execSync('npm start', { stdio: 'inherit' });
  
  process.exit(0);
} catch (error) {
  console.error('Start failed:', error.message);
  process.exit(1);
}
