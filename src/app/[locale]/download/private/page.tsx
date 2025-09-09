'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function InstagramPrivateDownloadPage() {
  const { t } = useI18n();

  return (
    <SEOLayout contentType="private">
      <DownloadForm 
        placeholder={t('downloadPages.private.inputPlaceholder')}
        acceptedTypes={['private']}
        optimizedFor={t('downloadPages.private.subheading')}
        features={t('downloadPages.private.features')}
        requireAuth={true}
      />
    </SEOLayout>
  );
}