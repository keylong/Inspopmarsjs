import { NextRequest, NextResponse } from 'next/server';
import { DownloadFormData, APIResponse, DownloadResult } from '@/types/instagram';
import { cache } from '@/lib/redis';
import { createHash } from 'crypto';

// 模拟调用 PHP API 的函数
async function callPHPAPI(endpoint: string, data: any): Promise<any> {
  const phpApiUrl = process.env.PHP_API_URL || 'http://localhost/api';
  
  try {
    const response = await fetch(`${phpApiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': process.env.PHP_API_KEY || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PHP API call failed:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DownloadFormData = await request.json();
    
    // 验证请求数据
    if (!body.url) {
      return NextResponse.json<APIResponse<DownloadResult>>({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Instagram URL is required',
        },
      }, { status: 400 });
    }

    // 生成缓存键
    const cacheKey = generateDownloadCacheKey(body);
    
    // 尝试从缓存获取结果
    const cachedResult = await cache.get<DownloadResult>(cacheKey);
    if (cachedResult) {
      return NextResponse.json<APIResponse<DownloadResult>>({
        success: cachedResult.success,
        data: cachedResult,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
          cached: true,
          cacheHit: true,
        },
      }, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=300', // 5分钟
        }
      });
    }

    // 调用 PHP API
    const phpResponse = await callPHPAPI('/v1/download', {
      url: body.url,
      type: body.type || 'auto',
      quality: body.quality || 'original',
      format: body.format || 'individual',
    });

    const result: DownloadResult = {
      success: phpResponse.success || false,
      data: phpResponse.data,
      downloads: phpResponse.downloads,
      error: phpResponse.error,
    };

    // 只缓存成功的结果
    if (result.success) {
      await cache.set(cacheKey, result, 1800); // 缓存30分钟
    }

    return NextResponse.json<APIResponse<DownloadResult>>({
      success: result.success,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
        cached: false,
        cacheHit: false,
      },
    }, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': result.success ? 'public, max-age=300' : 'no-cache',
      }
    });

  } catch (error) {
    console.error('Download API error:', error);
    
    return NextResponse.json<APIResponse<DownloadResult>>({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
    }, { status: 500 });
  }
}

// 生成下载缓存键
function generateDownloadCacheKey(data: DownloadFormData): string {
  const keyData = {
    url: data.url,
    type: data.type || 'auto',
    quality: data.quality || 'original', 
    format: data.format || 'individual',
  };
  
  const keyString = JSON.stringify(keyData);
  const hash = createHash('md5').update(keyString).digest('hex');
  
  return `download:${hash}`;
}

export async function GET() {
  return NextResponse.json<APIResponse>({
    success: false,
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only POST method is allowed',
    },
  }, { status: 405 });
}