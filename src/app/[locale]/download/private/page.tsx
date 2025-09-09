import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';

export default function InstagramPrivateDownloadPage() {
  return (
    <SEOLayout contentType="private">
      <DownloadForm 
        placeholder="需要登录授权后下载私密内容..."
        acceptedTypes={['private']}
        optimizedFor="私密内容下载"
        features={['安全认证', '隐私保护', '授权访问']}
        requireAuth={true}
      />
    </SEOLayout>
  );
}