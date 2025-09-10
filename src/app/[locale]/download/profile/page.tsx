'use client';


import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';

export default function InstagramProfileDownloadPage() {
  return (
    <SEOLayout contentType="profile">
      <DownloadForm 
        placeholder="输入Instagram用户名..."
        acceptedTypes={['profile']}
        optimizedFor="头像下载"
        features={['高清头像', '原始尺寸', '快速获取']}
      />
    </SEOLayout>
  );
}