#!/usr/bin/env node

// Simple test script for the chat API
import http from 'http';

const payload = JSON.stringify({
  message: "Tell me about your projects",
  conversation: []
});

console.log('📤 Sending request to /api/chat');
console.log('📝 Payload:', payload);
console.log('');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  console.log(`📨 Status Code: ${res.statusCode}`);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  console.log('');
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📦 Response Body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(data);
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});

// Send request
req.write(payload);
req.end();
