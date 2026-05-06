#!/usr/bin/env node
// Quick syntax verification script

const fs = require('fs');
const path = require('path');

const files = [
  './lib/zodiac-companies.js',
  './lib/complexity-config.js',
  './lib/press-release-generator.js'
];

let allValid = true;

console.log('Verifying JavaScript syntax...\n');

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Try to parse the file
    new Function(content);
    console.log(`✓ ${file} - Syntax OK`);
  } catch (error) {
    console.error(`✗ ${file} - Syntax Error: ${error.message}`);
    allValid = false;
  }
});

console.log('\nVerifying module imports...\n');

try {
  const zodiac = require('./lib/zodiac-companies');
  console.log(`✓ lib/zodiac-companies.js exports:`, Object.keys(zodiac).join(', '));
} catch (error) {
  console.error(`✗ Failed to import lib/zodiac-companies.js:`, error.message);
  allValid = false;
}

try {
  const complexity = require('./lib/complexity-config');
  console.log(`✓ lib/complexity-config.js exports:`, Object.keys(complexity).join(', '));
} catch (error) {
  console.error(`✗ Failed to import lib/complexity-config.js:`, error.message);
  allValid = false;
}

try {
  const generator = require('./lib/press-release-generator');
  console.log(`✓ lib/press-release-generator.js exports:`, Object.keys(generator).join(', '));
} catch (error) {
  console.error(`✗ Failed to import lib/press-release-generator.js:`, error.message);
  allValid = false;
}

console.log('\n' + (allValid ? '✓ All verification passed!' : '✗ Some verification failed!'));
process.exit(allValid ? 0 : 1);
