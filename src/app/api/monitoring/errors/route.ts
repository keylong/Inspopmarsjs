import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

interface ErrorReport {
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  userId?: string;
  context?: Record<string, any>;
}

// 模拟错误存储 (实际应该使用数据库)
const errorStorage: ErrorReport[] = [];

export async function POST(request: NextRequest) {
  try {
    const errorData: ErrorReport = await request.json();
    
    // 验证错误数据
    if (!errorData.message) {
      return NextResponse.json(
        { error: 'Error message is required' },
        { status: 400 }
      );
    }
    
    // 添加时间戳
    errorData.timestamp = new Date().toISOString();
    
    // 存储错误 (简化版本)
    errorStorage.push(errorData);
    
    // 同时发送到 Sentry
    Sentry.captureException(new Error(errorData.message), {
      extra: {
        stack: errorData.stack,
        url: errorData.url,
        userAgent: errorData.userAgent,
        context: errorData.context,
      },
      user: errorData.userId ? { id: errorData.userId } : undefined,
    });
    
    // 记录错误指标
    await fetch(`${request.nextUrl.origin}/api/monitoring/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: 'error_recorded',
        value: 1,
        timestamp: errorData.timestamp,
        context: {
          message: errorData.message.substring(0, 100),
          url: errorData.url,
        },
      }),
    }).catch(err => console.error('Failed to record error metric:', err));
    
    return NextResponse.json({
      success: true,
      id: errorStorage.length - 1,
      message: 'Error reported successfully',
    });
    
  } catch (error) {
    console.error('Error reporting failed:', error);
    
    // 报告这个错误本身
    Sentry.captureException(error);
    
    return NextResponse.json(
      { error: 'Failed to report error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const severity = searchParams.get('severity');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    
    // 过滤错误
    let filteredErrors = [...errorStorage];
    
    if (startTime) {
      const start = new Date(startTime);
      filteredErrors = filteredErrors.filter(
        error => new Date(error.timestamp) >= start
      );
    }
    
    if (endTime) {
      const end = new Date(endTime);
      filteredErrors = filteredErrors.filter(
        error => new Date(error.timestamp) <= end
      );
    }
    
    // 按时间倒序排列
    filteredErrors.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // 分页
    const paginatedErrors = filteredErrors.slice(offset, offset + limit);
    
    // 统计信息
    const stats = {
      total: filteredErrors.length,
      byHour: getErrorsByHour(filteredErrors),
      topErrors: getTopErrors(filteredErrors),
    };
    
    return NextResponse.json({
      errors: paginatedErrors,
      pagination: {
        total: filteredErrors.length,
        limit,
        offset,
        hasNext: offset + limit < filteredErrors.length,
      },
      stats,
    });
    
  } catch (error) {
    console.error('Error fetching error reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch error reports' },
      { status: 500 }
    );
  }
}

// 辅助函数：按小时统计错误
function getErrorsByHour(errors: ErrorReport[]): Record<string, number> {
  const hourlyStats: Record<string, number> = {};
  const now = new Date();
  
  // 初始化过去24小时
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    const key = hour.toISOString().substring(0, 13); // YYYY-MM-DDTHH
    hourlyStats[key] = 0;
  }
  
  // 统计错误
  errors.forEach(error => {
    const hour = error.timestamp.substring(0, 13);
    if (hourlyStats.hasOwnProperty(hour)) {
      hourlyStats[hour]++;
    }
  });
  
  return hourlyStats;
}

// 辅助函数：获取最常见的错误
function getTopErrors(errors: ErrorReport[]): Array<{message: string; count: number}> {
  const errorCounts: Record<string, number> = {};
  
  errors.forEach(error => {
    const message = error.message.substring(0, 100); // 截断长消息
    errorCounts[message] = (errorCounts[message] || 0) + 1;
  });
  
  return Object.entries(errorCounts)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}