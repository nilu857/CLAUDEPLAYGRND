import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Data Manager for loading and managing test data
 */
export class TestDataManager {
  private static instance: TestDataManager;
  private dataCache: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  /**
   * Load test data from JSON file
   */
  loadData<T = any>(fileName: string): T {
    if (this.dataCache.has(fileName)) {
      return this.dataCache.get(fileName);
    }

    const dataPath = path.join(__dirname, fileName);
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    this.dataCache.set(fileName, data);
    return data;
  }

  /**
   * Load test data by key from a file
   */
  loadDataByKey<T = any>(fileName: string, key: string): T {
    const data = this.loadData(fileName);
    return data[key];
  }

  /**
   * Save test data to JSON file
   */
  saveData(fileName: string, data: any): void {
    const dataPath = path.join(__dirname, fileName);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    this.dataCache.set(fileName, data);
  }

  /**
   * Clear data cache
   */
  clearCache(): void {
    this.dataCache.clear();
  }

  /**
   * Get data from cache
   */
  getCachedData<T = any>(key: string): T | undefined {
    return this.dataCache.get(key);
  }

  /**
   * Set data in cache
   */
  setCachedData(key: string, data: any): void {
    this.dataCache.set(key, data);
  }
}
