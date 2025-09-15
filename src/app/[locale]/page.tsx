import { Metadata } from 'next';
import { HomeContent } from './home-content';
import { locales } from '@/lib/i18n/config';
// import { type Locale } from '@/lib/i18n/config'; // 暂时注释未使用的导入
import { generateHomeMetadata } from '@/components/seo/seo-metadata';

// 生成静态参数
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 生成元数据 - 使用增强的 SEO 配置
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateHomeMetadata(locale);
}

export default function HomePage() {
  return <HomeContent />;
}