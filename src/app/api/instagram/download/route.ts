import { NextRequest, NextResponse } from 'next/server';
import { InstagramDownloader } from '@/lib/api/instagram';

/**
 * POST /api/instagram/download
 * 核心下载端点 - 解析Instagram URL并获取下载信息
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // 验证输入
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: '请提供有效的Instagram URL' },
        { status: 400 }
      );
    }

    // 验证是否为Instagram URL
    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/.+/;
    if (!instagramRegex.test(url)) {
      return NextResponse.json(
        { success: false, error: '请提供有效的Instagram URL' },
        { status: 400 }
      );
    }

    // 调用下载服务
    const result = await InstagramDownloader.parseAndDownload(url);

    if (result.success) {
      // 确保返回标准化的响应格式
      const response = {
        success: true,
        data: result.data,
        downloads: result.downloads || [],
        meta: {
          mode: result._mode || 'unknown',
          timestamp: new Date().toISOString(),
          url: url
        }
      };
      
      return NextResponse.json(response, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || '下载失败',
          data: null,
          downloads: [],
          meta: {
            timestamp: new Date().toISOString(),
            url: url
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Instagram下载API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误',
        data: null,
        downloads: [],
        meta: {
          timestamp: new Date().toISOString(),
          url: url || 'unknown'
        }
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    );
  }
}

/**
 * GET /api/instagram/download?url=xxx
 * 可选的GET方式支持
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: '请提供url参数' },
        { status: 400 }
      );
    }

    // 重用POST逻辑
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ url }),
    }));
  } catch (error) {
    console.error('Instagram下载GET API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误',
        data: null,
        downloads: [],
        meta: {
          timestamp: new Date().toISOString(),
          url: 'unknown'
        }
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    );
  }
}