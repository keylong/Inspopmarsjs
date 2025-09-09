import { SEOLayout } from '@/components/seo/seo-layout';
import { DownloadForm } from '@/components/download/download-form';

export default function BatchDownloadPage() {
  return (
    <SEOLayout contentType="batch">
      <DownloadForm 
        placeholder="添加多个Instagram链接进行批量下载..."
        acceptedTypes={['post', 'reels', 'igtv']}
        optimizedFor="批量下载"
        features={['批量处理', '任务队列', '进度跟踪']}
        enableBatch={true}
      />
    </SEOLayout>
  );
}