'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function InstagramPrivateDownloadPage() {
  const t = useI18n();

  // 将features对象转换为数组
  const featuresData = (t as any)('downloadPages.private.features');
  const features = typeof featuresData === 'object' ? Object.values(featuresData) as string[] : ['Private Content', 'Authorized Access', 'Secure Download'];

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