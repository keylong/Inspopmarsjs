import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';

export default function InstagramHighlightsDownloadPage() {
  return (
    <SEOLayout contentType="highlights">
      <DownloadForm 
        placeholder="输入Instagram用户名..."
        acceptedTypes={['highlights']}
        optimizedFor="精选故事下载"
        features={['批量下载', '分类管理', '永久保存']}
      />
    </SEOLayout>
  );
}