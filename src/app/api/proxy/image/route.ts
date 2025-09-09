import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/proxy/image?url=<encoded_url>
 * POST /api/proxy/image {"url": "<full_url>"}
 * 图片代理端点 - 解决Instagram图片CORS限制
 * 支持GET和POST方式，避免长URL截断问题
 */

async function proxyImage(imageUrl: string): Promise<NextResponse> {
  try {

    // 验证URL参数
    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少url参数' },
        { status: 400 }
      );
    }

    console.log('代理图片请求 URL 长度:', imageUrl.length);

    // 解码URL
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(imageUrl);
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
        { error: '不支持的图片域名' },
        { status: 403 }
      );
    }

    console.log('代理请求图片:', decodedUrl);

    // 请求Instagram图片，添加重试机制
    let response: Response;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        response = await fetch(decodedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.instagram.com/',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Sec-Fetch-Dest': 'image',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site'
          },
          signal: AbortSignal.timeout(10000), // 10秒超时
        });
        
        if (response.ok) {
          break; // 成功则跳出循环
        }
        
        console.warn(`图片请求失败 (尝试 ${attempts + 1}/${maxAttempts}): ${response.status} ${response.statusText}`);
        
      } catch (error) {
        console.warn(`图片请求错误 (尝试 ${attempts + 1}/${maxAttempts}):`, error);
      }
      
      attempts++;
      
      // 重试前等待
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    if (!response.ok) {
      console.error(`图片请求失败: ${response.status} ${response.statusText}`);
      
      // 生成占位图作为fallback
      const placeholderSvg = `
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af">
            图片加载失败
          </text>
          <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">
            错误代码: ${response.status}
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

    // 获取图片数据
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log(`成功代理图片: ${contentType}, 大小: ${imageBuffer.byteLength} bytes`);

    // 返回图片数据
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600', // 缓存24小时，1小时内允许过期重新验证
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('图片代理错误:', error);
    
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
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少url参数' },
        { status: 400 }
      );
    }

    // 解码URL
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(imageUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'URL格式无效' },
        { status: 400 }
      );
    }

    return proxyImage(decodedUrl);
  } catch (error) {
    console.error('GET 图片代理错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url: imageUrl } = body;
    
    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: '请在请求体中提供有效的URL' },
        { status: 400 }
      );
    }

    console.log('POST 方式代理图片:', imageUrl.substring(0, 100) + '...');
    return proxyImage(imageUrl);
  } catch (error) {
    console.error('POST 图片代理错误:', error);
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}