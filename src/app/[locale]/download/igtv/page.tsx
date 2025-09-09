import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';

export default function IGTVDownloadPage() {
  return (
    <SEOLayout contentType="igtv">
      <DownloadForm 
        placeholder="粘贴IGTV视频链接..."
        acceptedTypes={['igtv']}
        optimizedFor="长视频下载"
        features={['长视频支持', '高清画质', '快速下载']}
      />
    </SEOLayout>
  );
}