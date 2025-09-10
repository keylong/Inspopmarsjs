'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';
import { LanguageSwitcher } from '@/components/language-switcher';
import { SupabaseUserButton } from '@/components/auth/user-button';
import { Crown } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();

  // 使用翻译函数
  const nav = {
    home: t('nav.home'),
    download: t('nav.download'),
    about: t('nav.about'),
    subscription: t('nav.subscription'),
  };

  // 创建本地化的导航项
  const navItems = [
    { href: `/${currentLocale}`, label: nav.home },
    { href: `/${currentLocale}/download`, label: nav.download },
    { href: `/${currentLocale}/about`, label: nav.about },
  ];

  // VIP订阅链接（特殊样式）
  const vipNavItem = {
    href: `/${currentLocale}/subscription`,
    label: nav.subscription,
    isVip: true
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${currentLocale}`} className="font-bold text-xl text-primary">
            {t('site.title')}
          </Link>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* VIP订阅链接 - 特殊样式 */}
            <Link href={vipNavItem.href}>
              <Button
                variant={pathname === vipNavItem.href ? 'default' : 'outline'}
                size="sm"
                className={`relative overflow-hidden transition-all duration-300 ${
                  pathname === vipNavItem.href 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg'
                    : 'border-yellow-400 text-yellow-600 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:text-white hover:border-0 hover:shadow-lg hover:scale-105'
                }`}
              >
                <Crown className="h-4 w-4 mr-1" />
                {vipNavItem.label}
                {pathname !== vipNavItem.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 animate-pulse" />
                )}
              </Button>
            </Link>
            
            {/* 语言切换器 */}
            <LanguageSwitcher variant="compact" />
            
            {/* 用户按钮组件（包含VIP特效） */}
            <SupabaseUserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}