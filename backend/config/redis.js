import Redis from 'ioredis';

let client = null;
let isConnected = false;

export const initRedis = async () => {
  try {
    client = new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => {
        if (times > 3) {
          console.log('Redis: Max retries reached, using fallback');
          return null;
        }
        return Math.min(times * 200, 2000);
      }
    });

    client.on('error', (err) => {
      console.error('Redis error:', err.message);
      isConnected = false;
    });

    client.on('connect', () => {
      console.log('Redis connected');
      isConnected = true;
    });

    client.on('ready', () => {
      isConnected = true;
    });

    await client.ping();
  } catch (error) {
    console.error('Redis connection failed:', error.message);
    console.log('⚠️ Using in-memory cache fallback');
    isConnected = false;
  }
};

export const getRedisClient = () => client;
export const isRedisConnected = () => isConnected;