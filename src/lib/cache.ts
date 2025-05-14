/**
 * A simple in-memory cache for storing search results
 */
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class SearchCache<T> {
  private cache: Record<string, CacheItem<T>> = {};
  private readonly maxAge: number; // Cache expiry in milliseconds

  /**
   * Create a new cache instance
   * @param maxAgeMinutes Maximum age of cache items in minutes
   */
  constructor(maxAgeMinutes: number = 30) {
    this.maxAge = maxAgeMinutes * 60 * 1000;
  }

  /**
   * Generate a cache key from search parameters
   */
  private generateKey(academicYear: string, yearOfStudy: string, namePrefix: string): string {
    return `${academicYear}|${yearOfStudy}|${namePrefix.toLowerCase()}`;
  }

  /**
   * Set a value in the cache
   */
  set(academicYear: string, yearOfStudy: string, namePrefix: string, data: T): void {
    const key = this.generateKey(academicYear, yearOfStudy, namePrefix);
    this.cache[key] = {
      data,
      timestamp: Date.now()
    };
  }

  /**
   * Get a value from the cache
   * @returns The cached data or null if not found or expired
   */
  get(academicYear: string, yearOfStudy: string, namePrefix: string): T | null {
    const key = this.generateKey(academicYear, yearOfStudy, namePrefix);
    const item = this.cache[key];

    if (!item) {
      return null;
    }

    // Check if the cache item has expired
    if (Date.now() - item.timestamp > this.maxAge) {
      delete this.cache[key];
      return null;
    }

    return item.data;
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache = {};
  }

  /**
   * Clear expired items from the cache
   */
  clearExpired(): void {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      if (now - this.cache[key].timestamp > this.maxAge) {
        delete this.cache[key];
      }
    });
  }
}

// Export a singleton instance
export const searchCache = new SearchCache<any>();
