#!/usr/bin/env ts-node

/**
 * Quick add a link from command line
 * Usage: npm run quick-add "https://example.com" "Title" "category"
 */

import { LinkOrganizer } from '../lib/LinkOrganizer';

const organizer = new LinkOrganizer();

const url = process.argv[2];
const title = process.argv[3];
const category = process.argv[4] || 'General';
const tagsInput = process.argv[5] || '';

if (!url || !title) {
  console.log('Usage: npm run quick-add "URL" "Title" ["Category"] ["tags,separated,by,comma"]');
  console.log('');
  console.log('Example:');
  console.log('  npm run quick-add "https://example.com" "Cool Article" "Tech" "javascript,tutorial"');
  process.exit(1);
}

const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['quick-add'];

const link = organizer.addLink({
  url,
  title,
  type: 'article',
  category,
  tags,
  status: 'to-review',
  lifeArea: 'personal',
});

console.log('');
console.log('✅ Link added successfully!');
console.log('');
console.log(`   ID: ${link.id}`);
console.log(`   Title: ${link.title}`);
console.log(`   URL: ${link.url}`);
console.log(`   Category: ${link.category}`);
console.log(`   Tags: ${link.tags.join(', ')}`);
console.log('');
