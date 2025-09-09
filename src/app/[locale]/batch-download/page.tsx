'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function BatchDownloadPage() {
  const t = useI18n();

  // 将features对象转换为数组
  const featuresObj = t('batchDownload.features') as Record<string, string>;
  const features = Object.values(featuresObj);

  return (
    <SEOLayout contentType="batch">
      <DownloadForm 
        placeholder={t('batchDownload.placeholder')}
        acceptedTypes={['post', 'reels', 'igtv']}
        optimizedFor={t('batchDownload.optimizedFor')}
        features={features}
        enableBatch={true}
      />
    </SEOLayout>
  );
}