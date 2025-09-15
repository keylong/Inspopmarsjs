'use client';


import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function BatchDownloadPage() {
  const t = useI18n();

  // 使用硬编码的中文特性描述
  const features = ['批量处理', '任务队列', '进度追踪'];

  return (
    <SEOLayout contentType="batch">
      <DownloadForm 
        placeholder={t('batchDownload.placeholder')}
        optimizedFor={t('batchDownload.optimizedFor')}
        features={features}
      />
    </SEOLayout>
  );
}