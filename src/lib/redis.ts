import Redis, { RedisOptions } from 'ioredis';

// Redis 配置接口
interface RedisConfig extends RedisOptions {
  host: string;
  port: number;
  password?: string;
  db: number;
}

// Redis 配置
const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  db: parseInt(process.env.REDIS_DB || '0', 10),
  
  // 连接池配置
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: true,
  
  // 连接超时配置
  connectTimeout: 5000,
  commandTimeout: 5000,
  
  // 健康检查
  keepAlive: 30000,
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
      
      // 错误处理
      redis.on('error', (error: Error) => {
        console.error('Redis connection error:', {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      });
      
      // 连接成功
      redis.on('connect', () => {
        console.log('Redis 连接已建立');
      });
      
      // 重连事件
      redis.on('reconnecting', (time: number) => {
        console.log(`Redis 正在重连，延迟: ${time}ms`);
      });
      
      // 关闭事件
      redis.on('close', () => {
        console.log('Redis 连接已关闭');
      });
      
      return redis;
    }
    
    console.log('Redis 未启用，使用内存缓存模式');
  } catch (error: unknown) {
    console.error('Failed to create Redis client:', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
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
  async get<T = unknown>(key: string): Promise<T | null> {
    if (!key?.trim()) {
      console.warn('Cache get: 空的缓存键');
      return null;
    }
    
    if (!this.redis) {
      return null;
    }
    
    const trimmedKey = key.trim();
    
    try {
      const value = await this.redis.get(trimmedKey);
      if (!value) {
        return null;
      }
      
      try {
        return JSON.parse(value) as T;
      } catch (parseError: unknown) {
        console.error(`Cache parse error for key ${trimmedKey}:`, parseError);
        // 如果JSON解析失败，尝试返回原始字符串值
        return value as unknown as T;
      }
    } catch (error: unknown) {
      console.error(`Cache get error for key ${trimmedKey}:`, {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }
  
  /**
   * 设置缓存值
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
    if (!key?.trim()) {
      console.warn('Cache set: 空的缓存键');
      return false;
    }
    
    if (!this.redis) {
      return false;
    }
    
    const trimmedKey = key.trim();
    
    try {
      let serialized: string;
      
      // 尝试序列化值
      try {
        serialized = JSON.stringify(value);
      } catch (serializeError: unknown) {
        console.error(`Cache serialize error for key ${trimmedKey}:`, serializeError);
        return false;
      }
      
      // 检查值的大小（Redis单个值建议不超过512MB，这里设置为10MB限制）
      if (serialized.length > 10 * 1024 * 1024) {
        console.warn(`Cache value too large for key ${trimmedKey}: ${serialized.length} bytes`);
        return false;
      }
      
      if (ttlSeconds && ttlSeconds > 0) {
        await this.redis.setex(trimmedKey, Math.floor(ttlSeconds), serialized);
      } else {
        await this.redis.set(trimmedKey, serialized);
      }
      
      return true;
    } catch (error: unknown) {
      console.error(`Cache set error for key ${trimmedKey}:`, {
        error: error instanceof Error ? error.message : String(error),
        ttl: ttlSeconds,
        timestamp: new Date().toISOString()
      });
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
      const validKeys = keys.filter(k => k?.trim()).map(k => k.trim());
      
      if (validKeys.length === 0) {
        console.warn('Cache del: 没有有效的缓存键');
        return false;
      }
      
      await this.redis.del(...validKeys);
      return true;
    } catch (error: unknown) {
      console.error(`Cache delete error for key(s) ${JSON.stringify(key)}:`, {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }
  
  /**
   * 批量获取
   */
  async mget<T = unknown>(keys: string[]): Promise<(T | null)[]> {
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
    } catch (error: unknown) {
      console.error(`Cache mget error for keys ${keys.join(', ')}:`, error);
      return keys.map(() => null);
    }
  }
  
  /**
   * 批量设置
   */
  async mset(keyValuePairs: Record<string, unknown>, ttlSeconds?: number): Promise<boolean> {
    if (!this.redis) {
      return false;
    }
    
    if (!keyValuePairs || Object.keys(keyValuePairs).length === 0) {
      console.warn('Cache mset: 空的键值对对象');
      return false;
    }
    
    try {
      const pipeline = this.redis.pipeline();
      let validPairs = 0;
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        if (!key?.trim()) {
          console.warn(`Cache mset: 跳过空键: ${key}`);
          continue;
        }
        
        const trimmedKey = key.trim();
        
        try {
          const serialized = JSON.stringify(value);
          
          // 检查值的大小
          if (serialized.length > 10 * 1024 * 1024) {
            console.warn(`Cache mset: 值太大，跳过键 ${trimmedKey}: ${serialized.length} bytes`);
            continue;
          }
          
          if (ttlSeconds && ttlSeconds > 0) {
            pipeline.setex(trimmedKey, Math.floor(ttlSeconds), serialized);
          } else {
            pipeline.set(trimmedKey, serialized);
          }
          
          validPairs++;
        } catch (serializeError: unknown) {
          console.error(`Cache mset serialize error for key ${trimmedKey}:`, serializeError);
          continue;
        }
      }
      
      if (validPairs === 0) {
        console.warn('Cache mset: 没有有效的键值对');
        return false;
      }
      
      await pipeline.exec();
      return true;
    } catch (error: unknown) {
      console.error('Cache mset error:', {
        error: error instanceof Error ? error.message : String(error),
        keysCount: Object.keys(keyValuePairs).length,
        ttl: ttlSeconds,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }
  
  /**
   * 增加数值
   */
  async incr(key: string, increment: number = 1): Promise<number> {
    if (!key?.trim()) {
      console.warn('Cache incr: 空的缓存键');
      return increment;
    }
    
    if (!this.redis) {
      return increment;
    }
    
    const trimmedKey = key.trim();
    
    try {
      // 验证增量值
      if (!Number.isInteger(increment)) {
        console.warn(`Cache incr: 增量值必须是整数, got: ${increment}`);
        return increment;
      }
      
      if (increment === 1) {
        return await this.redis.incr(trimmedKey);
      } else {
        return await this.redis.incrby(trimmedKey, increment);
      }
    } catch (error: unknown) {
      console.error(`Cache incr error for key ${trimmedKey}:`, {
        error: error instanceof Error ? error.message : String(error),
        increment,
        timestamp: new Date().toISOString()
      });
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
    } catch (error: unknown) {
      console.error(`Cache keys error for pattern ${pattern}:`, error);
      return [];
    }
  }
}

// 导出单例实例
export const cache = new CacheService();