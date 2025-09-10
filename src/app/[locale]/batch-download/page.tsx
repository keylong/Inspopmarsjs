import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { getI18n } from '@/lib/i18n/server';
import { setStaticParamsLocale } from 'next-international/server';

interface BatchDownloadPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BatchDownloadPage({ params }: BatchDownloadPageProps) {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  // 使用硬编码的中文特性描述
  const features = ['批量处理', '任务队列', '进度追踪'];

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