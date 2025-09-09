'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function InstagramHighlightsDownloadPage() {
  const t = useI18n();

  // 将features对象转换为数组
  const featuresObj = t('downloadPages.highlights.features') as Record<string, string>;
  const features = Object.values(featuresObj);

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