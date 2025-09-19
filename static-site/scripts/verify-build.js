#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = 'dist';
const requiredFiles = [
  'index.html',
  '_redirects',
  '_headers',
  'games.json'
];

console.log('🔍 Verifying build output...\n');

let allGood = true;

// Check required files exist
requiredFiles.forEach(file => {
  const filePath = join(distDir, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allGood = false;
  }
});

// Check _redirects content
try {
  const redirectsContent = readFileSync(join(distDir, '_redirects'), 'utf8');
  if (redirectsContent.includes('/*    /index.html   200')) {
    console.log('✅ _redirects configured for SPA routing');
  } else {
    console.log('❌ _redirects missing SPA configuration');
    allGood = false;
  }
} catch (e) {
  console.log('❌ Could not read _redirects file');
  allGood = false;
}

// Check games.json is valid
try {
  const gamesContent = readFileSync(join(distDir, 'games.json'), 'utf8');
  const games = JSON.parse(gamesContent);
  if (Array.isArray(games) && games.length > 0) {
    console.log(`✅ games.json contains ${games.length} games`);
  } else {
    console.log('❌ games.json is empty or invalid');
    allGood = false;
  }
} catch (e) {
  console.log('❌ games.json is not valid JSON');
  allGood = false;
}

// Check assets directory
if (existsSync(join(distDir, 'assets'))) {
  console.log('✅ assets directory exists');
} else {
  console.log('❌ assets directory missing');
  allGood = false;
}

console.log('\n' + (allGood ? '🎉 Build verification passed!' : '💥 Build verification failed!'));
process.exit(allGood ? 0 : 1);