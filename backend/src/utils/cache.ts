/**
 * Simple in-memory cache using node-cache
 * For production, consider Redis or similar
 */

import NodeCache from 'node-cache';

/**
 * Cache instance with 5 minute default TTL
 */
export const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone objects (better performance)
});

/**
 * Cache keys
 */
export const CACHE_KEYS = {
  TESTIMONIALS: 'testimonials:approved',
  DONATIONS: 'donations:public',
  DIARY_PREFIX: 'diary:',
  USER_PREFIX: 'user:',
};

/**
 * Get value from cache
 */
export const getCache = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

/**
 * Set value in cache
 */
export const setCache = <T>(key: string, value: T, ttl?: number): boolean => {
  return cache.set(key, value, ttl || 300);
};

/**
 * Delete value from cache
 */
export const deleteCache = (key: string): boolean => {
  return cache.del(key) > 0;
};

/**
 * Clear cache by pattern
 */
export const clearCacheByPattern = (pattern: string): void => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.startsWith(pattern));
  matchingKeys.forEach(key => cache.del(key));
};

/**
 * Clear all cache
 */
export const clearAllCache = (): void => {
  cache.flushAll();
};
