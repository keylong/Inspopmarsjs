import { NextRequest, NextResponse } from 'next/server';
import { URLValidationResult, APIResponse, ContentType } from '@/types/instagram';

// Instagram URL 验证正则表达式
const INSTAGRAM_URL_PATTERNS = {
  post: /^https?:\/\/(www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)\/?/,
  reel: /^https?:\/\/(www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)\/?/,
  story: /^https?:\/\/(www\.)?instagram\.com\/stories\/([A-Za-z0-9_.-]+)\/([0-9]+)\/?/,
  highlight: /^https?:\/\/(www\.)?instagram\.com\/stories\/highlights\/([0-9]+)\/?/,
  igtv: /^https?:\/\/(www\.)?instagram\.com\/tv\/([A-Za-z0-9_-]+)\/?/,
  profile: /^https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9_.-]+)\/?$/,
};

function validateInstagramURL(url: string): URLValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URL is required',
    };
  }

  // 检查每种类型的模式
  for (const [type, pattern] of Object.entries(INSTAGRAM_URL_PATTERNS)) {
    const match = url.match(pattern);
    if (match) {
      const result: URLValidationResult = {
        isValid: true,
        type: type as ContentType,
      };

      // 提取相关信息
      switch (type) {
        case 'post':
        case 'reel':
        case 'igtv':
          if (match[2]) {
            result.shortcode = match[2];
          }
          break;
        case 'story':
          if (match[2]) {
            result.username = match[2];
          }
          break;
        case 'profile':
          if (match[2]) {
            result.username = match[2];
          }
          break;
      }

      return result;
    }
  }

  return {
    isValid: false,
    error: 'Invalid Instagram URL format',
  };
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    const validation = validateInstagramURL(url);

    return NextResponse.json<APIResponse<URLValidationResult>>({
      success: validation.isValid,
      data: validation,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    });

  } catch (error) {
    console.error('URL validation error:', error);
    
    return NextResponse.json<APIResponse<URLValidationResult>>({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
    }, { status: 500 });
  }
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