'use client';

import Link from 'next/link';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();

  // 备用翻译内容
  const fallbackFooter = {
    company: 'Instagram 下载软件',
    copyright: '版权所有',
    allRightsReserved: '保留所有权利',
    links: {
      privacy: '隐私政策',
      terms: '服务条款',
      help: '帮助中心',
      contact: '联系我们',
      about: '关于我们',
    },
    social: {
      title: '关注我们',
      twitter: 'Twitter',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
    },
    sections: {
      product: '产品',
      support: '支持',
      company: '公司',
      legal: '法律',
    },
    description: '最好用的 Instagram 内容下载工具，支持图片、视频、Stories、IGTV 和 Reels 下载。',
  };

  // 使用翻译或备用内容
  const footer = fallbackFooter;
  const nav = {
    home: '首页',
    download: '下载',
    about: '关于',
    help: '帮助',
    contact: '联系我们',
  };

  const currentYear = new Date().getFullYear();

  // 快速链接配置
  const quickLinks = [
    { href: `/${currentLocale}`, label: nav.home },
    { href: `/${currentLocale}/download`, label: nav.download },
    { href: `/${currentLocale}/download/post`, label: '帖子下载' },
    { href: `/${currentLocale}/download/stories`, label: 'Stories下载' },
  ];

  const supportLinks = [
    { href: `/${currentLocale}/help`, label: footer.links.help },
    { href: `/${currentLocale}/contact`, label: footer.links.contact },
    { href: `/${currentLocale}/about`, label: footer.links.about },
  ];

  const legalLinks = [
    { href: `/${currentLocale}/privacy`, label: footer.links.privacy },
    { href: `/${currentLocale}/terms`, label: footer.links.terms },
  ];

  const socialLinks = [
    {
      href: 'https://twitter.com',
      label: footer.social.twitter,
      icon: Twitter,
      ariaLabel: `在 ${footer.social.twitter} 上关注我们`,
    },
    {
      href: 'https://facebook.com',
      label: footer.social.facebook,
      icon: Facebook,
      ariaLabel: `在 ${footer.social.facebook} 上关注我们`,
    },
    {
      href: 'https://instagram.com',
      label: footer.social.instagram,
      icon: Instagram,
      ariaLabel: `在 ${footer.social.instagram} 上关注我们`,
    },
    {
      href: 'https://youtube.com',
      label: footer.social.youtube,
      icon: Youtube,
      ariaLabel: `在 ${footer.social.youtube} 上关注我们`,
    },
  ];

  return (
    <footer className="bg-gray-50 border-t" role="contentinfo" aria-label="网站页脚">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 品牌信息和描述 */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Link 
                href={`/${currentLocale}`} 
                className="text-xl font-bold text-gray-900 hover:text-primary transition-colors"
                aria-label="回到首页"
              >
                {footer.company}
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {footer.description}
            </p>
            
            {/* 社交媒体链接 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">
                {footer.social.title}
              </h3>
              <div className="flex space-x-3">
                {socialLinks.map(({ href, label, icon: Icon, ariaLabel }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-md hover:bg-gray-100"
                    aria-label={ariaLabel}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 产品链接 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {footer.sections.product}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 支持链接 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {footer.sections.support}
            </h3>
            <ul className="space-y-3">
              {supportLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 法律链接 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {footer.sections.legal}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 分割线 */}
        <hr className="my-8 border-gray-200" />

        {/* 底部版权信息 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600">
            {footer.copyright} © {currentYear} {footer.company}. {footer.allRightsReserved}
          </div>
          
          {/* 移动端法律链接 */}
          <div className="flex flex-wrap gap-4 text-sm">
            {legalLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// 使用示例:
/*
import { Footer } from '@/components/footer';

// 在布局或页面中使用
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
*/