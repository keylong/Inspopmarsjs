import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/proxy/image?url=<encoded_url>
 * POST /api/proxy/image {"url": "<full_url>"}
 * 媒体代理端点 - 解决Instagram图片/视频CORS限制
 * 支持GET和POST方式，避免长URL截断问题
 */

async function proxyMedia(mediaUrl: string): Promise<NextResponse> {
  try {

    // 验证URL参数
    if (!mediaUrl) {
      return NextResponse.json(
        { error: '缺少url参数' },
        { status: 400 }
      );
    }

    console.log('代理媒体请求 URL 长度:', mediaUrl.length);

    // 解码URL
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(mediaUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'URL格式无效' },
        { status: 400 }
      );
    }

    // 验证是否为Instagram域名（安全检查）
    const allowedDomainPatterns = [
      // Facebook CDN域名 - 最宽松的匹配，包含所有 fbcdn.net 变体
      /^.*\.fbcdn\.net$/,
      // 具体的 Instagram CDN 模式 - 支持所有已知格式
      /^instagram\.[a-z0-9\-]+\.[a-z0-9\-]+\.fbcdn\.net$/, // instagram.fflr4-2.fna.fbcdn.net
      /^instagram\.[a-z0-9\-]+\.fna\.fbcdn\.net$/,         // instagram.xxx.fna.fbcdn.net
      /^[a-z0-9\-]+\.fna\.fbcdn\.net$/,                    // xxx.fna.fbcdn.net
      // cdninstagram.com 相关域名
      /^.*\.cdninstagram\.com$/,
      /^scontent.*\.cdninstagram\.com$/,
      // Instagram 直接域名
      /^.*instagram.*\.(com|net)$/,
      // Facebook & Meta CDN域名
      /^.*\.facebook\.com$/,
      /^.*\.fb\.com$/,
      /^.*\.meta\.com$/,
    ];

    const url = new URL(decodedUrl);
    const isAllowedDomain = allowedDomainPatterns.some(pattern => 
      pattern.test(url.hostname)
    );
    
    console.log('检查域名:', url.hostname, '是否允许:', isAllowedDomain);

    if (!isAllowedDomain) {
      return NextResponse.json(
        { error: '不支持的媒体域名' },
        { status: 403 }
      );
    }

    console.log('代理请求媒体:', decodedUrl);

    // 请求Instagram媒体，添加重试机制
    let response: Response | null = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        response = await fetch(decodedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.instagram.com/',
            'Accept': 'video/mp4,video/*,image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Sec-Fetch-Dest': 'video',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site'
          },
          signal: AbortSignal.timeout(30000), // 30秒超时，视频需要更长时间
        });
        
        if (response.ok) {
          break; // 成功则跳出循环
        }
        
        console.warn(`媒体请求失败 (尝试 ${attempts + 1}/${maxAttempts}): ${response.status} ${response.statusText}`);
        
      } catch (error) {
        console.warn(`媒体请求错误 (尝试 ${attempts + 1}/${maxAttempts}):`, error);
      }
      
      attempts++;
      
      // 重试前等待
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    if (!response || !response.ok) {
      console.error(`媒体请求失败: ${response ? `${response.status} ${response.statusText}` : '无响应'}`);
      
      // 生成占位图作为fallback
      const placeholderSvg = `
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af">
            媒体加载失败
          </text>
          <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">
            错误代码: ${response?.status || '未知'}
          </text>
        </svg>
      `;
      
      return new NextResponse(placeholderSvg, {
        status: 200, // 返回200以显示占位图
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60', // 短期缓存占位图
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 获取媒体数据
    const mediaBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    console.log(`成功代理媒体: ${contentType}, 大小: ${mediaBuffer.byteLength} bytes`);

    // 返回媒体数据
    return new NextResponse(mediaBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600', // 缓存24小时，1小时内允许过期重新验证
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Accept-Ranges': 'bytes', // 支持视频的范围请求
      },
    });

  } catch (error) {
    console.error('媒体代理错误:', error);
    
    // 生成错误占位图
    const errorSvg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fef2f2"/>
        <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#dc2626">
          🚫 代理服务错误
        </text>
        <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#991b1b">
          请稍后重试
        </text>
        <text x="50%" y="65%" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#7f1d1d">
          ${error instanceof Error ? error.message.substring(0, 30) : '未知错误'}
        </text>
      </svg>
    `;
    
    return new NextResponse(errorSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get('url');
    
    if (!mediaUrl) {
      return NextResponse.json(
        { error: '缺少url参数' },
        { status: 400 }
      );
    }

    // 解码URL
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(mediaUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'URL格式无效' },
        { status: 400 }
      );
    }

    return proxyMedia(decodedUrl);
  } catch (error) {
    console.error('GET 媒体代理错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url: mediaUrl } = body;
    
    if (!mediaUrl || typeof mediaUrl !== 'string') {
      return NextResponse.json(
        { error: '请在请求体中提供有效的URL' },
        { status: 400 }
      );
    }

    console.log('POST 方式代理媒体:', mediaUrl.substring(0, 100) + '...');
    return proxyMedia(mediaUrl);
  } catch (error) {
    console.error('POST 媒体代理错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 处理OPTIONS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}