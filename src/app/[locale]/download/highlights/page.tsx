'use client'

import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';
import { useI18n } from '@/lib/i18n/client';

export default function InstagramHighlightsDownloadPage() {
  const { t } = useI18n();

  return (
    <SEOLayout contentType="highlights">
      <DownloadForm 
        placeholder={t('downloadPages.highlights.inputPlaceholder')}
        acceptedTypes={['highlights']}
        optimizedFor={t('downloadPages.highlights.subheading')}
        features={t('downloadPages.highlights.features')}
      />
    </SEOLayout>
  );
}