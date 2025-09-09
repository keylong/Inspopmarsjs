'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function BatchDownloadPage() {
  const { t } = useI18n();

  return (
    <SEOLayout contentType="batch">
      <DownloadForm 
        placeholder={t('batchDownload.placeholder')}
        acceptedTypes={['post', 'reels', 'igtv']}
        optimizedFor={t('batchDownload.optimizedFor')}
        features={t('batchDownload.features')}
        enableBatch={true}
      />
    </SEOLayout>
  );
}