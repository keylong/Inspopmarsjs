import { NextRequest, NextResponse } from 'next/server';
import { cache } from './redis';
import { createHash } from 'crypto';

interface CacheOptions {
  /**
   * 缓存过期时间（秒）
   */
  ttl?: number;
  
  /**
   * 缓存键前缀
   */
  keyPrefix?: string;
  
  /**
   * 是否根据用户ID缓存
   */
  userSpecific?: boolean;
  
  /**
   * 是否根据查询参数缓存
   */
  includeQuery?: boolean;
  
  /**
   * 跳过缓存的条件
   */
  skipCache?: (request: NextRequest) => boolean;
  
  /**
   * 自定义缓存键生成器
   */
  keyGenerator?: (request: NextRequest, userId?: string) => string;
}

/**
 * 生成缓存键
 */
function generateCacheKey(
  request: NextRequest, 
  options: CacheOptions,
  userId?: string
): string {
  if (options.keyGenerator) {
    return options.keyGenerator(request, userId);
  }
  
  const { pathname, searchParams } = request.nextUrl;
  const prefix = options.keyPrefix || 'api';
  
  let key = `${prefix}:${pathname}`;
  
  if (options.userSpecific && userId) {
    key += `:user:${userId}`;
  }
  
  if (options.includeQuery && searchParams.toString()) {
    const sortedParams = Array.from(searchParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    
    // 使用 hash 避免键过长
    const hash = createHash('md5').update(sortedParams).digest('hex');
    key += `:query:${hash}`;
  }
  
  return key;
}

/**
 * API 缓存中间件
 */
export function withCache(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: CacheOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const {
      ttl = 300, // 默认5分钟
      skipCache,
      userSpecific = false,
    } = options;
    
    // 检查是否跳过缓存
    if (skipCache && skipCache(request)) {
      return handler(request);
    }
    
    // 只缓存 GET 请求
    if (request.method !== 'GET') {
      return handler(request);
    }
    
    try {
      // 获取用户ID（如果需要）
      let userId: string | undefined;
      if (userSpecific) {
        // 这里需要根据实际的认证方式获取用户ID
        const authHeader = request.headers.get('authorization');
        // userId = extractUserIdFromAuth(authHeader);
      }
      
      const cacheKey = generateCacheKey(request, options, userId);
      
      // 尝试从缓存获取
      const cachedResponse = await cache.get<{
        data: any;
        status: number;
        headers: Record<string, string>;
      }>(cacheKey);
      
      if (cachedResponse) {
        // 返回缓存的响应
        return new NextResponse(JSON.stringify(cachedResponse.data), {
          status: cachedResponse.status,
          headers: {
            ...cachedResponse.headers,
            'X-Cache': 'HIT',
            'Content-Type': 'application/json',
          },
        });
      }
      
      // 执行原始处理器
      const response = await handler(request);
      
      // 只缓存成功的响应
      if (response.status === 200) {
        try {
          const responseData = await response.json();
          
          // 存储到缓存
          await cache.set(
            cacheKey,
            {
              data: responseData,
              status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
            },
            ttl
          );
          
          // 返回新的响应
          return new NextResponse(JSON.stringify(responseData), {
            status: response.status,
            headers: {
              ...Object.fromEntries(response.headers.entries()),
              'X-Cache': 'MISS',
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to cache response:', error);
          return response;
        }
      }
      
      return response;
    } catch (error) {
      console.error('Cache middleware error:', error);
      // 缓存错误时回退到原始处理器
      return handler(request);
    }
  };
}

/**
 * 页面缓存中间件
 */
export function withPageCache(
  handler: () => Promise<any>,
  options: {
    key: string;
    ttl?: number;
  }
) {
  return async () => {
    const { key, ttl = 300 } = options;
    
    try {
      // 尝试从缓存获取
      const cachedData = await cache.get(key);
      
      if (cachedData) {
        return cachedData;
      }
      
      // 执行原始处理器
      const data = await handler();
      
      // 存储到缓存
      await cache.set(key, data, ttl);
      
      return data;
    } catch (error) {
      console.error('Page cache error:', error);
      // 缓存错误时回退到原始处理器
      return handler();
    }
  };
}

/**
 * 缓存预热工具
 */
export class CacheWarmer {
  /**
   * 预热 Instagram 内容缓存
   */
  static async warmInstagramCache(urls: string[]) {
    const promises = urls.map(async (url) => {
      const key = `instagram:content:${createHash('md5').update(url).digest('hex')}`;
      
      // 检查缓存是否存在
      const exists = await cache.exists(key);
      if (exists) {
        return;
      }
      
      try {
        // 这里可以预先获取内容并缓存
        // const content = await fetchInstagramContent(url);
        // await cache.set(key, content, 1800); // 30分钟
      } catch (error) {
        console.error(`Failed to warm cache for ${url}:`, error);
      }
    });
    
    await Promise.allSettled(promises);
  }
  
  /**
   * 预热用户数据缓存
   */
  static async warmUserCache(userIds: string[]) {
    const promises = userIds.map(async (userId) => {
      const key = `user:profile:${userId}`;
      
      const exists = await cache.exists(key);
      if (exists) {
        return;
      }
      
      try {
        // 预先获取用户数据并缓存
        // const userData = await fetchUserData(userId);
        // await cache.set(key, userData, 600); // 10分钟
      } catch (error) {
        console.error(`Failed to warm user cache for ${userId}:`, error);
      }
    });
    
    await Promise.allSettled(promises);
  }
}

/**
 * 缓存失效工具
 */
export class CacheInvalidator {
  /**
   * 失效用户相关缓存
   */
  static async invalidateUserCache(userId: string) {
    const patterns = [
      `user:profile:${userId}`,
      `user:downloads:${userId}*`,
      `api:*:user:${userId}*`,
    ];
    
    for (const pattern of patterns) {
      const keys = await cache.keys(pattern);
      if (keys.length > 0) {
        await cache.del(keys);
      }
    }
  }
  
  /**
   * 失效内容缓存
   */
  static async invalidateContentCache(contentId: string) {
    const patterns = [
      `instagram:content:${contentId}`,
      `api:*:content:${contentId}*`,
    ];
    
    for (const pattern of patterns) {
      const keys = await cache.keys(pattern);
      if (keys.length > 0) {
        await cache.del(keys);
      }
    }
  }
}