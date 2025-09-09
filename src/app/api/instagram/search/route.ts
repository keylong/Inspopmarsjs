import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/api/instagram';

/**
 * POST /api/instagram/search
 * 统一搜索端点 - 支持全局搜索、用户搜索、标签搜索、位置搜索
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type = 'global' } = body;

    // 验证输入
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: '请提供搜索关键词' },
        { status: 400 }
      );
    }

    const keyword = query.trim();
    if (keyword.length < 1) {
      return NextResponse.json(
        { success: false, error: '搜索关键词不能为空' },
        { status: 400 }
      );
    }

    let result;

    // 根据搜索类型调用不同的服务
    switch (type) {
      case 'users':
        result = await SearchService.searchUsers(keyword);
        break;
      case 'hashtags':
        result = await SearchService.searchHashtags(keyword);
        break;
      case 'locations':
        result = await SearchService.searchLocations(keyword);
        break;
      case 'global':
      default:
        result = await SearchService.globalSearch(keyword);
        break;
    }

    if (result.success) {
      return NextResponse.json({
        ...result,
        searchType: type,
        query: keyword,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || '搜索失败' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Instagram搜索API错误:', error);
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
 * GET /api/instagram/search?q=xxx&type=xxx
 * GET方式支持
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query');
    const type = searchParams.get('type') || 'global';

    if (!query) {
      return NextResponse.json(
        { success: false, error: '请提供q或query参数' },
        { status: 400 }
      );
    }

    // 重用POST逻辑
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ query, type }),
    }));
  } catch (error) {
    console.error('Instagram搜索GET API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误' 
      },
      { status: 500 }
    );
  }
}