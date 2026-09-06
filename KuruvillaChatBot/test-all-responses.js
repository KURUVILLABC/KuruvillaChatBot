#!/usr/bin/env node

import http from 'http';

const questions = [
  "What projects have you built?",
  "What are your technical skills?",
  "Tell me about your work experience",
  "Tell me about your GitHub profile",
  "Hello!"
];

const labels = [
  "PROJECTS",
  "SKILLS",
  "EXPERIENCE",
  "GITHUB",
  "GREETING"
];

async function testQuestion(question, label) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ message: question, conversation: [] });
    
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
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const answer = json.answer.substring(0, 90);
          console.log(`✅ ${label}:`);
          console.log(`   "${answer}..."\n`);
        } catch (e) {
          console.log(`❌ ${label}: Parse error`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`❌ ${label}: ${e.message}`);
      resolve();
    });
    
    req.write(payload);
    req.end();
  });
}

console.log('🧪 Testing all 5 questions...\n');

let delay = 0;
for (let i = 0; i < questions.length; i++) {
  await new Promise(resolve => setTimeout(resolve, delay));
  await testQuestion(questions[i], labels[i]);
  delay = 800;
}

console.log('✨ Done!');
process.exit(0);
