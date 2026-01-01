#!/usr/bin/env ts-node

/**
 * Quick search links from command line
 * Usage: npm run quick-search "keyword"
 */

import { LinkOrganizer } from '../lib/LinkOrganizer';

const organizer = new LinkOrganizer();

const query = process.argv.slice(2).join(' ');

if (!query) {
  console.log('Usage: npm run quick-search "keyword"');
  console.log('');
  console.log('Example:');
  console.log('  npm run quick-search "typescript"');
  console.log('  npm run quick-search "daughter"');
  process.exit(1);
}

const results = organizer.fullTextSearch(query);

console.log('');
console.log(`🔍 Search results for: "${query}"`);
console.log('='.repeat(60));
console.log('');

if (results.length === 0) {
  console.log('No results found.');
  console.log('');
  process.exit(0);
}

console.log(`Found ${results.length} result(s):\n`);

results.forEach((link, index) => {
  console.log(`${index + 1}. ${link.title}`);
  console.log(`   URL: ${link.url}`);
  console.log(`   Category: ${link.category}`);
  if (link.lifeArea) console.log(`   Life Area: ${link.lifeArea}`);
  if (link.person) console.log(`   Person: ${link.person}`);
  if (link.tags.length > 0) console.log(`   Tags: ${link.tags.join(', ')}`);
  console.log('');
});

console.log('='.repeat(60));
console.log('');
