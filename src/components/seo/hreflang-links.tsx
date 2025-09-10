import { locales } from '@/lib/i18n/config';

interface HreflangLinksProps {
  currentLocale: string;
  pathname: string;
  domain?: string;
}

export function HreflangLinks({ 
  currentLocale, 
  pathname, 
  domain = 'https://inspopmars.com' 
}: HreflangLinksProps) {
  // 移除语言代码从路径名
  const segments = pathname.split('/').filter(Boolean);
  const hasLocalePrefix = segments[0] && locales.includes(segments[0] as any);
  const pathnameWithoutLocale = hasLocalePrefix 
    ? '/' + segments.slice(1).join('/') 
    : pathname;
  
  return (
    <>
      {locales.map((locale) => {
        // 简体中文使用根路径，其他语言使用带前缀的路径
        const href = locale === 'zh-CN' 
          ? `${domain}${pathnameWithoutLocale}`
          : `${domain}/${locale}${pathnameWithoutLocale}`;
          
        return (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={href}
          />
        );
      })}
      {/* x-default 指向默认语言（简体中文） */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${domain}${pathnameWithoutLocale}`}
      />
    </>
  );
}