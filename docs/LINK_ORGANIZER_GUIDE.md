# Link Organizer - Your Second Brain

A comprehensive personal knowledge management system for organizing and retrieving links, videos, tweets, articles, and more across all areas of your life.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [Features](#features)
5. [Usage Examples](#usage-examples)
6. [CLI Interface](#cli-interface)
7. [Advanced Features](#advanced-features)
8. [Best Practices](#best-practices)

## Overview

The Link Organizer is designed to be your "second brain" - a centralized system for storing and organizing all the interesting content you find across the web. Whether it's educational resources for your daughter, work-related articles, personal development courses, or fitness videos, everything is easily accessible and searchable.

### Key Benefits

- **Life Area Organization**: Separate content by work, family, personal, education, health, finance, hobbies, etc.
- **Person Association**: Tag links for specific people (daughter, spouse, team members)
- **Project Management**: Associate links with ongoing projects
- **Priority & Status Tracking**: Mark important items and track their progress
- **Smart Collections**: Save frequent searches for instant access
- **Full-Text Search**: Find anything quickly across all fields
- **Related Links**: Connect related resources together
- **Dashboard View**: See what needs attention at a glance

## Quick Start

### Installation

```bash
# The LinkOrganizer is already part of your framework
npm install
```

### Basic Usage

```typescript
import { LinkOrganizer } from './lib/LinkOrganizer';

const organizer = new LinkOrganizer();

// Add a link
organizer.addLink({
  url: 'https://www.youtube.com/watch?v=example',
  title: 'Great TypeScript Tutorial',
  type: 'video',
  category: 'Programming',
  tags: ['typescript', 'tutorial'],
  lifeArea: 'personal',
  priority: 'high',
});

// Search
const results = organizer.fullTextSearch('typescript');

// Get by life area
const workLinks = organizer.getByLifeArea('work');
```

### Using the CLI

```bash
# Run the interactive CLI
npm run links

# Or directly with ts-node
npx ts-node utils/link-organizer-cli.ts
```

## Core Concepts

### Link Structure

Every link in your second brain has the following properties:

```typescript
{
  // Required fields
  id: string;                    // Auto-generated unique ID
  url: string;                   // The link URL
  title: string;                 // Descriptive title
  type: string;                  // video, tweet, article, document, podcast, tool, course, other
  category: string;              // Main category
  tags: string[];                // Array of tags

  // Optional organization fields
  subcategory?: string;          // More specific categorization
  lifeArea?: string;             // personal, work, family, education, health, finance, hobby, other
  person?: string;               // Who this is for (e.g., "daughter", "me")
  project?: string;              // Associated project name

  // Priority and status
  priority?: string;             // critical, high, medium, low
  status?: string;               // to-review, in-progress, completed, archived
  dueDate?: string;              // When you need to review/use this

  // Additional metadata
  notes?: string;                // Your notes about this link
  favorite?: boolean;            // Mark as favorite
  relatedLinks?: string[];       // IDs of related links
  customFields?: object;         // Any additional data you want to store

  // Auto-managed
  dateAdded: string;             // When you added it
  lastModified: string;          // Last update time
}
```

### Life Areas

Organize your links by different areas of your life:

- **personal**: Self-improvement, hobbies, personal projects
- **work**: Job-related resources, professional development
- **family**: Family activities, resources for spouse/children
- **education**: Learning resources, courses, tutorials
- **health**: Fitness, nutrition, mental health
- **finance**: Financial planning, investment resources
- **hobby**: Hobby-specific resources
- **other**: Anything else

### Types of Content

- **video**: YouTube videos, Vimeo, etc.
- **tweet**: Twitter threads and tweets
- **article**: Blog posts, news articles
- **document**: PDFs, Google Docs, etc.
- **podcast**: Podcast episodes
- **tool**: Software tools, web apps
- **course**: Online courses, tutorials
- **other**: Anything else

## Features

### 1. Adding Links

```typescript
// Simple add
organizer.addLink({
  url: 'https://example.com/article',
  title: 'Amazing Article',
  type: 'article',
  category: 'Learning',
  tags: ['productivity', 'tips'],
});

// With full second brain metadata
organizer.addLink({
  url: 'https://khanacademy.org/math',
  title: 'Khan Academy Math',
  type: 'course',
  category: 'Education',
  subcategory: 'Mathematics',
  tags: ['math', 'education', 'algebra'],
  lifeArea: 'family',
  person: 'daughter',
  project: 'School Year 2025',
  priority: 'high',
  status: 'in-progress',
  notes: 'Recommended by teacher for extra practice',
  favorite: true,
});
```

### 2. Searching and Filtering

#### Full-Text Search

```typescript
// Search across all fields
const results = organizer.fullTextSearch('typescript');
```

#### Filter by Life Area

```typescript
// Get all work-related links
const workLinks = organizer.getByLifeArea('work');

// Get all family-related links
const familyLinks = organizer.getByLifeArea('family');
```

#### Filter by Person

```typescript
// Get all links for your daughter
const daughterLinks = organizer.getByPerson('daughter');

// Get your own learning resources
const myLinks = organizer.getByPerson('me');
```

#### Filter by Project

```typescript
const projectLinks = organizer.getByProject('Q1 Infrastructure Upgrade');
```

#### Filter by Priority

```typescript
// Get critical and high priority items
const urgent = organizer.getHighPriority();

// Or specific priority
const criticalOnly = organizer.search({ priority: 'critical' });
```

#### Filter by Status

```typescript
const toReview = organizer.getToReview();
const inProgress = organizer.getByStatus('in-progress');
```

#### Complex Searches

```typescript
// Combine multiple criteria
const results = organizer.search({
  lifeArea: 'work',
  priority: ['high', 'critical'],
  status: 'to-review',
  tags: 'devops',
});

// Multiple types
const learning = organizer.search({
  type: ['video', 'course', 'article'],
  lifeArea: 'personal',
  person: 'me',
});
```

### 3. Time-Based Filters

```typescript
// Get items due soon (next 7 days by default)
const dueSoon = organizer.getDueSoon();

// Custom timeframe (next 30 days)
const dueThisMonth = organizer.getDueSoon(30);

// Get overdue items
const overdue = organizer.getOverdue();

// Recently added (last 7 days)
const recent = organizer.getRecentlyAdded();

// Custom date range
const dateRange = organizer.search({
  dateFrom: '2026-01-01T00:00:00.000Z',
  dateTo: '2026-01-31T23:59:59.000Z',
});
```

### 4. Smart Collections (Saved Searches)

Create saved searches for quick access to frequently needed content:

```typescript
// Create a smart collection
const collection = organizer.createSmartCollection(
  'Daughter\'s School Resources',
  {
    person: 'daughter',
    lifeArea: 'family',
    category: 'Education',
  },
  'All educational resources for my daughter'
);

// Get all collections
const collections = organizer.getSmartCollections();

// Get links from a collection
const links = organizer.getCollectionLinks(collection.id);

// Delete a collection
organizer.deleteSmartCollection(collection.id);
```

### 5. Related Links

Connect related resources together:

```typescript
// Add a related link
organizer.addRelatedLink('link_id_1', 'link_id_2');

// Get all related links
const related = organizer.getRelatedLinks('link_id_1');

// Remove relationship
organizer.removeRelatedLink('link_id_1', 'link_id_2');
```

### 6. Dashboard

Get an overview of your second brain:

```typescript
const dashboard = organizer.getDashboard();
console.log(dashboard);
/*
{
  totalLinks: 50,
  favorites: 12,
  toReview: 5,
  highPriority: 8,
  dueSoon: 3,
  overdue: 1,
  byLifeArea: { work: 20, family: 15, personal: 10, ... },
  byProject: { 'Q1 Project': 5, 'School Year': 8, ... },
  recentlyAdded: [...]
}
*/
```

### 7. Statistics

```typescript
const stats = organizer.getEnhancedStats();
console.log(stats);
/*
{
  total: 50,
  favorites: 12,
  withDueDates: 15,
  overdue: 1,
  byType: { video: 20, article: 15, ... },
  byCategory: { Programming: 10, Education: 15, ... },
  byLifeArea: { work: 20, family: 15, ... },
  byPriority: { high: 10, medium: 20, ... },
  byStatus: { 'to-review': 5, 'in-progress': 10, ... }
}
*/
```

### 8. Sorting

```typescript
const allLinks = organizer.getAllLinks();

// Sort by date added (newest first)
const newest = organizer.sort(allLinks, 'dateAdded', 'desc');

// Sort by priority (highest first)
const byPriority = organizer.sort(allLinks, 'priority', 'asc');

// Sort by due date (soonest first)
const byDueDate = organizer.sort(allLinks, 'dueDate', 'asc');

// Sort by title A-Z
const alphabetical = organizer.sort(allLinks, 'title', 'asc');
```

### 9. Updating and Deleting

```typescript
// Update a link
organizer.updateLink('link_id', {
  priority: 'critical',
  status: 'in-progress',
  notes: 'Updated notes',
});

// Delete a link
organizer.deleteLink('link_id');
```

### 10. Import/Export

```typescript
// Export all links to JSON
organizer.exportToJson('./my-links-backup.json');

// Export to CSV
organizer.exportToCsv('./my-links-backup.csv');

// Export specific links
const favorites = organizer.getFavorites();
organizer.exportToJson('./favorites.json', favorites);

// Import links
organizer.importFromJson('./backup.json', true); // merge mode
```

## CLI Interface

The interactive CLI provides easy access to all features:

### Main Menu Options

1. **Add new link** - Guided prompts for adding links
2. **View all links** - Browse with sorting options
3. **Search links** - Search by title or URL
4. **Filter by category** - View by category
5. **Filter by type** - View by content type
6. **Filter by tags** - Filter using tags
7. **View favorites** - See favorite links
8. **View statistics** - Dashboard and stats
9. **Delete link** - Remove links
10. **Export links** - Export to JSON/CSV
11. **Import links** - Import from JSON

### Running the CLI

```bash
# Via npm script (add to package.json)
npm run links

# Direct execution
npx ts-node utils/link-organizer-cli.ts
```

## Advanced Features

### Custom Fields

Store any additional metadata:

```typescript
organizer.addLink({
  url: 'https://example.com',
  title: 'Example',
  type: 'article',
  category: 'Test',
  tags: ['test'],
  customFields: {
    rating: 5,
    readTime: '15 minutes',
    author: 'John Doe',
    completionPercentage: 75,
  },
});
```

### Bulk Operations

```typescript
// Get all projects
const projects = organizer.getProjects();

// Process each project
projects.forEach(project => {
  const links = organizer.getByProject(project);
  console.log(`${project}: ${links.length} links`);
});

// Get all unique tags
const allTags = organizer.getTags();

// Get all categories
const categories = organizer.getCategories();
```

## Best Practices

### 1. Consistent Tagging

Use consistent tag names across your links:

```typescript
// Good
tags: ['typescript', 'tutorial', 'beginner']

// Avoid variations
tags: ['TypeScript', 'tutorials', 'beginner-friendly']
```

### 2. Use Life Areas

Always specify a life area to make filtering easier:

```typescript
lifeArea: 'work'  // or 'family', 'personal', etc.
```

### 3. Set Priorities for Important Items

```typescript
priority: 'high'  // for things that need attention
```

### 4. Use Due Dates

Set due dates for time-sensitive content:

```typescript
dueDate: '2026-02-15T00:00:00.000Z'
```

### 5. Create Smart Collections

For frequent searches, create smart collections:

```typescript
// Daughter's urgent school items
organizer.createSmartCollection('Urgent School Items', {
  person: 'daughter',
  priority: ['critical', 'high'],
  status: 'to-review',
});
```

### 6. Regular Reviews

Check your dashboard regularly:

```typescript
const dashboard = organizer.getDashboard();
// Review overdue items
const overdue = organizer.getOverdue();
// Review high priority items
const highPriority = organizer.getHighPriority();
```

### 7. Meaningful Notes

Add context in notes:

```typescript
notes: 'Recommended by Sarah. Covers advanced patterns we discussed in last meeting.'
```

### 8. Use Projects

Group related links under projects:

```typescript
project: 'School Year 2025'
project: 'Q1 Infrastructure Upgrade'
project: 'Fitness 2026'
```

## Use Cases

### For Parents

```typescript
// Track educational resources for children
organizer.addLink({
  url: 'https://khanacademy.org',
  title: 'Khan Academy',
  type: 'tool',
  category: 'Education',
  lifeArea: 'family',
  person: 'daughter',
  tags: ['math', 'science', 'homework-help'],
});

// Quick access to daughter's resources
const daughterLinks = organizer.getByPerson('daughter');
```

### For Professionals

```typescript
// Organize work resources by project
organizer.addLink({
  url: 'https://docs.example.com',
  title: 'API Documentation',
  type: 'document',
  category: 'Work',
  lifeArea: 'work',
  project: 'API Redesign 2026',
  priority: 'high',
  tags: ['api', 'documentation', 'reference'],
});

// Get all project-related links
const projectLinks = organizer.getByProject('API Redesign 2026');
```

### For Learners

```typescript
// Track online courses and learning resources
organizer.addLink({
  url: 'https://coursera.org/course',
  title: 'Machine Learning Course',
  type: 'course',
  category: 'Learning',
  lifeArea: 'personal',
  person: 'me',
  status: 'in-progress',
  tags: ['machine-learning', 'ai', 'data-science'],
  notes: 'Currently on Week 3',
});

// View all in-progress learning
const learning = organizer.search({
  lifeArea: 'personal',
  type: 'course',
  status: 'in-progress',
});
```

## Tips and Tricks

1. **Use full-text search** when you can't remember exactly where you saved something
2. **Create a "To Review" smart collection** for new finds you want to check out later
3. **Set due dates** for time-sensitive content (conference talks, limited-time offers, etc.)
4. **Use related links** to build knowledge graphs on specific topics
5. **Export regularly** to back up your second brain
6. **Use the dashboard** as your daily starting point
7. **Tag with both general and specific tags** for better discoverability
8. **Update status** as you work through content

## Troubleshooting

### Links not saving?

Check that the data directory exists and has write permissions.

### Can't find a link?

Use full-text search:

```typescript
const results = organizer.fullTextSearch('keyword');
```

### Too many results?

Combine multiple filters:

```typescript
const results = organizer.search({
  lifeArea: 'work',
  type: 'article',
  tags: 'devops',
  priority: 'high',
});
```

## Support

For issues or questions, check the examples folder:
- `/examples/link-organizer-example.ts` - Basic usage
- `/examples/second-brain-example.ts` - Advanced features

Happy organizing!
