'use client'

export const dynamic = 'force-dynamic';

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function InstagramPrivateDownloadPage() {
  const t = useI18n();

  // 使用硬编码的中文特性描述
  const features = ['私人内容', '授权访问', '安全下载'];

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