import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/proxy/video?url=<encoded_url>
 * POST /api/proxy/video {"url": "<full_url>"}
 * 视频专用代理端点 - 专门处理视频文件，支持流传输和范围请求
 */

async function proxyVideo(videoUrl: string): Promise<NextResponse> {
  try {
    // 验证URL参数
    if (!videoUrl) {
      return NextResponse.json(
        { error: '缺少url参数' },
        { status: 400 }
      );
    }

    console.log('🎬 视频代理请求 URL 长度:', videoUrl.length);
    console.log('🎬 视频代理请求 URL 预览:', videoUrl.substring(0, 100) + (videoUrl.length > 100 ? '...' : ''));

    // 解码URL
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(videoUrl);
      console.log('🔍 解码后的URL预览:', decodedUrl.substring(0, 100) + (decodedUrl.length > 100 ? '...' : ''));
    } catch (e) {
      console.error('🚫 URL解码失败:', e);
      return NextResponse.json(
        { error: 'URL格式无效', details: 'URL解码失败' },
        { status: 400 }
      );
    }

    // 验证URL格式
    let url: URL;
    try {
      url = new URL(decodedUrl);
    } catch (e) {
      console.error('🚫 URL格式验证失败:', e, '原始URL:', decodedUrl);
      return NextResponse.json(
        { error: 'Invalid URL', details: 'URL格式不正确', originalUrl: decodedUrl.substring(0, 100) },
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

    const isAllowedDomain = allowedDomainPatterns.some(pattern => 
      pattern.test(url.hostname)
    );
    
    console.log('🔒 检查视频域名:', url.hostname, '是否允许:', isAllowedDomain);

    if (!isAllowedDomain) {
      return NextResponse.json(
        { error: '不支持的视频域名' },
        { status: 403 }
      );
    }

    console.log('🎬 代理请求视频:', decodedUrl);

    // 请求Instagram视频，添加重试机制和范围请求支持
    let response: Response | null = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        response = await fetch(decodedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.instagram.com/',
            'Accept': 'video/mp4,video/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Sec-Fetch-Dest': 'video',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site'
          },
          signal: AbortSignal.timeout(45000), // 45秒超时，视频需要更长时间
        });
        
        if (response.ok) {
          break; // 成功则跳出循环
        }
        
        console.warn(`🎬 视频请求失败 (尝试 ${attempts + 1}/${maxAttempts}): ${response.status} ${response.statusText}`);
        
      } catch (error) {
        console.warn(`🎬 视频请求错误 (尝试 ${attempts + 1}/${maxAttempts}):`, error);
      }
      
      attempts++;
      
      // 重试前等待
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    if (!response || !response.ok) {
      console.error(`🎬 视频请求失败: ${response ? `${response.status} ${response.statusText}` : '无响应'}`);
      
      return NextResponse.json({
        error: '视频加载失败',
        status: response?.status || 'unknown',
        message: '暂时无法访问'
      }, { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }

    // 获取视频数据
    const videoBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'video/mp4';

    console.log(`🎬 成功代理视频: ${contentType}, 大小: ${videoBuffer.byteLength} bytes`);

    // 返回视频数据，支持流传输
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600', // 缓存24小时
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Accept-Ranges': 'bytes', // 支持视频的范围请求
        'Content-Length': videoBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('🎬 视频代理错误:', error);
    
    return NextResponse.json({
      error: '视频代理服务错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');
    
    if (!videoUrl) {
      return NextResponse.json(
        { error: '缺少url参数' },
        { status: 400 }
      );
    }

    return proxyVideo(videoUrl);
  } catch (error) {
    console.error('GET 视频代理错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url: videoUrl } = body;
    
    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json(
        { error: '请在请求体中提供有效的视频URL' },
        { status: 400 }
      );
    }

    console.log('🎬 POST 方式代理视频:', videoUrl.substring(0, 100) + '...');
    return proxyVideo(videoUrl);
  } catch (error) {
    console.error('POST 视频代理错误:', error);
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
      'Access-Control-Allow-Headers': 'Content-Type, Range',
    },
  });
}