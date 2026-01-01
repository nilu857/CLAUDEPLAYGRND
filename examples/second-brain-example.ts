/**
 * Link Organizer - Second Brain Example
 *
 * This demonstrates using the Link Organizer as your personal "second brain"
 * for organizing knowledge across different life areas
 */

import { LinkOrganizer } from '../lib/LinkOrganizer';

const organizer = new LinkOrganizer();

console.log('='.repeat(70));
console.log('LINK ORGANIZER - YOUR SECOND BRAIN');
console.log('='.repeat(70));

// ============ FAMILY / DAUGHTER'S EDUCATION ============
console.log('\n📚 Adding links for daughter\'s education...\n');

organizer.addLink({
  url: 'https://www.khanacademy.org/math/algebra',
  title: 'Khan Academy - Algebra Fundamentals',
  type: 'course',
  category: 'Education',
  subcategory: 'Math',
  tags: ['math', 'algebra', 'homework-help'],
  lifeArea: 'family',
  person: 'daughter',
  project: 'School Year 2024-2025',
  priority: 'high',
  status: 'to-review',
  notes: 'Recommended by her math teacher for extra practice',
});

organizer.addLink({
  url: 'https://www.youtube.com/watch?v=example-science',
  title: 'Science Project Ideas for Middle School',
  type: 'video',
  category: 'Education',
  subcategory: 'Science',
  tags: ['science', 'project-ideas', 'school'],
  lifeArea: 'family',
  person: 'daughter',
  dueDate: '2026-02-15T00:00:00.000Z',
  priority: 'critical',
  status: 'to-review',
  notes: 'Science fair project due in February',
  favorite: true,
});

// ============ WORK PROJECTS ============
console.log('💼 Adding work-related links...\n');

organizer.addLink({
  url: 'https://docs.microsoft.com/azure/devops',
  title: 'Azure DevOps Best Practices',
  type: 'article',
  category: 'Work',
  subcategory: 'DevOps',
  tags: ['azure', 'devops', 'cicd', 'automation'],
  lifeArea: 'work',
  project: 'Q1 Infrastructure Upgrade',
  priority: 'high',
  status: 'in-progress',
  notes: 'Reference for the CI/CD pipeline redesign',
});

organizer.addLink({
  url: 'https://twitter.com/example/status/tech-thread',
  title: 'Thread on Microservices Architecture Patterns',
  type: 'tweet',
  category: 'Work',
  subcategory: 'Architecture',
  tags: ['microservices', 'architecture', 'best-practices'],
  lifeArea: 'work',
  project: 'System Redesign 2026',
  priority: 'medium',
  status: 'to-review',
  notes: 'Great examples from companies who migrated successfully',
});

// ============ PERSONAL DEVELOPMENT ============
console.log('🌱 Adding personal development links...\n');

organizer.addLink({
  url: 'https://www.coursera.org/learn/machine-learning',
  title: 'Machine Learning Course - Andrew Ng',
  type: 'course',
  category: 'Learning',
  subcategory: 'AI/ML',
  tags: ['machine-learning', 'ai', 'coursera', 'data-science'],
  lifeArea: 'personal',
  person: 'me',
  project: 'AI Skills Development',
  priority: 'medium',
  status: 'in-progress',
  notes: 'Working through Week 3 exercises',
});

organizer.addLink({
  url: 'https://example.com/productivity-tips',
  title: 'Time Management Techniques for Busy Parents',
  type: 'article',
  category: 'Productivity',
  subcategory: 'Time Management',
  tags: ['productivity', 'time-management', 'life-balance'],
  lifeArea: 'personal',
  priority: 'low',
  status: 'to-review',
  notes: 'Recommended by colleague, looks helpful',
  favorite: true,
});

// ============ HEALTH & FITNESS ============
console.log('💪 Adding health & fitness links...\n');

organizer.addLink({
  url: 'https://www.youtube.com/watch?v=home-workout',
  title: '30-Min Home Workout Routine',
  type: 'video',
  category: 'Health',
  subcategory: 'Fitness',
  tags: ['workout', 'fitness', 'home-exercise', 'health'],
  lifeArea: 'health',
  person: 'me',
  project: 'Fitness 2026',
  priority: 'medium',
  status: 'to-review',
  notes: 'No equipment needed, perfect for busy schedule',
});

// ============ FINANCE ============
console.log('💰 Adding finance-related links...\n');

organizer.addLink({
  url: 'https://example.com/529-plan-guide',
  title: 'Complete Guide to 529 College Savings Plans',
  type: 'article',
  category: 'Finance',
  subcategory: 'College Savings',
  tags: ['finance', '529-plan', 'college-savings', 'education-fund'],
  lifeArea: 'finance',
  person: 'daughter',
  priority: 'high',
  status: 'in-progress',
  notes: 'Need to set this up before tax deadline',
  dueDate: '2026-04-15T00:00:00.000Z',
});

console.log('\n' + '='.repeat(70));
console.log('QUICK FILTERS - SECOND BRAIN FEATURES');
console.log('='.repeat(70));

// Example 1: Get all links for your daughter
console.log('\n👧 Links for my daughter:\n');
const daughterLinks = organizer.getByPerson('daughter');
console.log(`Found ${daughterLinks.length} links:`);
daughterLinks.forEach(link => {
  console.log(`  - [${link.priority?.toUpperCase() || 'N/A'}] ${link.title}`);
  console.log(`    Category: ${link.category} > ${link.subcategory || 'N/A'}`);
  if (link.dueDate) console.log(`    Due: ${new Date(link.dueDate).toLocaleDateString()}`);
});

// Example 2: Get all work-related items
console.log('\n💼 Work-related links:\n');
const workLinks = organizer.getByLifeArea('work');
console.log(`Found ${workLinks.length} links:`);
workLinks.forEach(link => {
  console.log(`  - ${link.title}`);
  console.log(`    Project: ${link.project || 'None'} | Status: ${link.status || 'N/A'}`);
});

// Example 3: Get high priority items across ALL life areas
console.log('\n⚡ High priority items:\n');
const highPriority = organizer.getHighPriority();
console.log(`Found ${highPriority.length} high priority items:`);
highPriority.forEach(link => {
  console.log(`  - [${link.priority?.toUpperCase()}] ${link.title}`);
  console.log(`    Life Area: ${link.lifeArea || 'N/A'} | Person: ${link.person || 'N/A'}`);
});

// Example 4: Get items due soon
console.log('\n⏰ Items due soon (next 30 days):\n');
const dueSoon = organizer.getDueSoon(30);
console.log(`Found ${dueSoon.length} items:`);
dueSoon.forEach(link => {
  console.log(`  - ${link.title}`);
  console.log(`    Due: ${link.dueDate ? new Date(link.dueDate).toLocaleDateString() : 'N/A'}`);
  console.log(`    Priority: ${link.priority || 'N/A'}`);
});

// Example 5: Get items to review
console.log('\n📋 Items to review:\n');
const toReview = organizer.getToReview();
console.log(`Found ${toReview.length} items to review:`);
toReview.forEach(link => {
  console.log(`  - ${link.title} [${link.lifeArea || 'N/A'}]`);
});

// Example 6: Full-text search across everything
console.log('\n🔍 Full-text search for "science":\n');
const scienceResults = organizer.fullTextSearch('science');
console.log(`Found ${scienceResults.length} results:`);
scienceResults.forEach(link => {
  console.log(`  - ${link.title}`);
  console.log(`    Tags: ${link.tags.join(', ')}`);
});

// Example 7: Get links by project
console.log('\n📊 Links by project:\n');
const projects = organizer.getProjects();
console.log(`Active projects: ${projects.join(', ')}`);
projects.forEach(project => {
  const projectLinks = organizer.getByProject(project);
  console.log(`\n  ${project} (${projectLinks.length} links):`);
  projectLinks.forEach(link => {
    console.log(`    - ${link.title} [${link.status || 'N/A'}]`);
  });
});

// ============ SMART COLLECTIONS ============
console.log('\n' + '='.repeat(70));
console.log('SMART COLLECTIONS - SAVED SEARCHES');
console.log('='.repeat(70) + '\n');

// Create smart collection for daughter's school stuff
const schoolCollection = organizer.createSmartCollection(
  'Daughter\'s School Resources',
  {
    person: 'daughter',
    lifeArea: 'family',
    category: 'Education',
  },
  'All educational resources for my daughter'
);
console.log(`✅ Created collection: ${schoolCollection.name}`);

// Create smart collection for work priorities
const workPrioritiesCollection = organizer.createSmartCollection(
  'Work Priorities',
  {
    lifeArea: 'work',
    priority: ['critical', 'high'],
    status: ['to-review', 'in-progress'],
  },
  'High priority work items that need attention'
);
console.log(`✅ Created collection: ${workPrioritiesCollection.name}`);

// Create smart collection for personal development
const learningCollection = organizer.createSmartCollection(
  'My Learning Journey',
  {
    lifeArea: 'personal',
    person: 'me',
    type: ['course', 'video', 'article'],
    tags: ['learning'],
  },
  'All my personal learning resources'
);
console.log(`✅ Created collection: ${learningCollection.name}`);

// View all collections
console.log('\n📚 All Smart Collections:\n');
const collections = organizer.getSmartCollections();
collections.forEach(collection => {
  const links = organizer.getCollectionLinks(collection.id);
  console.log(`  - ${collection.name} (${links?.length || 0} links)`);
  if (collection.description) {
    console.log(`    ${collection.description}`);
  }
});

// ============ DASHBOARD ============
console.log('\n' + '='.repeat(70));
console.log('DASHBOARD - AT A GLANCE VIEW');
console.log('='.repeat(70) + '\n');

const dashboard = organizer.getDashboard();
console.log('📊 Quick Stats:');
console.log(`  Total Links: ${dashboard.totalLinks}`);
console.log(`  Favorites: ${dashboard.favorites}`);
console.log(`  To Review: ${dashboard.toReview}`);
console.log(`  High Priority: ${dashboard.highPriority}`);
console.log(`  Due Soon: ${dashboard.dueSoon}`);
console.log(`  Overdue: ${dashboard.overdue}`);

console.log('\n🎯 By Life Area:');
Object.entries(dashboard.byLifeArea).forEach(([area, count]) => {
  console.log(`  ${area}: ${count}`);
});

console.log('\n📁 By Project:');
Object.entries(dashboard.byProject).forEach(([project, count]) => {
  console.log(`  ${project}: ${count}`);
});

console.log('\n🆕 Recently Added (last 7 days):');
dashboard.recentlyAdded.forEach(link => {
  console.log(`  - ${link.title} [${link.lifeArea || 'N/A'}]`);
});

// ============ ENHANCED STATISTICS ============
console.log('\n' + '='.repeat(70));
console.log('DETAILED STATISTICS');
console.log('='.repeat(70) + '\n');

const stats = organizer.getEnhancedStats();
console.log('📈 Complete Breakdown:\n');
console.log(`Total Links: ${stats.total}`);
console.log(`Favorites: ${stats.favorites}`);
console.log(`With Due Dates: ${stats.withDueDates}`);
console.log(`Overdue: ${stats.overdue}`);

console.log('\nBy Type:');
Object.entries(stats.byType).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

console.log('\nBy Life Area:');
Object.entries(stats.byLifeArea).forEach(([area, count]) => {
  console.log(`  ${area}: ${count}`);
});

console.log('\nBy Priority:');
Object.entries(stats.byPriority).forEach(([priority, count]) => {
  console.log(`  ${priority}: ${count}`);
});

console.log('\nBy Status:');
Object.entries(stats.byStatus).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});

console.log('\n' + '='.repeat(70));
console.log('✨ Your Second Brain is Ready! ✨');
console.log('='.repeat(70) + '\n');

console.log('💡 Tips for using your Second Brain:');
console.log('  1. Always tag links with relevant life areas');
console.log('  2. Use person field to quickly filter content');
console.log('  3. Set priorities and due dates for important items');
console.log('  4. Create smart collections for frequent searches');
console.log('  5. Review your dashboard regularly to stay on top of things');
console.log('  6. Use full-text search to find anything quickly');
console.log('');
