import { NextRequest, NextResponse } from 'next/server';

/**
 * 健康检查 API 端点 (App Router)
 * 用于部署监控和负载均衡器健康检查
 */

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    api: 'up' | 'down';
  };
  metrics: {
    uptime: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

/**
 * 检查服务状态
 */
async function checkServices() {
  const services = {
    database: 'up' as const, // 暂时返回 up，实际应连接数据库测试
    redis: 'up' as const,    // 暂时返回 up，实际应连接 Redis 测试
    api: 'up' as const,      // API 服务本身正在运行
  };

  // 这里可以添加实际的服务检查逻辑
  // try {
  //   await testDatabaseConnection();
  //   services.database = 'up';
  // } catch (error) {
  //   services.database = 'down';
  // }

  return services;
}

/**
 * 获取系统指标
 */
function getSystemMetrics() {
  const memoryUsage = process.memoryUsage();
  
  return {
    uptime: process.uptime(),
    memory: {
      used: memoryUsage.heapUsed,
      total: memoryUsage.heapTotal,
      percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
    },
  };
}

/**
 * 健康检查处理器 (GET)
 */
export async function GET(_request: NextRequest) {
  try {
    // 检查所有服务
    const services = await checkServices();
    const metrics = getSystemMetrics();

    // 确定整体健康状态
    const allServicesUp = Object.values(services).every(status => status === 'up');
    const memoryOk = metrics.memory.percentage < 90; // 内存使用率小于 90%
    
    const isHealthy = allServicesUp && memoryOk;

    const response: HealthCheckResponse = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services,
      metrics,
    };

    // 根据健康状态设置 HTTP 状态码
    const statusCode = isHealthy ? 200 : 503;

    // 设置缓存头
    const headers = new Headers({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    return NextResponse.json(response, { status: statusCode, headers });
    
  } catch (error) {
    console.error('Health check failed:', error);

    const errorResponse: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'down',
        redis: 'down',
        api: 'down',
      },
      metrics: {
        uptime: process.uptime(),
        memory: {
          used: 0,
          total: 0,
          percentage: 100,
        },
      },
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}

/**
 * 支持HEAD请求用于简单的存活检查
 */
export async function HEAD() {
  try {
    // 简单的存活检查，不返回详细信息
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}