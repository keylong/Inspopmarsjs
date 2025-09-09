import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';

export default function InstagramReelsDownloadPage() {
  return (
    <SEOLayout contentType="reels">
      <DownloadForm 
        placeholder="粘贴Instagram Reels链接..."
        acceptedTypes={['reels']}
        optimizedFor="短视频下载"
        features={['高清画质', '无水印', '快速下载']}
      />
    </SEOLayout>
  );
}