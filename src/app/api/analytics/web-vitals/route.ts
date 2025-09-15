import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  url: string;
  userAgent: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json();
    
    // 验证数据
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // 在生产环境中，可以将数据发送到外部分析服务
    if (process.env.NODE_ENV === 'production') {
      // 发送到 Google Analytics 4
      if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
        await sendToGA4(metric);
      }
      
      // 发送到自定义分析数据库
      await logWebVital(metric);
    }

    // 开发环境下记录到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}: ${metric.value}ms (${metric.rating})`);
      console.log(`  URL: ${metric.url}`);
      console.log(`  Timestamp: ${metric.timestamp}`);
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Web Vitals API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 发送到 Google Analytics 4
async function sendToGA4(metric: WebVitalMetric) {
  const measurementId = process.env.GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA_API_SECRET;
  
  if (!measurementId || !apiSecret) {
    return;
  }

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: generateClientId(metric.userAgent, metric.url),
        events: [{
          name: 'web_vital',
          params: {
            metric_name: metric.name,
            metric_value: metric.value,
            metric_rating: metric.rating,
            page_location: metric.url,
          },
        }],
      }),
    });
  } catch (error) {
    console.error('Failed to send to GA4:', error);
  }
}

// 记录到本地或数据库
async function logWebVital(metric: WebVitalMetric) {
  // 这里可以实现数据库存储逻辑
  // 例如存储到 PostgreSQL, MongoDB 或其他数据存储
  
  // 示例：存储到文件 (仅用于演示，生产环境建议使用数据库)
  if (process.env.NODE_ENV === 'production') {
    const logEntry = {
      ...metric,
      server_timestamp: new Date().toISOString(),
    };
    
    // 这里应该实现实际的存储逻辑
    console.log('Web Vital logged:', logEntry);
  }
}

// 生成客户端ID
function generateClientId(userAgent: string, url: string): string {
  // 简单的哈希函数生成客户端ID
  const hash = crypto
    .createHash('md5')
    .update(userAgent + url)
    .digest('hex');
  
  return hash.substring(0, 8) + '-' + hash.substring(8, 12) + '-' + 
         hash.substring(12, 16) + '-' + hash.substring(16, 20);
}

// 只允许 POST 请求
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}