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
  const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
  
  return (
    <>
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${domain}/${locale}${pathnameWithoutLocale}`}
        />
      ))}
      {/* x-default 指向默认语言 */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${domain}/zh-CN${pathnameWithoutLocale}`}
      />
    </>
  );
}