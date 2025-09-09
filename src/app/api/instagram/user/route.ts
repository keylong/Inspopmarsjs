import { NextRequest, NextResponse } from 'next/server';
import { InstagramDownloader, UserService } from '@/lib/api/instagram';

/**
 * POST /api/instagram/user
 * 获取用户的所有媒体内容
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    // 验证输入
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { success: false, error: '请提供有效的用户名' },
        { status: 400 }
      );
    }

    // 清理用户名（移除@符号等）
    const cleanUsername = username.replace(/^@/, '').trim();

    if (!/^[a-zA-Z0-9._]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { success: false, error: '用户名格式无效' },
        { status: 400 }
      );
    }

    // 调用用户媒体获取服务
    const result = await InstagramDownloader.getUserAllMedia(cleanUsername);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || '获取用户数据失败' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Instagram用户API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/instagram/user?username=xxx
 * 可选的GET方式支持
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, error: '请提供username参数' },
        { status: 400 }
      );
    }

    // 重用POST逻辑
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ username }),
    }));
  } catch (error) {
    console.error('Instagram用户GET API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误' 
      },
      { status: 500 }
    );
  }
}