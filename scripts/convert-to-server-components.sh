#!/bin/bash

# 创建所有下载页面的服务器组件版本

cat > src/app/[locale]/download/reels/page.new.tsx << 'EOF'
import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'reels');
}

export default async function ReelsDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入 Reels 链接', subheading: 'Reels 短视频', features: ['高清视频', '无水印', '快速下载'] },
    'zh-TW': { placeholder: '請輸入 Reels 連結', subheading: 'Reels 短影片', features: ['高清影片', '無水印', '快速下載'] },
    'en': { placeholder: 'Enter Reels URL', subheading: 'Reels Videos', features: ['HD Video', 'No Watermark', 'Fast Download'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="reels" translations={t} acceptedTypes={['reels']} />;
}
EOF

cat > src/app/[locale]/download/stories/page.new.tsx << 'EOF'
import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'stories');
}

export default async function StoriesDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入用户名或 Stories 链接', subheading: '限时动态', features: ['24小时内容', '匿名查看', '批量保存'] },
    'zh-TW': { placeholder: '請輸入用戶名或 Stories 連結', subheading: '限時動態', features: ['24小時內容', '匿名查看', '批量保存'] },
    'en': { placeholder: 'Enter username or Stories URL', subheading: 'Stories', features: ['24-hour Content', 'Anonymous View', 'Batch Save'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="stories" translations={t} acceptedTypes={['stories']} />;
}
EOF

cat > src/app/[locale]/download/igtv/page.new.tsx << 'EOF'
import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'igtv');
}

export default async function IGTVDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入 IGTV 链接', subheading: 'IGTV 长视频', features: ['长视频下载', '高清质量', '支持字幕'] },
    'zh-TW': { placeholder: '請輸入 IGTV 連結', subheading: 'IGTV 長影片', features: ['長影片下載', '高清品質', '支援字幕'] },
    'en': { placeholder: 'Enter IGTV URL', subheading: 'IGTV Videos', features: ['Long Videos', 'HD Quality', 'Subtitle Support'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="igtv" translations={t} acceptedTypes={['igtv']} />;
}
EOF

cat > src/app/[locale]/download/highlights/page.new.tsx << 'EOF'
import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'highlights');
}

export default async function HighlightsDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入精选链接', subheading: '精选集锦', features: ['精选合集', '永久保存', '批量下载'] },
    'zh-TW': { placeholder: '請輸入精選連結', subheading: '精選集錦', features: ['精選合集', '永久保存', '批量下載'] },
    'en': { placeholder: 'Enter Highlights URL', subheading: 'Highlights', features: ['Story Highlights', 'Permanent Save', 'Batch Download'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="highlights" translations={t} acceptedTypes={['highlights']} />;
}
EOF

cat > src/app/[locale]/download/private/page.new.tsx << 'EOF'
import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'private');
}

export default async function PrivateDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入私人账号链接', subheading: '私人内容', features: ['私人内容', '授权访问', '安全下载'] },
    'zh-TW': { placeholder: '請輸入私人帳號連結', subheading: '私人內容', features: ['私人內容', '授權訪問', '安全下載'] },
    'en': { placeholder: 'Enter private account URL', subheading: 'Private Content', features: ['Private Content', 'Authorized Access', 'Secure Download'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="private" translations={t} acceptedTypes={['private']} requireAuth={true} />;
}
EOF

cat > src/app/[locale]/download/profile/page.new.tsx << 'EOF'
import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'profile');
}

export default async function ProfileDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '输入Instagram用户名...', subheading: '头像下载', features: ['高清头像', '原始尺寸', '快速获取'] },
    'zh-TW': { placeholder: '輸入Instagram用戶名...', subheading: '頭像下載', features: ['高清頭像', '原始尺寸', '快速獲取'] },
    'en': { placeholder: 'Enter Instagram username...', subheading: 'Profile Download', features: ['HD Avatar', 'Original Size', 'Quick Access'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="profile" translations={t} acceptedTypes={['profile']} />;
}
EOF

echo "✅ Created all new server component pages"
echo "Now run: ./scripts/apply-server-components.sh to apply changes"