import { getRedisClient, isRedisConnected } from '../config/redis.js';

// In-memory fallback
const memoryCache = new Map();

export const setCache = async (key, data, ttl = 3600) => {
  try {
    if (isRedisConnected()) {
      const redis = getRedisClient();
      await redis.setex(key, ttl, JSON.stringify(data));
    } else {
      // Fallback to memory
      memoryCache.set(key, { data, expiry: Date.now() + ttl * 1000 });
    }
  } catch (error) {
    console.error('Cache set error:', error.message);
    memoryCache.set(key, { data, expiry: Date.now() + ttl * 1000 });
  }
};

export const getCache = async (key) => {
  try {
    if (isRedisConnected()) {
      const redis = getRedisClient();
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } else {
      // Fallback to memory
      const item = memoryCache.get(key);
      if (item && item.expiry > Date.now()) {
        return item.data;
      }
      memoryCache.delete(key);
      return null;
    }
  } catch (error) {
    console.error('Cache get error:', error.message);
    return null;
  }
};