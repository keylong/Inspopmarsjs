import { NextRequest, NextResponse } from 'next/server';
import { LogEntry, LogLevel } from '@/lib/logger';

// 模拟日志存储 (实际应该使用数据库或日志聚合服务)
const logStorage: LogEntry[] = [];

export async function POST(request: NextRequest) {
  try {
    const logEntry: LogEntry = await request.json();
    
    // 验证日志条目
    if (!logEntry.message || typeof logEntry.level !== 'number') {
      return NextResponse.json(
        { error: 'Invalid log entry format' },
        { status: 400 }
      );
    }
    
    // 添加服务器端信息
    const enhancedEntry: LogEntry = {
      ...logEntry,
      timestamp: new Date().toISOString(), // 使用服务器时间
      requestId: request.headers.get('x-request-id') || crypto.randomUUID(),
    };
    
    // 存储日志
    logStorage.push(enhancedEntry);
    
    // 限制内存中的日志数量
    if (logStorage.length > 10000) {
      logStorage.splice(0, 1000); // 删除最旧的1000条日志
    }
    
    // 对于错误级别的日志，发送告警
    if (enhancedEntry.level >= LogLevel.ERROR) {
      await sendErrorAlert(enhancedEntry);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Failed to process log entry:', error);
    return NextResponse.json(
      { error: 'Failed to process log entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    const offset = parseInt(searchParams.get('offset') || '0');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');
    
    // 过滤日志
    let filteredLogs = [...logStorage];
    
    if (level !== null) {
      const minLevel = parseInt(level);
      filteredLogs = filteredLogs.filter(log => log.level >= minLevel);
    }
    
    if (startTime) {
      const start = new Date(startTime);
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) >= start
      );
    }
    
    if (endTime) {
      const end = new Date(endTime);
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) <= end
      );
    }
    
    if (category) {
      filteredLogs = filteredLogs.filter(
        log => log.context?.category === category
      );
    }
    
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }
    
    // 按时间倒序排列
    filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // 分页
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);
    
    // 统计信息
    const stats = {
      total: filteredLogs.length,
      byLevel: getLogsByLevel(filteredLogs),
      byCategory: getLogsByCategory(filteredLogs),
    };
    
    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        total: filteredLogs.length,
        limit,
        offset,
        hasNext: offset + limit < filteredLogs.length,
      },
      stats,
    });
    
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

// 发送错误告警
async function sendErrorAlert(logEntry: LogEntry) {
  try {
    // 这里可以集成邮件、Slack、或其他通知服务
    console.log('ERROR ALERT:', {
      message: logEntry.message,
      level: logEntry.level,
      timestamp: logEntry.timestamp,
      error: logEntry.error,
      context: logEntry.context,
    });
    
    // 示例：发送到监控系统
    // await notificationService.send({
    //   title: `Application Error: ${logEntry.message}`,
    //   body: `Level: ${logEntry.level}\nTimestamp: ${logEntry.timestamp}`,
    //   context: logEntry.context,
    // });
    
  } catch (alertError) {
    console.error('Failed to send error alert:', alertError);
  }
}

// 按日志级别统计
function getLogsByLevel(logs: LogEntry[]): Record<string, number> {
  const levelCounts: Record<string, number> = {
    DEBUG: 0,
    INFO: 0,
    WARN: 0,
    ERROR: 0,
    FATAL: 0,
  };
  
  const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
  
  logs.forEach(log => {
    const levelName = levelNames[log.level] || 'UNKNOWN';
    levelCounts[levelName] = (levelCounts[levelName] || 0) + 1;
  });
  
  return levelCounts;
}

// 按类别统计
function getLogsByCategory(logs: LogEntry[]): Record<string, number> {
  const categoryCounts: Record<string, number> = {};
  
  logs.forEach(log => {
    const category = log.context?.category || 'general';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  return categoryCounts;
}