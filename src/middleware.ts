import { NextRequest, NextResponse } from 'next/server';
import { locales, getLocaleFromCountryCode, isValidLocale } from './lib/i18n/config';

// 辅助函数：从路径中提取语言代码
function getLocaleFromPathname(pathname: string): string | undefined {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  return isValidLocale(potentialLocale) ? potentialLocale : undefined;
}

// 辅助函数：从请求中检测首选语言
function detectPreferredLocale(request: NextRequest): string {
  // 1. 检查URL参数中的语言设置
  const urlLocale = request.nextUrl.searchParams.get('lang');
  if (urlLocale && isValidLocale(urlLocale)) {
    return urlLocale;
  }

  // 2. 检查Cookie中保存的语言偏好
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 3. 地理位置检测（Vercel Edge Function提供）
  const country = request.geo?.country || 'US';
  const geoLocale = getLocaleFromCountryCode(country);
  
  // 4. Accept-Language header检测
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    for (const locale of locales) {
      if (acceptLanguage.includes(locale) || acceptLanguage.includes(locale.split('-')[0])) {
        return locale;
      }
    }
  }

  // 5. 返回地理位置推荐或默认语言
  return geoLocale;
}

// 需要认证的路由
function requiresAuth(pathname: string): boolean {
  const protectedRoutes = ['/profile', '/dashboard', '/settings'];
  return protectedRoutes.some(route => pathname.includes(route));
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源和API路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 检查当前路径是否已包含语言代码
  const currentLocale = getLocaleFromPathname(pathname);
  
  if (!currentLocale) {
    // 路径中没有语言代码，需要重定向到带语言代码的路径
    const preferredLocale = detectPreferredLocale(request);
    const newUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
    
    // 保持查询参数
    newUrl.search = request.nextUrl.search;
    
    const response = NextResponse.redirect(newUrl);
    
    // 设置Cookie保存语言偏好
    response.cookies.set('locale', preferredLocale, {
      maxAge: 365 * 24 * 60 * 60, // 1年
      path: '/',
      sameSite: 'lax',
    });
    
    return response;
  }

  // 移除语言代码后的实际路径
  const pathnameWithoutLocale = pathname.slice(`/${currentLocale}`.length) || '/';

  // 检查认证要求
  // 注意：Stack Auth 的认证检查应该在组件级别进行，
  // 因为中间件在 Edge Runtime 中运行，无法访问某些 Node.js API
  if (requiresAuth(pathnameWithoutLocale)) {
    // 检查是否有 Stack Auth 的 cookie
    const stackSession = request.cookies.get('stack-session');
    
    if (!stackSession) {
      // 重定向到登录页面，保持当前语言
      const loginUrl = new URL(`/${currentLocale}/auth/signin`, request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 设置请求头，以便在组件中获取当前语言
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathnameWithoutLocale);
  requestHeaders.set('x-locale', currentLocale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api/auth (Stack Auth API routes)
     * - api/proxy (图片代理API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 其他静态资源文件
     */
    '/((?!api/auth|api/proxy|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

// 导出类型供其他模块使用
// export type { SupportedLocale, DetectionMethod, LocaleDetectionResult, MiddlewareContext };