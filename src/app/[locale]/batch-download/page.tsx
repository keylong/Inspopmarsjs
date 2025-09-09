'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function BatchDownloadPage() {
  const t = useI18n();

  // 将features对象转换为数组
  const featuresData = (t as any)('batchDownload.features');
  const features = typeof featuresData === 'object' ? Object.values(featuresData) as string[] : ['Batch Processing', 'Task Queue', 'Progress Tracking'];

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