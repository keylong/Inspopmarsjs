'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function InstagramPrivateDownloadPage() {
  const t = useI18n();

  // 将features对象转换为数组
  const featuresObj = t('downloadPages.private.features') as Record<string, string>;
  const features = Object.values(featuresObj);

  return (
    <SEOLayout contentType="private">
      <DownloadForm 
        placeholder={t('downloadPages.private.inputPlaceholder')}
        acceptedTypes={['private']}
        optimizedFor={t('downloadPages.private.subheading')}
        features={features}
        requireAuth={true}
      />
    </SEOLayout>
  );
}