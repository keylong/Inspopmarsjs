import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="面包屑导航"
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
            )}
            {item.current ? (
              <span 
                className="font-medium text-foreground"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || '#'}
                className="hover:text-foreground transition-colors duration-200"
              >
                {index === 0 && (
                  <Home className="h-4 w-4 mr-1 inline" />
                )}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// 预定义的面包屑配置
export const breadcrumbConfigs = {
  home: { label: '首页', href: '/' },
  download: { label: '下载工具', href: '/download' },
  post: { label: 'Instagram图片下载', href: '/download/post' },
  stories: { label: 'Stories下载', href: '/download/stories' },
  reels: { label: 'Reels下载', href: '/download/reels' },
  profile: { label: '头像下载', href: '/download/profile' },
  highlights: { label: 'Highlights下载', href: '/download/highlights' },
  igtv: { label: 'IGTV下载', href: '/download/igtv' },
  private: { label: '私密内容下载', href: '/download/private' },
  batch: { label: '批量下载', href: '/batch-download' },
};

// 生成面包屑导航数据
export function generateBreadcrumbs(
  contentType: keyof typeof breadcrumbConfigs,
  locale: string = 'zh'
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    breadcrumbConfigs.home
  ];

  // 如果不是首页，添加下载工具页面
  if (contentType !== 'home') {
    if (!['batch'].includes(contentType)) {
      items.push(breadcrumbConfigs.download);
    }
    
    // 添加当前页面
    items.push({
      ...breadcrumbConfigs[contentType],
      current: true
    });
  }

  return items;
}