/**
 * 请求管理器 - 防止重复请求并缓存结果
 */

type RequestPromise<T = unknown> = Promise<T>;

class RequestManager {
  private pendingRequests: Map<string, RequestPromise> = new Map();
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5分钟缓存

  /**
   * 执行请求，自动去重和缓存
   * @param key 请求的唯一标识
   * @param fetcher 实际的请求函数
   * @param useCache 是否使用缓存
   */
  async request<T>(
    key: string,
    fetcher: () => Promise<T>,
    useCache: boolean = true
  ): Promise<T> {
    // 1. 检查是否有正在进行的相同请求
    const pending = this.pendingRequests.get(key) as Promise<T> | undefined;
    if (pending) {
      console.log(`[RequestManager] 请求 ${key} 正在进行中，等待结果...`);
      return pending;
    }

    // 2. 检查缓存
    if (useCache) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`[RequestManager] 使用缓存的 ${key} 数据`);
        return cached.data as T;
      }
    }

    // 3. 发起新请求
    console.log(`[RequestManager] 发起新请求: ${key}`);
    const promise = fetcher()
      .then((data) => {
        // 缓存结果
        if (useCache) {
          this.cache.set(key, { data, timestamp: Date.now() });
        }
        return data;
      })
      .finally(() => {
        // 清除pending状态
        this.pendingRequests.delete(key);
      });

    // 标记为pending
    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * 清除指定的缓存
   */
  clearCache(key?: string) {
    if (key) {
      this.cache.delete(key);
      console.log(`[RequestManager] 清除缓存: ${key}`);
    } else {
      this.cache.clear();
      console.log(`[RequestManager] 清除所有缓存`);
    }
  }

  /**
   * 强制刷新 - 清除缓存并重新请求
   */
  async refresh<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    this.clearCache(key);
    return this.request(key, fetcher, false);
  }
}

// 导出单例
export const requestManager = new RequestManager();