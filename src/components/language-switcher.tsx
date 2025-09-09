'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'compact';
}

export function LanguageSwitcher({ 
  className = '', 
  variant = 'dropdown' 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();

  const handleLocaleChange = (newLocale: Locale) => {
    if (!pathname) return;
    
    // 移除当前语言代码并添加新的语言代码
    const segments = pathname.split('/');
    segments[1] = newLocale; // 替换语言代码
    const newPath = segments.join('/');
    
    // 设置Cookie保存语言偏好
    document.cookie = `locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    
    // 导航到新路径
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLocaleName = localeNames[currentLocale];
  const currentLocaleFlag = localeFlags[currentLocale];

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="语言"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLocaleFlag}</span>
        </button>
        
        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[160px]">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{localeFlags[locale]}</span>
                    <span>{localeNames[locale]}</span>
                  </div>
                  {locale === currentLocale && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="语言"
      >
        <Globe className="w-4 h-4" />
        <span className="flex items-center gap-1">
          <span>{currentLocaleFlag}</span>
          <span className="hidden sm:inline">{currentLocaleName}</span>
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[200px]">
            <div className="p-1">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between transition-colors"
                  role="option"
                  aria-selected={locale === currentLocale}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{localeFlags[locale]}</span>
                    <span className="font-medium">{localeNames[locale]}</span>
                  </div>
                  {locale === currentLocale && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}