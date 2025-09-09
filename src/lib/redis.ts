import Redis from 'ioredis';

// Redis 配置
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  
  // 连接池配置
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true,
  
  // 连接超时配置
  connectTimeout: 5000,
  commandTimeout: 5000,
};

// 创建 Redis 实例
let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redis) {
    return redis;
  }

  try {
    // 在生产环境或明确启用 Redis 时才连接
    if (process.env.NODE_ENV === 'production' || process.env.REDIS_ENABLED === 'true') {
      redis = new Redis(redisConfig);
      
      redis.on('error', (error) => {
        console.error('Redis connection error:', error);
      });
      
      redis.on('connect', () => {
        console.log('Connected to Redis');
      });
      
      return redis;
    }
  } catch (error) {
    console.error('Failed to create Redis client:', error);
  }
  
  return null;
}

// 缓存接口
export class CacheService {
  private redis: Redis | null;
  
  constructor() {
    this.redis = getRedisClient();
  }
  
  /**
   * 获取缓存值
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (!this.redis) {
      return null;
    }
    
    try {
      const value = await this.redis.get(key);
      if (!value) {
        return null;
      }
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }
  
  /**
   * 设置缓存值
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.redis) {
      return false;
    }
    
    try {
      const serialized = JSON.stringify(value);
      
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
      
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }
  
  /**
   * 删除缓存
   */
  async del(key: string | string[]): Promise<boolean> {
    if (!this.redis) {
      return false;
    }
    
    try {
      const keys = Array.isArray(key) ? key : [key];
      await this.redis.del(...keys);
      return true;
    } catch (error) {
      console.error(`Cache delete error for key(s) ${key}:`, error);
      return false;
    }
  }
  
  /**
   * 检查缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    if (!this.redis) {
      return false;
    }
    
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists check error for key ${key}:`, error);
      return false;
    }
  }
  
  /**
   * 设置过期时间
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.redis) {
      return false;
    }
    
    try {
      const result = await this.redis.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }
  
  /**
   * 批量获取
   */
  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    if (!this.redis || keys.length === 0) {
      return keys.map(() => null);
    }
    
    try {
      const values = await this.redis.mget(...keys);
      return values.map(value => {
        if (!value) return null;
        try {
          return JSON.parse(value) as T;
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.error(`Cache mget error for keys ${keys.join(', ')}:`, error);
      return keys.map(() => null);
    }
  }
  
  /**
   * 批量设置
   */
  async mset(keyValuePairs: Record<string, any>, ttlSeconds?: number): Promise<boolean> {
    if (!this.redis) {
      return false;
    }
    
    try {
      const pipeline = this.redis.pipeline();
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serialized = JSON.stringify(value);
        if (ttlSeconds) {
          pipeline.setex(key, ttlSeconds, serialized);
        } else {
          pipeline.set(key, serialized);
        }
      }
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error(`Cache mset error:`, error);
      return false;
    }
  }
  
  /**
   * 增加数值
   */
  async incr(key: string, increment: number = 1): Promise<number> {
    if (!this.redis) {
      return increment;
    }
    
    try {
      if (increment === 1) {
        return await this.redis.incr(key);
      } else {
        return await this.redis.incrby(key, increment);
      }
    } catch (error) {
      console.error(`Cache incr error for key ${key}:`, error);
      return increment;
    }
  }
  
  /**
   * 获取所有匹配的键
   */
  async keys(pattern: string): Promise<string[]> {
    if (!this.redis) {
      return [];
    }
    
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error(`Cache keys error for pattern ${pattern}:`, error);
      return [];
    }
  }
}

// 导出单例实例
export const cache = new CacheService();