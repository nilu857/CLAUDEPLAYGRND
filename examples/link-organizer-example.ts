/**
 * Link Organizer - Example Usage
 *
 * This file demonstrates various ways to use the LinkOrganizer class
 */

import { LinkOrganizer } from '../lib/LinkOrganizer';

// Initialize the organizer
const organizer = new LinkOrganizer();

console.log('='.repeat(60));
console.log('LINK ORGANIZER - EXAMPLE USAGE');
console.log('='.repeat(60));

// Example 1: Add a video link
console.log('\n📹 Example 1: Adding a video link\n');
const video = organizer.addLink({
  url: 'https://www.youtube.com/watch?v=example',
  title: 'Advanced TypeScript Patterns',
  type: 'video',
  category: 'Programming',
  tags: ['typescript', 'patterns', 'advanced'],
  notes: 'Great video covering advanced TypeScript design patterns',
  favorite: true,
});
console.log(`✅ Added: ${video.title}`);
console.log(`   ID: ${video.id}`);

// Example 2: Add a tweet
console.log('\n🐦 Example 2: Adding a tweet\n');
const tweet = organizer.addLink({
  url: 'https://twitter.com/example/status/123',
  title: 'Thread on React Performance',
  type: 'tweet',
  category: 'Web Development',
  tags: ['react', 'performance', 'optimization'],
  notes: 'Comprehensive thread on React rendering optimization',
  favorite: false,
});
console.log(`✅ Added: ${tweet.title}`);

// Example 3: Add an article
console.log('\n📰 Example 3: Adding an article\n');
const article = organizer.addLink({
  url: 'https://example.com/api-testing-guide',
  title: 'Complete Guide to API Testing',
  type: 'article',
  category: 'Testing',
  tags: ['testing', 'api', 'automation', 'playwright'],
  notes: 'Comprehensive guide covering all aspects of API testing',
});
console.log(`✅ Added: ${article.title}`);

// Example 4: Search links by title
console.log('\n🔍 Example 4: Searching by title\n');
const searchResults = organizer.search({ title: 'TypeScript' });
console.log(`Found ${searchResults.length} links matching "TypeScript":`);
searchResults.forEach(link => {
  console.log(`  - ${link.title}`);
});

// Example 5: Filter by category
console.log('\n📁 Example 5: Filtering by category\n');
const programmingLinks = organizer.filterByCategory('Programming');
console.log(`Found ${programmingLinks.length} links in "Programming" category:`);
programmingLinks.forEach(link => {
  console.log(`  - ${link.title}`);
});

// Example 6: Filter by type
console.log('\n📑 Example 6: Filtering by type\n');
const videos = organizer.filterByType('video');
console.log(`Found ${videos.length} video links:`);
videos.forEach(link => {
  console.log(`  - ${link.title} (${link.url})`);
});

// Example 7: Filter by tags
console.log('\n🏷️  Example 7: Filtering by tags\n');
const testingLinks = organizer.filterByTags(['testing', 'api']);
console.log(`Found ${testingLinks.length} links tagged with "testing" or "api":`);
testingLinks.forEach(link => {
  console.log(`  - ${link.title} [${link.tags.join(', ')}]`);
});

// Example 8: View favorites
console.log('\n⭐ Example 8: Getting favorite links\n');
const favorites = organizer.getFavorites();
console.log(`Found ${favorites.length} favorite links:`);
favorites.forEach(link => {
  console.log(`  - ${link.title}`);
});

// Example 9: Sort links
console.log('\n📊 Example 9: Sorting links\n');
const allLinks = organizer.getAllLinks();
const sortedByTitle = organizer.sort(allLinks, 'title', 'asc');
console.log('Links sorted by title (A-Z):');
sortedByTitle.forEach((link, index) => {
  console.log(`  ${index + 1}. ${link.title}`);
});

// Example 10: Get statistics
console.log('\n📈 Example 10: Getting statistics\n');
const stats = organizer.getStats();
console.log('Link Collection Statistics:');
console.log(`  Total Links: ${stats.total}`);
console.log(`  Favorites: ${stats.favorites}`);
console.log('\n  By Type:');
Object.entries(stats.byType).forEach(([type, count]) => {
  console.log(`    ${type}: ${count}`);
});
console.log('\n  By Category:');
Object.entries(stats.byCategory).forEach(([category, count]) => {
  console.log(`    ${category}: ${count}`);
});

// Example 11: Get all categories and tags
console.log('\n📚 Example 11: Getting all categories and tags\n');
const categories = organizer.getCategories();
const tags = organizer.getTags();
console.log('Available Categories:', categories.join(', '));
console.log('Available Tags:', tags.join(', '));

// Example 12: Complex search with multiple criteria
console.log('\n🔍 Example 12: Complex search\n');
const complexSearch = organizer.search({
  type: ['video', 'article'],
  tags: 'typescript',
  favorite: true,
});
console.log('Favorite videos or articles tagged with "typescript":');
complexSearch.forEach(link => {
  console.log(`  - ${link.title} (${link.type})`);
});

// Example 13: Update a link
console.log('\n✏️  Example 13: Updating a link\n');
if (video.id) {
  const updated = organizer.updateLink(video.id, {
    notes: 'Updated notes: Must watch for TypeScript developers!',
    tags: ['typescript', 'patterns', 'advanced', 'must-watch'],
  });
  console.log(`✅ Updated: ${updated?.title}`);
  console.log(`   New tags: ${updated?.tags.join(', ')}`);
}

// Example 14: Export to JSON
console.log('\n💾 Example 14: Exporting links\n');
const exportPath = './my-links-export.json';
organizer.exportToJson(exportPath);
console.log(`✅ Exported all links to ${exportPath}`);

// Export favorites only
const favoritesPath = './favorites-export.json';
organizer.exportToJson(favoritesPath, favorites);
console.log(`✅ Exported ${favorites.length} favorites to ${favoritesPath}`);

// Example 15: Export to CSV
console.log('\n📊 Example 15: Exporting to CSV\n');
const csvPath = './my-links-export.csv';
organizer.exportToCsv(csvPath);
console.log(`✅ Exported all links to CSV: ${csvPath}`);

// Example 16: Date range search
console.log('\n📅 Example 16: Searching by date range\n');
const today = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const recentLinks = organizer.search({
  dateFrom: yesterday,
  dateTo: today,
});
console.log(`Found ${recentLinks.length} links added in the last 24 hours`);

// Example 17: Get specific link by ID
console.log('\n🔑 Example 17: Getting link by ID\n');
const foundLink = organizer.getLinkById(video.id);
if (foundLink) {
  console.log(`Found link: ${foundLink.title}`);
  console.log(`  URL: ${foundLink.url}`);
  console.log(`  Added: ${new Date(foundLink.dateAdded).toLocaleString()}`);
}

console.log('\n' + '='.repeat(60));
console.log('Examples completed!');
console.log(`Total links in organizer: ${organizer.getCount()}`);
console.log('='.repeat(60) + '\n');
