import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, getLocaleFromCountryCode, isValidLocale } from './lib/i18n/config';
 
// 扩展NextRequest类型以包含Vercel的geo信息
interface GeoData {
  country?: string;
  city?: string;
  region?: string;
}

interface ExtendedNextRequest extends NextRequest {
  geo?: GeoData;
}

// 辅助函数：从请求中检测首选语言
function detectPreferredLocale(request: ExtendedNextRequest): string {
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

  // 3. 地理位置检测（Vercel Edge Function提供）- 增强版
  const geo: GeoData = request.geo || {};
  const country = geo.country || 'CN';
  
  const geoLocale = getLocaleFromCountryCode(country);
  
  // 4. Accept-Language header检测
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // 优先检测中文
    if (acceptLanguage.includes('zh-CN') || acceptLanguage.includes('zh')) {
      return 'zh-CN';
    }
    if (acceptLanguage.includes('zh-TW') || acceptLanguage.includes('zh-HK')) {
      return 'zh-TW';
    }
    if (acceptLanguage.includes('en')) {
      return 'en';
    }
  }

  // 5. 返回地理位置推荐或默认语言（简体中文）
  return geoLocale || defaultLocale;
}

export default async function middleware(request: ExtendedNextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源和API路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname === '/manifest.json' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  // 检查路径中的语言代码
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];
  
  let locale: string;
  let pathWithoutLocale: string;
  
  // 检查是否有语言前缀
  if (potentialLocale && isValidLocale(potentialLocale)) {
    if (potentialLocale === 'zh-CN') {
      // 如果URL中有 /zh-CN，重定向到没有语言前缀的路径
      pathWithoutLocale = '/' + segments.slice(1).join('/');
      const newUrl = new URL(pathWithoutLocale || '/', request.url);
      newUrl.search = request.nextUrl.search;
      
      const response = NextResponse.redirect(newUrl);
      response.cookies.set('locale', 'zh-CN', {
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
        sameSite: 'lax',
      });
      return response;
    } else {
      // 其他语言保留前缀
      locale = potentialLocale;
      pathWithoutLocale = '/' + segments.slice(1).join('/');
    }
  } else {
    // 没有语言前缀，检测用户偏好
    const detectedLocale = detectPreferredLocale(request);
    
    if (detectedLocale === 'zh-CN') {
      // 简体中文用户，直接使用当前路径
      locale = 'zh-CN';
      pathWithoutLocale = pathname;
    } else {
      // 其他语言用户，重定向到带语言前缀的路径
      const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url);
      newUrl.search = request.nextUrl.search;
      
      const response = NextResponse.redirect(newUrl);
      response.cookies.set('locale', detectedLocale, {
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }
  }

  // 设置请求头，以便在组件中获取当前语言和地理位置
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathWithoutLocale || '/');
  requestHeaders.set('x-locale', locale);
  
  // 添加地理位置信息headers（用于个性化内容）
  const geoHeaders: GeoData = request.geo || {};
  requestHeaders.set('x-geo-country', geoHeaders.country || 'unknown');
  requestHeaders.set('x-geo-city', geoHeaders.city || 'unknown');
  requestHeaders.set('x-geo-region', geoHeaders.region || 'unknown');
  
  // 为跨境电商用户添加特殊标记
  const isEcommerceUser = ['US', 'CN', 'HK', 'MY', 'SG', 'JP'].includes(geoHeaders.country || '');
  if (isEcommerceUser) {
    requestHeaders.set('x-user-type', 'ecommerce');
  }
  
  // 检测海外华人（英语国家但语言偏好是中文）
  const isOverseasChinese = ['US', 'CA', 'GB', 'AU', 'NZ'].includes(geoHeaders.country || '') && 
                            (locale === 'zh-CN' || locale === 'zh-TW');
  if (isOverseasChinese) {
    requestHeaders.set('x-user-segment', 'overseas-chinese');
  }
  
  // 为没有语言前缀的路径（简体中文）重写URL到 /zh-CN 路径
  if (locale === 'zh-CN' && !pathname.startsWith('/zh-CN')) {
    const newUrl = new URL(`/zh-CN${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    
    return NextResponse.rewrite(newUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

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
     * - manifest.json (PWA manifest)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - 其他静态资源文件
     */
    '/((?!api/auth|api/proxy|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$).*)',
  ],

};
