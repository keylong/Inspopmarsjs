'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';
import { LanguageSwitcher } from '@/components/language-switcher';
import { User, LogOut } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();

  console.log('Navigation - Auth State:', { user, isAuthenticated, isLoading });

  // 使用翻译函数
  const nav = {
    home: t('nav.home'),
    download: t('nav.download'),
    about: t('nav.about'),
    profile: t('nav.profile'),
    login: t('nav.login'),
    register: t('nav.register'),
    logout: t('nav.logout'),
  };

  // 创建本地化的导航项
  const navItems = [
    { href: `/${currentLocale}`, label: nav.home },
    { href: `/${currentLocale}/download`, label: nav.download },
    { href: `/${currentLocale}/about`, label: nav.about },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = `/${currentLocale}`;
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
            
            {/* 语言切换器 */}
            <LanguageSwitcher variant="compact" />
            
            {/* 认证相关按钮 */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <Link href={`/${currentLocale}/profile`}>
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4 mr-1" />
                        {user?.name || nav.profile}
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-1" />
                      {nav.logout}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href={`/${currentLocale}/auth/signin`}>
                      <Button variant="ghost" size="sm">
                        {nav.login}
                      </Button>
                    </Link>
                    <Link href={`/${currentLocale}/auth/signup`}>
                      <Button size="sm">
                        {nav.register}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}