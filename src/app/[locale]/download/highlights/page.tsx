'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function InstagramHighlightsDownloadPage() {
  const t = useI18n();

  // 将features对象转换为数组
  const featuresData = (t as any)('downloadPages.highlights.features');
  const features = typeof featuresData === 'object' ? Object.values(featuresData) as string[] : ['Curated Content', 'Permanent Storage', 'Batch Processing'];

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