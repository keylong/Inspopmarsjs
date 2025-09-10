import { Metadata } from 'next';
import { DownloadForm } from './download-form';
import { SEOLayout } from '@/components/seo/seo-layout';
import { ContentType } from '@/lib/seo/config';
import { generateSEOMetadata } from '@/components/seo/seo-metadata';

interface DownloadPageWrapperProps {
  locale: string;
  contentType: ContentType;
  translations: {
    placeholder: string;
    subheading?: string;
    features: string[];
  };
  acceptedTypes: string[];
  requireAuth?: boolean;
  enableBatch?: boolean;
}

// 服务器组件 - 处理 SEO 和翻译
export default function DownloadPageWrapper({
  locale,
  contentType,
  translations,
  acceptedTypes,
  requireAuth = false,
  enableBatch = false,
}: DownloadPageWrapperProps) {
  return (
    <SEOLayout contentType={contentType} locale={locale}>
      <DownloadForm
        placeholder={translations.placeholder}
        acceptedTypes={acceptedTypes}
        optimizedFor={translations.subheading}
        features={translations.features}
        requireAuth={requireAuth}
        enableBatch={enableBatch}
      />
    </SEOLayout>
  );
}

// 生成元数据的辅助函数
export async function generateDownloadPageMetadata(
  locale: string,
  contentType: ContentType
): Promise<Metadata> {
  return generateSEOMetadata(contentType, locale);
}