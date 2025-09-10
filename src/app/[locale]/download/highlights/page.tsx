'use client'


import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function InstagramHighlightsDownloadPage() {
  const t = useI18n();

  // 使用硬编码的中文特性描述
  const features = ['精选内容', '永久保存', '批量处理'];

  return (
    <SEOLayout contentType="highlights">
      <DownloadForm 
        placeholder={t('downloadPages.highlights.inputPlaceholder')}
        acceptedTypes={['highlights']}
        optimizedFor={t('downloadPages.highlights.subheading')}
        features={features}
      />
    </SEOLayout>
  );
}