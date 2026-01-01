#!/usr/bin/env node

import { LinkOrganizer, Link } from '../lib/LinkOrganizer';
import * as readline from 'readline';

/**
 * Interactive CLI for Link Organizer
 */
class LinkOrganizerCLI {
  private organizer: LinkOrganizer;
  private rl: readline.Interface;

  constructor() {
    this.organizer = new LinkOrganizer();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Display welcome message
   */
  private displayWelcome(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📚 LINK ORGANIZER - Your Personal Link Manager');
    console.log('='.repeat(60));
    console.log(`Total Links: ${this.organizer.getCount()}`);
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Display main menu
   */
  private displayMenu(): void {
    console.log('\n📋 MAIN MENU:');
    console.log('  1. Add new link');
    console.log('  2. View all links');
    console.log('  3. Search links');
    console.log('  4. Filter by category');
    console.log('  5. Filter by type');
    console.log('  6. Filter by tags');
    console.log('  7. View favorites');
    console.log('  8. View statistics');
    console.log('  9. Delete link');
    console.log(' 10. Export links');
    console.log(' 11. Import links');
    console.log('  0. Exit');
    console.log('');
  }

  /**
   * Prompt user for input
   */
  private async prompt(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question, answer => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Display links in a formatted table
   */
  private displayLinks(links: Link[], title: string = 'Links'): void {
    if (links.length === 0) {
      console.log(`\n❌ No links found.\n`);
      return;
    }

    console.log(`\n📖 ${title} (${links.length} total):`);
    console.log('─'.repeat(100));

    links.forEach((link, index) => {
      console.log(`\n${index + 1}. ${link.favorite ? '⭐ ' : ''}${link.title}`);
      console.log(`   URL: ${link.url}`);
      console.log(`   Type: ${link.type} | Category: ${link.category}`);
      console.log(`   Tags: ${link.tags.join(', ')}`);
      if (link.notes) {
        console.log(`   Notes: ${link.notes}`);
      }
      console.log(`   Added: ${new Date(link.dateAdded).toLocaleString()}`);
      console.log(`   ID: ${link.id}`);
    });

    console.log('\n' + '─'.repeat(100) + '\n');
  }

  /**
   * Add a new link
   */
  private async addLink(): Promise<void> {
    console.log('\n➕ ADD NEW LINK\n');

    const url = await this.prompt('Enter URL: ');
    if (!url) {
      console.log('❌ URL is required!');
      return;
    }

    const title = await this.prompt('Enter title: ');
    if (!title) {
      console.log('❌ Title is required!');
      return;
    }

    console.log('\nAvailable types: video, tweet, article, document, other');
    const type = (await this.prompt('Enter type: ')) as Link['type'];
    if (!['video', 'tweet', 'article', 'document', 'other'].includes(type)) {
      console.log('❌ Invalid type!');
      return;
    }

    const category = await this.prompt('Enter category: ');
    if (!category) {
      console.log('❌ Category is required!');
      return;
    }

    const tagsInput = await this.prompt('Enter tags (comma-separated): ');
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const notes = await this.prompt('Enter notes (optional): ');
    const favoriteInput = await this.prompt('Mark as favorite? (y/n): ');
    const favorite = favoriteInput.toLowerCase() === 'y';

    const newLink = this.organizer.addLink({
      url,
      title,
      type,
      category,
      tags,
      notes: notes || undefined,
      favorite,
    });

    console.log(`\n✅ Link added successfully! ID: ${newLink.id}\n`);
  }

  /**
   * View all links with sorting
   */
  private async viewAllLinks(): Promise<void> {
    console.log('\n📚 VIEW ALL LINKS\n');
    console.log('Sort by:');
    console.log('  1. Date Added (newest first)');
    console.log('  2. Date Added (oldest first)');
    console.log('  3. Title (A-Z)');
    console.log('  4. Category');
    console.log('  5. Type');

    const choice = await this.prompt('\nSelect sort option (1-5): ');

    let sortBy: any = 'dateAdded';
    let order: any = 'desc';

    switch (choice) {
      case '1':
        sortBy = 'dateAdded';
        order = 'desc';
        break;
      case '2':
        sortBy = 'dateAdded';
        order = 'asc';
        break;
      case '3':
        sortBy = 'title';
        order = 'asc';
        break;
      case '4':
        sortBy = 'category';
        order = 'asc';
        break;
      case '5':
        sortBy = 'type';
        order = 'asc';
        break;
      default:
        console.log('Invalid choice, using default sort (newest first)');
    }

    const allLinks = this.organizer.getAllLinks();
    const sorted = this.organizer.sort(allLinks, sortBy, order);
    this.displayLinks(sorted, 'All Links');
  }

  /**
   * Search links
   */
  private async searchLinks(): Promise<void> {
    console.log('\n🔍 SEARCH LINKS\n');

    const titleSearch = await this.prompt('Search in title (press Enter to skip): ');
    const urlSearch = await this.prompt('Search in URL (press Enter to skip): ');

    const results = this.organizer.search({
      title: titleSearch || undefined,
      url: urlSearch || undefined,
    });

    this.displayLinks(results, 'Search Results');
  }

  /**
   * Filter by category
   */
  private async filterByCategory(): Promise<void> {
    const categories = this.organizer.getCategories();

    if (categories.length === 0) {
      console.log('\n❌ No categories found.\n');
      return;
    }

    console.log('\n📁 AVAILABLE CATEGORIES:\n');
    categories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat}`);
    });

    const choice = await this.prompt('\nEnter category number or name: ');
    const categoryIndex = parseInt(choice) - 1;

    let selectedCategory: string;
    if (!isNaN(categoryIndex) && categoryIndex >= 0 && categoryIndex < categories.length) {
      selectedCategory = categories[categoryIndex];
    } else {
      selectedCategory = choice;
    }

    const results = this.organizer.filterByCategory(selectedCategory);
    this.displayLinks(results, `Category: ${selectedCategory}`);
  }

  /**
   * Filter by type
   */
  private async filterByType(): Promise<void> {
    console.log('\n📑 FILTER BY TYPE:\n');
    console.log('  1. Video');
    console.log('  2. Tweet');
    console.log('  3. Article');
    console.log('  4. Document');
    console.log('  5. Other');

    const choice = await this.prompt('\nSelect type (1-5): ');

    const typeMap: Record<string, Link['type']> = {
      '1': 'video',
      '2': 'tweet',
      '3': 'article',
      '4': 'document',
      '5': 'other',
    };

    const type = typeMap[choice];
    if (!type) {
      console.log('❌ Invalid choice!');
      return;
    }

    const results = this.organizer.filterByType(type);
    this.displayLinks(results, `Type: ${type}`);
  }

  /**
   * Filter by tags
   */
  private async filterByTags(): Promise<void> {
    const allTags = this.organizer.getTags();

    if (allTags.length === 0) {
      console.log('\n❌ No tags found.\n');
      return;
    }

    console.log('\n🏷️  AVAILABLE TAGS:\n');
    allTags.forEach((tag, index) => {
      console.log(`  ${index + 1}. ${tag}`);
    });

    const input = await this.prompt('\nEnter tag numbers or names (comma-separated): ');
    const selectedTags: string[] = [];

    input.split(',').forEach(item => {
      const trimmed = item.trim();
      const tagIndex = parseInt(trimmed) - 1;

      if (!isNaN(tagIndex) && tagIndex >= 0 && tagIndex < allTags.length) {
        selectedTags.push(allTags[tagIndex]);
      } else if (trimmed) {
        selectedTags.push(trimmed);
      }
    });

    if (selectedTags.length === 0) {
      console.log('❌ No tags selected!');
      return;
    }

    const results = this.organizer.filterByTags(selectedTags);
    this.displayLinks(results, `Tags: ${selectedTags.join(', ')}`);
  }

  /**
   * View favorites
   */
  private async viewFavorites(): Promise<void> {
    const favorites = this.organizer.getFavorites();
    this.displayLinks(favorites, '⭐ Favorite Links');
  }

  /**
   * View statistics
   */
  private async viewStats(): Promise<void> {
    const stats = this.organizer.getStats();

    console.log('\n📊 LINK STATISTICS\n');
    console.log('─'.repeat(50));
    console.log(`Total Links: ${stats.total}`);
    console.log(`Favorites: ${stats.favorites}`);
    console.log('\nBy Type:');
    Object.entries(stats.byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    console.log('\nBy Category:');
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    console.log('─'.repeat(50) + '\n');
  }

  /**
   * Delete a link
   */
  private async deleteLink(): Promise<void> {
    const id = await this.prompt('\n🗑️  Enter link ID to delete: ');

    const link = this.organizer.getLinkById(id);
    if (!link) {
      console.log('❌ Link not found!');
      return;
    }

    console.log(`\nYou are about to delete: "${link.title}"`);
    const confirm = await this.prompt('Are you sure? (y/n): ');

    if (confirm.toLowerCase() === 'y') {
      this.organizer.deleteLink(id);
      console.log('✅ Link deleted successfully!\n');
    } else {
      console.log('❌ Deletion cancelled.\n');
    }
  }

  /**
   * Export links
   */
  private async exportLinks(): Promise<void> {
    console.log('\n💾 EXPORT LINKS\n');
    console.log('  1. Export all to JSON');
    console.log('  2. Export all to CSV');
    console.log('  3. Export search results');

    const choice = await this.prompt('\nSelect option (1-3): ');

    let links = this.organizer.getAllLinks();
    if (choice === '3') {
      const search = await this.prompt('Search in title: ');
      links = this.organizer.search({ title: search });
      console.log(`Found ${links.length} matching links`);
    }

    const filename = await this.prompt('Enter filename (without extension): ');

    if (choice === '2') {
      this.organizer.exportToCsv(`${filename}.csv`, links);
      console.log(`✅ Exported to ${filename}.csv\n`);
    } else {
      this.organizer.exportToJson(`${filename}.json`, links);
      console.log(`✅ Exported to ${filename}.json\n`);
    }
  }

  /**
   * Import links
   */
  private async importLinks(): Promise<void> {
    console.log('\n📥 IMPORT LINKS\n');

    const filename = await this.prompt('Enter filename to import: ');
    const mergeInput = await this.prompt('Merge with existing links? (y/n): ');
    const merge = mergeInput.toLowerCase() === 'y';

    try {
      const count = this.organizer.importFromJson(filename, merge);
      console.log(`✅ Successfully imported ${count} links!\n`);
    } catch (error) {
      console.log(`❌ Import failed: ${error}\n`);
    }
  }

  /**
   * Run the CLI
   */
  async run(): Promise<void> {
    this.displayWelcome();

    let running = true;

    while (running) {
      this.displayMenu();
      const choice = await this.prompt('Select option: ');

      switch (choice) {
        case '1':
          await this.addLink();
          break;
        case '2':
          await this.viewAllLinks();
          break;
        case '3':
          await this.searchLinks();
          break;
        case '4':
          await this.filterByCategory();
          break;
        case '5':
          await this.filterByType();
          break;
        case '6':
          await this.filterByTags();
          break;
        case '7':
          await this.viewFavorites();
          break;
        case '8':
          await this.viewStats();
          break;
        case '9':
          await this.deleteLink();
          break;
        case '10':
          await this.exportLinks();
          break;
        case '11':
          await this.importLinks();
          break;
        case '0':
          console.log('\n👋 Goodbye!\n');
          running = false;
          break;
        default:
          console.log('\n❌ Invalid option. Please try again.\n');
      }
    }

    this.rl.close();
  }
}

// Run CLI if executed directly
if (require.main === module) {
  const cli = new LinkOrganizerCLI();
  cli.run().catch(error => {
    console.error('CLI Error:', error);
    process.exit(1);
  });
}

export { LinkOrganizerCLI };
