import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/Logger';

/**
 * Represents a stored link with metadata
 */
export interface Link {
  id: string;
  url: string;
  title: string;
  type: 'video' | 'tweet' | 'article' | 'document' | 'podcast' | 'tool' | 'course' | 'other';
  category: string;
  subcategory?: string;
  tags: string[];
  notes?: string;
  dateAdded: string;
  lastModified: string;
  favorite?: boolean;

  // Second Brain features
  lifeArea?: 'personal' | 'work' | 'family' | 'education' | 'health' | 'finance' | 'hobby' | 'other';
  person?: string; // e.g., "daughter", "me", "wife", "team member name"
  project?: string; // Associated project name
  priority?: 'critical' | 'high' | 'medium' | 'low';
  status?: 'to-review' | 'in-progress' | 'completed' | 'archived';
  dueDate?: string; // ISO date string
  relatedLinks?: string[]; // Array of link IDs
  customFields?: Record<string, any>; // Flexible metadata
}

/**
 * Search criteria for filtering links
 */
export interface SearchCriteria {
  url?: string;
  title?: string;
  type?: Link['type'] | Link['type'][];
  category?: string | string[];
  subcategory?: string | string[];
  tags?: string | string[];
  favorite?: boolean;
  dateFrom?: string;
  dateTo?: string;

  // Second Brain search criteria
  lifeArea?: Link['lifeArea'] | Link['lifeArea'][];
  person?: string | string[];
  project?: string | string[];
  priority?: Link['priority'] | Link['priority'][];
  status?: Link['status'] | Link['status'][];
  dueDateFrom?: string;
  dueDateTo?: string;
  fullText?: string; // Search across all text fields
}

/**
 * Sort options for organizing links
 */
export type SortBy = 'dateAdded' | 'lastModified' | 'title' | 'category' | 'type' | 'priority' | 'dueDate' | 'lifeArea';
export type SortOrder = 'asc' | 'desc';

/**
 * Smart Collection - Saved search with a name
 */
export interface SmartCollection {
  id: string;
  name: string;
  description?: string;
  criteria: SearchCriteria;
  dateCreated: string;
}

/**
 * LinkOrganizer - A comprehensive "second brain" link management system
 *
 * Features:
 * - Add, update, delete links with rich metadata
 * - Search and filter by multiple criteria
 * - Sort links in various ways
 * - Tag-based organization
 * - Category and subcategory management
 * - Life area organization (work, family, personal, etc.)
 * - Project and person associations
 * - Priority and status tracking
 * - Smart collections (saved searches)
 * - Related links support
 * - Full-text search
 * - Import/Export functionality
 * - Favorites support
 */
export class LinkOrganizer {
  private links: Link[] = [];
  private smartCollections: SmartCollection[] = [];
  private readonly dataFilePath: string;
  private readonly collectionsFilePath: string;
  private logger: Logger;

  constructor(
    dataFilePath: string = path.join(__dirname, '../data/links.json'),
    collectionsFilePath: string = path.join(__dirname, '../data/collections.json')
  ) {
    this.dataFilePath = dataFilePath;
    this.collectionsFilePath = collectionsFilePath;
    this.logger = Logger.getInstance();
    this.loadLinks();
    this.loadCollections();
  }

  /**
   * Load links from storage file
   */
  private loadLinks(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const data = fs.readFileSync(this.dataFilePath, 'utf-8');
        this.links = JSON.parse(data);
        this.logger.info(`Loaded ${this.links.length} links from storage`);
      } else {
        this.links = [];
        this.saveLinks(); // Create empty file
        this.logger.info('Created new links storage file');
      }
    } catch (error) {
      this.logger.error('Error loading links', error);
      this.links = [];
    }
  }

  /**
   * Load smart collections from storage file
   */
  private loadCollections(): void {
    try {
      if (fs.existsSync(this.collectionsFilePath)) {
        const data = fs.readFileSync(this.collectionsFilePath, 'utf-8');
        this.smartCollections = JSON.parse(data);
        this.logger.info(`Loaded ${this.smartCollections.length} smart collections`);
      } else {
        this.smartCollections = [];
        this.saveCollections();
      }
    } catch (error) {
      this.logger.error('Error loading collections', error);
      this.smartCollections = [];
    }
  }

  /**
   * Save smart collections to storage file
   */
  private saveCollections(): void {
    try {
      const dir = path.dirname(this.collectionsFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.collectionsFilePath, JSON.stringify(this.smartCollections, null, 2), 'utf-8');
      this.logger.debug('Collections saved to storage');
    } catch (error) {
      this.logger.error('Error saving collections', error);
    }
  }

  /**
   * Save links to storage file
   */
  private saveLinks(): void {
    try {
      const dir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.links, null, 2), 'utf-8');
      this.logger.debug('Links saved to storage');
    } catch (error) {
      this.logger.error('Error saving links', error);
      throw new Error('Failed to save links');
    }
  }

  /**
   * Generate unique ID for a link
   */
  private generateId(): string {
    return `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add a new link to the organizer
   */
  addLink(linkData: Omit<Link, 'id' | 'dateAdded' | 'lastModified'>): Link {
    const now = new Date().toISOString();
    const newLink: Link = {
      id: this.generateId(),
      ...linkData,
      dateAdded: now,
      lastModified: now,
    };

    this.links.push(newLink);
    this.saveLinks();
    this.logger.info(`Added link: ${newLink.title} (${newLink.url})`);
    return newLink;
  }

  /**
   * Update an existing link
   */
  updateLink(id: string, updates: Partial<Omit<Link, 'id' | 'dateAdded'>>): Link | null {
    const index = this.links.findIndex(link => link.id === id);
    if (index === -1) {
      this.logger.warn(`Link not found: ${id}`);
      return null;
    }

    this.links[index] = {
      ...this.links[index],
      ...updates,
      lastModified: new Date().toISOString(),
    };

    this.saveLinks();
    this.logger.info(`Updated link: ${this.links[index].title}`);
    return this.links[index];
  }

  /**
   * Delete a link by ID
   */
  deleteLink(id: string): boolean {
    const index = this.links.findIndex(link => link.id === id);
    if (index === -1) {
      this.logger.warn(`Link not found for deletion: ${id}`);
      return false;
    }

    const deleted = this.links.splice(index, 1)[0];
    this.saveLinks();
    this.logger.info(`Deleted link: ${deleted.title}`);
    return true;
  }

  /**
   * Get a link by ID
   */
  getLinkById(id: string): Link | null {
    return this.links.find(link => link.id === id) || null;
  }

  /**
   * Get all links
   */
  getAllLinks(): Link[] {
    return [...this.links];
  }

  /**
   * Search links by criteria (enhanced with full-text search and second brain filters)
   */
  search(criteria: SearchCriteria): Link[] {
    return this.links.filter(link => {
      // Full-text search across all text fields
      if (criteria.fullText) {
        const searchTerm = criteria.fullText.toLowerCase();
        const searchableText = [
          link.title,
          link.url,
          link.category,
          link.subcategory || '',
          link.notes || '',
          link.person || '',
          link.project || '',
          ...link.tags,
        ].join(' ').toLowerCase();

        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // URL search (partial match)
      if (criteria.url && !link.url.toLowerCase().includes(criteria.url.toLowerCase())) {
        return false;
      }

      // Title search (partial match)
      if (criteria.title && !link.title.toLowerCase().includes(criteria.title.toLowerCase())) {
        return false;
      }

      // Type filter
      if (criteria.type) {
        const types = Array.isArray(criteria.type) ? criteria.type : [criteria.type];
        if (!types.includes(link.type)) {
          return false;
        }
      }

      // Category filter
      if (criteria.category) {
        const categories = Array.isArray(criteria.category) ? criteria.category : [criteria.category];
        if (!categories.includes(link.category)) {
          return false;
        }
      }

      // Subcategory filter
      if (criteria.subcategory) {
        const subcategories = Array.isArray(criteria.subcategory) ? criteria.subcategory : [criteria.subcategory];
        if (!link.subcategory || !subcategories.includes(link.subcategory)) {
          return false;
        }
      }

      // Tags filter (link must have at least one matching tag)
      if (criteria.tags) {
        const searchTags = Array.isArray(criteria.tags) ? criteria.tags : [criteria.tags];
        const hasMatchingTag = searchTags.some(tag =>
          link.tags.some(linkTag => linkTag.toLowerCase() === tag.toLowerCase())
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Favorite filter
      if (criteria.favorite !== undefined && link.favorite !== criteria.favorite) {
        return false;
      }

      // Date range filter
      if (criteria.dateFrom && link.dateAdded < criteria.dateFrom) {
        return false;
      }
      if (criteria.dateTo && link.dateAdded > criteria.dateTo) {
        return false;
      }

      // Life area filter
      if (criteria.lifeArea) {
        const lifeAreas = Array.isArray(criteria.lifeArea) ? criteria.lifeArea : [criteria.lifeArea];
        if (!link.lifeArea || !lifeAreas.includes(link.lifeArea)) {
          return false;
        }
      }

      // Person filter
      if (criteria.person) {
        const persons = Array.isArray(criteria.person) ? criteria.person : [criteria.person];
        if (!link.person || !persons.some(p => link.person?.toLowerCase().includes(p.toLowerCase()))) {
          return false;
        }
      }

      // Project filter
      if (criteria.project) {
        const projects = Array.isArray(criteria.project) ? criteria.project : [criteria.project];
        if (!link.project || !projects.some(p => link.project?.toLowerCase().includes(p.toLowerCase()))) {
          return false;
        }
      }

      // Priority filter
      if (criteria.priority) {
        const priorities = Array.isArray(criteria.priority) ? criteria.priority : [criteria.priority];
        if (!link.priority || !priorities.includes(link.priority)) {
          return false;
        }
      }

      // Status filter
      if (criteria.status) {
        const statuses = Array.isArray(criteria.status) ? criteria.status : [criteria.status];
        if (!link.status || !statuses.includes(link.status)) {
          return false;
        }
      }

      // Due date range filter
      if (criteria.dueDateFrom && (!link.dueDate || link.dueDate < criteria.dueDateFrom)) {
        return false;
      }
      if (criteria.dueDateTo && (!link.dueDate || link.dueDate > criteria.dueDateTo)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Filter links by category
   */
  filterByCategory(category: string): Link[] {
    return this.search({ category });
  }

  /**
   * Filter links by type
   */
  filterByType(type: Link['type']): Link[] {
    return this.search({ type });
  }

  /**
   * Filter links by tag(s)
   */
  filterByTags(tags: string | string[]): Link[] {
    return this.search({ tags });
  }

  /**
   * Get all favorite links
   */
  getFavorites(): Link[] {
    return this.search({ favorite: true });
  }

  /**
   * Sort links (enhanced with priority and dueDate)
   */
  sort(links: Link[], sortBy: SortBy = 'dateAdded', order: SortOrder = 'desc'): Link[] {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

    const sorted = [...links].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dateAdded':
          comparison = a.dateAdded.localeCompare(b.dateAdded);
          break;
        case 'lastModified':
          comparison = a.lastModified.localeCompare(b.lastModified);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'priority':
          const aPriority = a.priority ? priorityOrder[a.priority] : 999;
          const bPriority = b.priority ? priorityOrder[b.priority] : 999;
          comparison = aPriority - bPriority;
          break;
        case 'dueDate':
          const aDate = a.dueDate || '9999-12-31';
          const bDate = b.dueDate || '9999-12-31';
          comparison = aDate.localeCompare(bDate);
          break;
        case 'lifeArea':
          const aArea = a.lifeArea || 'zzz';
          const bArea = b.lifeArea || 'zzz';
          comparison = aArea.localeCompare(bArea);
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Get all unique categories
   */
  getCategories(): string[] {
    const categories = new Set(this.links.map(link => link.category));
    return Array.from(categories).sort();
  }

  /**
   * Get all unique tags
   */
  getTags(): string[] {
    const tags = new Set<string>();
    this.links.forEach(link => link.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }

  /**
   * Get statistics about the link collection
   */
  getStats(): {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    favorites: number;
  } {
    const stats = {
      total: this.links.length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      favorites: this.links.filter(l => l.favorite).length,
    };

    this.links.forEach(link => {
      stats.byType[link.type] = (stats.byType[link.type] || 0) + 1;
      stats.byCategory[link.category] = (stats.byCategory[link.category] || 0) + 1;
    });

    return stats;
  }

  /**
   * Export links to JSON
   */
  exportToJson(filePath: string, links?: Link[]): void {
    const dataToExport = links || this.links;
    fs.writeFileSync(filePath, JSON.stringify(dataToExport, null, 2), 'utf-8');
    this.logger.info(`Exported ${dataToExport.length} links to ${filePath}`);
  }

  /**
   * Export links to CSV
   */
  exportToCsv(filePath: string, links?: Link[]): void {
    const dataToExport = links || this.links;

    if (dataToExport.length === 0) {
      fs.writeFileSync(filePath, 'No links to export', 'utf-8');
      return;
    }

    const headers = ['ID', 'Title', 'URL', 'Type', 'Category', 'Tags', 'Notes', 'Favorite', 'Date Added', 'Last Modified'];
    const rows = dataToExport.map(link => [
      link.id,
      `"${link.title.replace(/"/g, '""')}"`,
      `"${link.url}"`,
      link.type,
      link.category,
      `"${link.tags.join(', ')}"`,
      link.notes ? `"${link.notes.replace(/"/g, '""')}"` : '',
      link.favorite ? 'Yes' : 'No',
      link.dateAdded,
      link.lastModified,
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    fs.writeFileSync(filePath, csv, 'utf-8');
    this.logger.info(`Exported ${dataToExport.length} links to CSV: ${filePath}`);
  }

  /**
   * Import links from JSON file
   */
  importFromJson(filePath: string, merge: boolean = false): number {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const importedLinks: Link[] = JSON.parse(data);

      if (!Array.isArray(importedLinks)) {
        throw new Error('Invalid JSON format: expected array of links');
      }

      if (merge) {
        // Merge: add only new links (check by URL)
        const existingUrls = new Set(this.links.map(l => l.url));
        const newLinks = importedLinks.filter(link => !existingUrls.has(link.url));
        this.links.push(...newLinks);
        this.saveLinks();
        this.logger.info(`Imported ${newLinks.length} new links (merged)`);
        return newLinks.length;
      } else {
        // Replace all links
        this.links = importedLinks;
        this.saveLinks();
        this.logger.info(`Imported ${importedLinks.length} links (replaced)`);
        return importedLinks.length;
      }
    } catch (error) {
      this.logger.error('Error importing links', error);
      throw new Error('Failed to import links');
    }
  }

  /**
   * Clear all links (use with caution!)
   */
  clearAll(): void {
    this.links = [];
    this.saveLinks();
    this.logger.warn('All links cleared');
  }

  /**
   * Get total count of links
   */
  getCount(): number {
    return this.links.length;
  }

  // ============ SECOND BRAIN FEATURES ============

  /**
   * Quick filter: Get links for a specific life area
   */
  getByLifeArea(lifeArea: Link['lifeArea']): Link[] {
    return this.search({ lifeArea });
  }

  /**
   * Quick filter: Get links for a specific person (e.g., "daughter")
   */
  getByPerson(person: string): Link[] {
    return this.search({ person });
  }

  /**
   * Quick filter: Get links for a specific project
   */
  getByProject(project: string): Link[] {
    return this.search({ project });
  }

  /**
   * Quick filter: Get links by status
   */
  getByStatus(status: Link['status']): Link[] {
    return this.search({ status });
  }

  /**
   * Quick filter: Get high priority items (critical and high)
   */
  getHighPriority(): Link[] {
    return this.search({ priority: ['critical', 'high'] });
  }

  /**
   * Quick filter: Get items due soon (within next N days)
   */
  getDueSoon(daysAhead: number = 7): Link[] {
    const now = new Date();
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    return this.search({
      dueDateFrom: now.toISOString(),
      dueDateTo: future.toISOString(),
    });
  }

  /**
   * Quick filter: Get overdue items
   */
  getOverdue(): Link[] {
    const now = new Date().toISOString();

    return this.links.filter(link => {
      return link.dueDate && link.dueDate < now && link.status !== 'completed' && link.status !== 'archived';
    });
  }

  /**
   * Quick filter: Get items to review
   */
  getToReview(): Link[] {
    return this.search({ status: 'to-review' });
  }

  /**
   * Quick filter: Get recently added links (last N days)
   */
  getRecentlyAdded(days: number = 7): Link[] {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    return this.search({ dateFrom: cutoff });
  }

  /**
   * Full-text search across all fields
   */
  fullTextSearch(searchTerm: string): Link[] {
    return this.search({ fullText: searchTerm });
  }

  /**
   * Get all unique persons
   */
  getPersons(): string[] {
    const persons = new Set<string>();
    this.links.forEach(link => {
      if (link.person) persons.add(link.person);
    });
    return Array.from(persons).sort();
  }

  /**
   * Get all unique projects
   */
  getProjects(): string[] {
    const projects = new Set<string>();
    this.links.forEach(link => {
      if (link.project) projects.add(link.project);
    });
    return Array.from(projects).sort();
  }

  /**
   * Get all unique life areas
   */
  getLifeAreas(): string[] {
    const areas = new Set<string>();
    this.links.forEach(link => {
      if (link.lifeArea) areas.add(link.lifeArea);
    });
    return Array.from(areas).sort();
  }

  // ============ SMART COLLECTIONS ============

  /**
   * Create a smart collection (saved search)
   */
  createSmartCollection(name: string, criteria: SearchCriteria, description?: string): SmartCollection {
    const collection: SmartCollection = {
      id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      criteria,
      dateCreated: new Date().toISOString(),
    };

    this.smartCollections.push(collection);
    this.saveCollections();
    this.logger.info(`Created smart collection: ${name}`);
    return collection;
  }

  /**
   * Get all smart collections
   */
  getSmartCollections(): SmartCollection[] {
    return [...this.smartCollections];
  }

  /**
   * Get links from a smart collection
   */
  getCollectionLinks(collectionId: string): Link[] | null {
    const collection = this.smartCollections.find(c => c.id === collectionId);
    if (!collection) {
      this.logger.warn(`Collection not found: ${collectionId}`);
      return null;
    }

    return this.search(collection.criteria);
  }

  /**
   * Delete a smart collection
   */
  deleteSmartCollection(collectionId: string): boolean {
    const index = this.smartCollections.findIndex(c => c.id === collectionId);
    if (index === -1) {
      this.logger.warn(`Collection not found: ${collectionId}`);
      return false;
    }

    this.smartCollections.splice(index, 1);
    this.saveCollections();
    this.logger.info('Smart collection deleted');
    return true;
  }

  // ============ RELATED LINKS ============

  /**
   * Add a related link connection
   */
  addRelatedLink(linkId: string, relatedLinkId: string): boolean {
    const link = this.getLinkById(linkId);
    if (!link) return false;

    if (!link.relatedLinks) {
      link.relatedLinks = [];
    }

    if (!link.relatedLinks.includes(relatedLinkId)) {
      link.relatedLinks.push(relatedLinkId);
      this.saveLinks();
      this.logger.info(`Added related link: ${relatedLinkId} to ${linkId}`);
      return true;
    }

    return false;
  }

  /**
   * Get related links for a link
   */
  getRelatedLinks(linkId: string): Link[] {
    const link = this.getLinkById(linkId);
    if (!link || !link.relatedLinks) {
      return [];
    }

    return link.relatedLinks
      .map(id => this.getLinkById(id))
      .filter(l => l !== null) as Link[];
  }

  /**
   * Remove a related link connection
   */
  removeRelatedLink(linkId: string, relatedLinkId: string): boolean {
    const link = this.getLinkById(linkId);
    if (!link || !link.relatedLinks) return false;

    const index = link.relatedLinks.indexOf(relatedLinkId);
    if (index > -1) {
      link.relatedLinks.splice(index, 1);
      this.saveLinks();
      this.logger.info(`Removed related link: ${relatedLinkId} from ${linkId}`);
      return true;
    }

    return false;
  }

  // ============ DASHBOARD / QUICK ACCESS ============

  /**
   * Get dashboard summary with key information
   */
  getDashboard(): {
    totalLinks: number;
    favorites: number;
    toReview: number;
    highPriority: number;
    dueSoon: number;
    overdue: number;
    byLifeArea: Record<string, number>;
    byProject: Record<string, number>;
    recentlyAdded: Link[];
  } {
    const byLifeArea: Record<string, number> = {};
    const byProject: Record<string, number> = {};

    this.links.forEach(link => {
      if (link.lifeArea) {
        byLifeArea[link.lifeArea] = (byLifeArea[link.lifeArea] || 0) + 1;
      }
      if (link.project) {
        byProject[link.project] = (byProject[link.project] || 0) + 1;
      }
    });

    return {
      totalLinks: this.links.length,
      favorites: this.getFavorites().length,
      toReview: this.getToReview().length,
      highPriority: this.getHighPriority().length,
      dueSoon: this.getDueSoon(7).length,
      overdue: this.getOverdue().length,
      byLifeArea,
      byProject,
      recentlyAdded: this.getRecentlyAdded(7),
    };
  }

  /**
   * Get enhanced statistics with second brain metrics
   */
  getEnhancedStats(): {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    byLifeArea: Record<string, number>;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    favorites: number;
    withDueDates: number;
    overdue: number;
  } {
    const stats = {
      total: this.links.length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byLifeArea: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      favorites: this.links.filter(l => l.favorite).length,
      withDueDates: this.links.filter(l => l.dueDate).length,
      overdue: this.getOverdue().length,
    };

    this.links.forEach(link => {
      stats.byType[link.type] = (stats.byType[link.type] || 0) + 1;
      stats.byCategory[link.category] = (stats.byCategory[link.category] || 0) + 1;

      if (link.lifeArea) {
        stats.byLifeArea[link.lifeArea] = (stats.byLifeArea[link.lifeArea] || 0) + 1;
      }
      if (link.priority) {
        stats.byPriority[link.priority] = (stats.byPriority[link.priority] || 0) + 1;
      }
      if (link.status) {
        stats.byStatus[link.status] = (stats.byStatus[link.status] || 0) + 1;
      }
    });

    return stats;
  }
}
