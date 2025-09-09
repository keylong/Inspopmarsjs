'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trackCustomEvent } from '@/lib/analytics';

interface MonitoringStats {
  totalDownloads: number;
  successRate: number;
  avgResponseTime: number;
  activeUsers: number;
  errorCount: number;
  topErrors: Array<{
    message: string;
    count: number;
  }>;
  performanceMetrics: {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
  };
}

export function MonitoringDashboard() {
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟获取监控数据
    const fetchMonitoringStats = async () => {
      try {
        // 这里应该是真实的 API 调用
        // const response = await fetch('/api/monitoring/stats');
        // const data = await response.json();
        
        // 模拟数据
        const mockData: MonitoringStats = {
          totalDownloads: 15420,
          successRate: 94.2,
          avgResponseTime: 320,
          activeUsers: 142,
          errorCount: 12,
          topErrors: [
            { message: 'Network timeout', count: 5 },
            { message: 'Invalid Instagram URL', count: 4 },
            { message: 'Rate limit exceeded', count: 3 },
          ],
          performanceMetrics: {
            fcp: 1200,
            lcp: 2100,
            cls: 0.1,
            fid: 50,
          },
        };
        
        setStats(mockData);
        
        // 记录仪表板访问
        trackCustomEvent({
          name: 'dashboard_view',
          properties: {
            section: 'monitoring',
          },
        });
        
      } catch (error) {
        console.error('Failed to fetch monitoring stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonitoringStats();
    
    // 定期刷新数据 (每30秒)
    const interval = setInterval(fetchMonitoringStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">无法加载监控数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 核心指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总下载量</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20m5-5H7" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均响应时间</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              -15ms from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 性能指标 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>性能指标 (Core Web Vitals)</CardTitle>
            <CardDescription>
              关键性能指标追踪
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">First Contentful Paint (FCP)</span>
              <span className={`text-sm font-medium ${stats.performanceMetrics.fcp < 1800 ? 'text-green-600' : 'text-orange-600'}`}>
                {stats.performanceMetrics.fcp}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Largest Contentful Paint (LCP)</span>
              <span className={`text-sm font-medium ${stats.performanceMetrics.lcp < 2500 ? 'text-green-600' : 'text-orange-600'}`}>
                {stats.performanceMetrics.lcp}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cumulative Layout Shift (CLS)</span>
              <span className={`text-sm font-medium ${stats.performanceMetrics.cls < 0.1 ? 'text-green-600' : 'text-orange-600'}`}>
                {stats.performanceMetrics.cls}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">First Input Delay (FID)</span>
              <span className={`text-sm font-medium ${stats.performanceMetrics.fid < 100 ? 'text-green-600' : 'text-orange-600'}`}>
                {stats.performanceMetrics.fid}ms
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>错误统计</CardTitle>
            <CardDescription>
              最近24小时错误情况
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">总错误数</span>
                <span className="text-2xl font-bold text-red-600">{stats.errorCount}</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">主要错误类型</h4>
                {stats.topErrors.map((error, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{error.message}</span>
                    <span className="font-medium">{error.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 实时状态 */}
      <Card>
        <CardHeader>
          <CardTitle>实时状态</CardTitle>
          <CardDescription>
            系统服务状态监控
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">API 服务</span>
              <span className="text-sm text-green-600 font-medium">正常</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">下载服务</span>
              <span className="text-sm text-green-600 font-medium">正常</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">图像处理</span>
              <span className="text-sm text-orange-600 font-medium">降级</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}