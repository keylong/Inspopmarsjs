import { NextRequest, NextResponse } from 'next/server';

// 模拟监控数据存储 (实际项目中应该使用数据库或监控服务)
const monitoringData = {
  downloads: {
    total: 15420,
    success: 14548,
    failed: 872,
    lastHour: 45,
  },
  performance: {
    responseTime: {
      avg: 320,
      p95: 650,
      p99: 1200,
    },
    fcp: 1200,
    lcp: 2100,
    cls: 0.1,
    fid: 50,
  },
  users: {
    active: 142,
    new: 23,
    returning: 119,
  },
  errors: {
    total: 12,
    types: [
      { message: 'Network timeout', count: 5 },
      { message: 'Invalid Instagram URL', count: 4 },
      { message: 'Rate limit exceeded', count: 3 },
    ],
  },
  services: {
    api: { status: 'healthy', responseTime: 85 },
    download: { status: 'healthy', responseTime: 320 },
    imageProcessing: { status: 'degraded', responseTime: 1200 },
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    
    // 根据时间范围调整数据 (这里是简化的示例)
    const adjustedData = { ...monitoringData };
    
    switch (timeRange) {
      case '1h':
        adjustedData.downloads.total = Math.floor(monitoringData.downloads.total / 24);
        adjustedData.users.active = Math.floor(monitoringData.users.active / 4);
        break;
      case '7d':
        adjustedData.downloads.total = Math.floor(monitoringData.downloads.total * 7);
        adjustedData.users.active = Math.floor(monitoringData.users.active * 1.5);
        break;
      case '30d':
        adjustedData.downloads.total = Math.floor(monitoringData.downloads.total * 30);
        adjustedData.users.active = Math.floor(monitoringData.users.active * 2);
        break;
      default:
        // 24h - 使用原始数据
        break;
    }
    
    // 计算成功率
    const successRate = Math.round(
      (adjustedData.downloads.success / adjustedData.downloads.total) * 100 * 100
    ) / 100;
    
    const stats = {
      totalDownloads: adjustedData.downloads.total,
      successRate: successRate,
      avgResponseTime: adjustedData.performance.responseTime.avg,
      activeUsers: adjustedData.users.active,
      errorCount: adjustedData.errors.total,
      topErrors: adjustedData.errors.types,
      performanceMetrics: {
        fcp: adjustedData.performance.fcp,
        lcp: adjustedData.performance.lcp,
        cls: adjustedData.performance.cls,
        fid: adjustedData.performance.fid,
      },
      services: adjustedData.services,
      timeRange,
      lastUpdated: new Date().toISOString(),
    };
    
    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Error fetching monitoring stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring statistics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { metric, value, timestamp } = data;
    
    // 记录新的监控指标 (这里是简化的示例)
    switch (metric) {
      case 'download_success':
        monitoringData.downloads.success += 1;
        monitoringData.downloads.total += 1;
        break;
      case 'download_failed':
        monitoringData.downloads.failed += 1;
        monitoringData.downloads.total += 1;
        monitoringData.errors.total += 1;
        break;
      case 'user_active':
        // 更新活跃用户数 (实际应该基于会话管理)
        break;
      case 'performance_metric':
        if (data.name === 'fcp') {
          monitoringData.performance.fcp = value;
        } else if (data.name === 'lcp') {
          monitoringData.performance.lcp = value;
        }
        break;
      default:
        console.log('Unknown metric:', metric);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error recording metric:', error);
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    );
  }
}