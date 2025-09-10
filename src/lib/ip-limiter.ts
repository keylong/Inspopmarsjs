/**
 * IP限制管理工具
 * 未登录用户每个IP地址24小时内最多下载3次
 */

interface IPRecord {
  ip: string;
  downloadCount: number;
  firstDownloadTime: number; // 时间戳
  lastDownloadTime: number;  // 时间戳
}

class IPLimiter {
  private records: Map<string, IPRecord> = new Map();
  private readonly MAX_DOWNLOADS = 3;
  private readonly TIME_WINDOW = 24 * 60 * 60 * 1000; // 24小时（毫秒）
  
  constructor() {
    // 每小时清理一次过期记录
    setInterval(() => {
      this.cleanupExpiredRecords();
    }, 60 * 60 * 1000);
  }

  /**
   * 检查IP是否可以下载
   */
  canDownload(ip: string): { allowed: boolean; remainingDownloads: number; resetTime?: number } {
    const now = Date.now();
    const record = this.records.get(ip);

    if (!record) {
      // 新IP，允许下载
      return {
        allowed: true,
        remainingDownloads: this.MAX_DOWNLOADS - 1
      };
    }

    // 检查时间窗口是否已过期
    const timeSinceFirst = now - record.firstDownloadTime;
    if (timeSinceFirst >= this.TIME_WINDOW) {
      // 时间窗口过期，重置计数
      return {
        allowed: true,
        remainingDownloads: this.MAX_DOWNLOADS - 1
      };
    }

    // 在时间窗口内，检查下载次数
    if (record.downloadCount >= this.MAX_DOWNLOADS) {
      const resetTime = record.firstDownloadTime + this.TIME_WINDOW;
      return {
        allowed: false,
        remainingDownloads: 0,
        resetTime: resetTime
      };
    }

    // 允许下载
    return {
      allowed: true,
      remainingDownloads: this.MAX_DOWNLOADS - record.downloadCount - 1
    };
  }

  /**
   * 记录一次下载
   */
  recordDownload(ip: string): void {
    const now = Date.now();
    const record = this.records.get(ip);

    if (!record) {
      // 新记录
      this.records.set(ip, {
        ip,
        downloadCount: 1,
        firstDownloadTime: now,
        lastDownloadTime: now
      });
      console.log(`IP ${ip} 首次下载记录，剩余次数: ${this.MAX_DOWNLOADS - 1}`);
      return;
    }

    // 检查时间窗口是否已过期
    const timeSinceFirst = now - record.firstDownloadTime;
    if (timeSinceFirst >= this.TIME_WINDOW) {
      // 时间窗口过期，重置计数
      this.records.set(ip, {
        ip,
        downloadCount: 1,
        firstDownloadTime: now,
        lastDownloadTime: now
      });
      console.log(`IP ${ip} 时间窗口重置，剩余次数: ${this.MAX_DOWNLOADS - 1}`);
      return;
    }

    // 更新记录
    record.downloadCount += 1;
    record.lastDownloadTime = now;
    console.log(`IP ${ip} 下载计数更新: ${record.downloadCount}/${this.MAX_DOWNLOADS}`);
  }

  /**
   * 获取IP的当前状态
   */
  getIPStatus(ip: string): { downloadCount: number; remainingDownloads: number; resetTime?: number } {
    const now = Date.now();
    const record = this.records.get(ip);

    if (!record) {
      return {
        downloadCount: 0,
        remainingDownloads: this.MAX_DOWNLOADS
      };
    }

    // 检查时间窗口是否已过期
    const timeSinceFirst = now - record.firstDownloadTime;
    if (timeSinceFirst >= this.TIME_WINDOW) {
      return {
        downloadCount: 0,
        remainingDownloads: this.MAX_DOWNLOADS
      };
    }

    const resetTime = record.firstDownloadTime + this.TIME_WINDOW;
    return {
      downloadCount: record.downloadCount,
      remainingDownloads: Math.max(0, this.MAX_DOWNLOADS - record.downloadCount),
      resetTime: resetTime
    };
  }

  /**
   * 清理过期记录
   */
  private cleanupExpiredRecords(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [ip, record] of this.records.entries()) {
      const timeSinceFirst = now - record.firstDownloadTime;
      if (timeSinceFirst >= this.TIME_WINDOW) {
        this.records.delete(ip);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`清理了 ${cleanedCount} 个过期的IP记录`);
    }
  }

  /**
   * 获取统计信息（调试用）
   */
  getStats(): { totalIPs: number; activeIPs: number } {
    const now = Date.now();
    let activeCount = 0;

    for (const record of this.records.values()) {
      const timeSinceFirst = now - record.firstDownloadTime;
      if (timeSinceFirst < this.TIME_WINDOW) {
        activeCount++;
      }
    }

    return {
      totalIPs: this.records.size,
      activeIPs: activeCount
    };
  }
}

// 创建全局实例
export const ipLimiter = new IPLimiter();

// 获取客户端真实IP的工具函数
export function getClientIP(request: Request): string {
  // 尝试从不同的头部获取真实IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    // x-forwarded-for 可能包含多个IP，取第一个
    const firstIp = forwardedFor.split(',')[0];
    return firstIp ? firstIp.trim() : 'unknown';
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // 作为后备，返回一个默认值（实际部署时会有真实IP）
  return '127.0.0.1';
}