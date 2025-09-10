'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Download,
  Image as ImageIcon,
  Film,
  Link as LinkIcon,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Instagram,
  ZoomIn,
  X,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';

import { InstagramPost, DownloadItem } from '@/types/instagram';
import { generateImageSrc, isVideoUrl, generateVideoSrc } from '@/lib/utils/media-proxy';
import { VideoPreviewModal } from '@/components/ui/video-preview-modal';

// 生成内联SVG占位符
const generatePlaceholder = (width: number, height: number, text: string) => {
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" 
            font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">
        ${text}
      </text>
    </svg>
  `.trim();
  
  // 使用 encodeURIComponent 替代 btoa 来处理中文字符
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
};

interface DownloadResult {
  success: boolean;
  data?: InstagramPost;
  downloads?: DownloadItem[];
  error?: string;
  _mode?: string;
}

export default function InstagramPostDownloadPage() {
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string; alt: string} | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{src: string; title: string} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setResult({
        success: false,
        error: t('download.form.urlRequired')
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/instagram/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data: DownloadResult = await response.json();
      setResult(data);
      
      if (!data.success) {
        console.error('下载失败:', data.error);
      }
    } catch (error) {
      console.error('API请求失败:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : t('errors.networkError')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    inputRef.current?.focus();
  };

  const handleCopyUrl = async (downloadUrl: string) => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      // 可以添加成功提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 处理媒体点击预览（支持图片和视频）
  const handleMediaClick = (src: string, alt: string, isVideo: boolean = false) => {
    if (isVideo) {
      // 对于视频，直接使用src（已经是正确的代理URL）
      setSelectedVideo({ src: src, title: alt });
      setVideoModalOpen(true);
      return;
    }
    // 只有图片才使用Image组件的模态框
    setSelectedImage({ src, alt });
    setImageModalOpen(true);
  };

  // 处理直接下载
  const handleDirectDownload = (url: string, filename?: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'instagram-image';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理键盘事件（Escape 键关闭模态框）
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (imageModalOpen) {
          setImageModalOpen(false);
          setSelectedImage(null);
        }
        if (videoModalOpen) {
          setVideoModalOpen(false);
          setSelectedVideo(null);
        }
      }
    };

    if (imageModalOpen || videoModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // 恢复滚动
    };
  }, [imageModalOpen, videoModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="text-sm mb-8">
          <Link href={`/${currentLocale}`} className="text-blue-600 hover:underline">{t('nav.home')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/${currentLocale}/download`} className="text-blue-600 hover:underline">{t('downloadCenter.title')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{t('downloadPages.post.title')}</span>
        </nav>

        {/* 返回按钮 */}
        <Link href={`/${currentLocale}/download`}>
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')} {t('downloadCenter.title')}
          </Button>
        </Link>

        {/* 主内容区域 */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              {t('downloadPages.post.heading')}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {t('downloadPages.post.subheading')}
            </p>
          </div>

          {/* 下载表单 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LinkIcon className="w-5 h-5" />
                {t('download.form.urlLabel')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    ref={inputRef}
                    type="url"
                    placeholder={t('downloadPages.post.inputPlaceholder')}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    disabled={loading || !url}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('download.form.downloading')}
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        {t('download.form.startDownload')}
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* 示例链接 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{t('download.form.supportedTypes')}</strong>
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• https://www.instagram.com/p/ABC123...</li>
                  <li>• https://instagram.com/p/ABC123...</li>
                  <li>• https://instagr.am/p/ABC123...</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 结果显示 */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {result.success ? (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      {t('download.result.completed')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.data && (result.data.media?.length > 0 || result.data.url) ? (
                      <div className="space-y-6">
                        {/* 用户信息和标题 */}
                        {result.data.username && (
                          <div className="flex items-center gap-3 p-4 bg-white/80 rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                              <Instagram className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">@{result.data.username}</h4>
                              {result.data.caption && (
                                <p className="text-sm text-gray-600 truncate max-w-md">{result.data.caption}</p>
                              )}
                            </div>
                            {result._mode && (
                              <div className="ml-auto">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  {result._mode.includes('mock') ? '演示数据' : '真实数据'}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 图片画廊网格 */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            {t('download.result.selectResolution')}
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* 使用我们新的媒体数组结构 */}
                            {result.data.media?.map((media, index) => (
                              <MediaCard 
                                key={media.id || index}
                                media={media}
                                index={index}
                                onImageClick={handleMediaClick}
                                onDirectDownload={handleDirectDownload}
                                onCopyUrl={handleCopyUrl}
                                t={t}
                              />
                            ))}
                          </div>
                        </div>

                        {/* 下载统计信息 */}
                        {result.downloads && result.downloads.length > 0 && (
                          <div className="mt-8">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="text-lg font-semibold mb-2 text-blue-900 flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                {t('download.result.mediaDownload')}
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-blue-600 font-medium">{t('download.result.mediaFiles')}：</span>
                                  <span className="text-blue-800">{result.downloads.length} 个</span>
                                </div>
                                <div>
                                  <span className="text-blue-600 font-medium">{t('download.result.image')}：</span>
                                  <span className="text-blue-800">{result.downloads.filter(d => d.type === 'image').length} 个</span>
                                </div>
                                <div>
                                  <span className="text-blue-600 font-medium">{t('download.result.video')}：</span>
                                  <span className="text-blue-800">{result.downloads.filter(d => d.type === 'video').length} 个</span>
                                </div>
                                <div>
                                  <span className="text-blue-600 font-medium">{t('download.result.totalSize')}：</span>
                                  <span className="text-blue-800">
                                    {(result.downloads.reduce((acc, d) => acc + (d.resolutions?.[0]?.size || 0), 0) / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {t('download.result.downloadFailed')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Alert variant="destructive" className="mb-8">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {typeof result.error === 'string' 
                      ? result.error 
                      : (result.error as any)?.message || (result.error as any)?.toString() || t('download.form.downloadFailed')
                    }
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* 使用步骤 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('downloadPages.post.howToUse')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('download.step1')}
              </h3>
              <p className="text-gray-600">
                {t('download.step1')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('download.step2')}
              </h3>
              <p className="text-gray-600">
                {t('download.step2')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('download.step3')}
              </h3>
              <p className="text-gray-600">
                {t('download.step4')}
              </p>
            </div>
          </div>
        </section>

        {/* 功能特色 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('download.features.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-green-500 mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('download.features.highQuality')}</h3>
              <p className="text-gray-600 text-sm">
                {t('download.features.highQualityDesc')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-green-500 mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('download.features.noWatermark')}</h3>
              <p className="text-gray-600 text-sm">
                {t('download.features.noWatermarkDesc')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-green-500 mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('download.features.fastSpeed')}</h3>
              <p className="text-gray-600 text-sm">
                {t('download.features.fastSpeedDesc')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-green-500 mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">免费使用</h3>
              <p className="text-gray-600 text-sm">
                完全免费的服务，无需注册或付费即可使用。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-green-500 mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">隐私保护</h3>
              <p className="text-gray-600 text-sm">
                不保存用户数据，保护您的隐私和安全。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-green-500 mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">跨平台支持</h3>
              <p className="text-gray-600 text-sm">
                支持所有设备和浏览器，随时随地使用。
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 图片放大模态框 */}
      {imageModalOpen && selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setImageModalOpen(false);
            setSelectedImage(null);
          }}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // 防止点击图片时关闭模态框
          >
            {/* 关闭按钮 */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute -top-12 right-0 bg-white/90 hover:bg-white text-gray-800 shadow-lg z-10"
              onClick={() => {
                setImageModalOpen(false);
                setSelectedImage(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* 图片容器 */}
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = generatePlaceholder(800, 600, '图片加载失败');
                }}
              />
              
              {/* 图片信息和操作栏 */}
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {selectedImage.alt}
                    </h3>
                    <p className="text-sm text-gray-500">
                      点击图片外部区域或按 ESC 键关闭
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleDirectDownload(selectedImage.src, selectedImage.alt)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {t('common.download')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUrl(selectedImage.src)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {t('common.copy')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 视频预览模态框 */}
      {selectedVideo && (
        <VideoPreviewModal
          isOpen={videoModalOpen}
          onClose={() => {
            setVideoModalOpen(false);
            setSelectedVideo(null);
          }}
          videoSrc={selectedVideo.src}
          title={selectedVideo.title}
          onDownload={handleDirectDownload}
          onCopyUrl={handleCopyUrl}
        />
      )}
    </div>
  );
}

// 媒体卡片组件 - 解决 Hooks 在循环中使用的问题
import { InstagramMedia, DisplayResource } from '@/types/instagram';

interface MediaCardProps {
  media: InstagramMedia;
  index: number;
  onImageClick: (url: string, title: string, isVideo?: boolean) => void;
  onDirectDownload: (url: string, filename: string) => void;
  onCopyUrl: (url: string) => void;
  t: any;
}

function MediaCard({ media, index, onImageClick, onDirectDownload, onCopyUrl, t }: MediaCardProps) {
  // 状态管理：当前选中的分辨率
  const [selectedResolution, setSelectedResolution] = useState(
    media.display_resources && media.display_resources.length > 0 
      ? media.display_resources[0] 
      : null
  );
  
  // 获取当前显示的URL和信息
  const currentUrl = selectedResolution?.src || media.url;
  const currentWidth = selectedResolution?.config_width || media.width;
  const currentHeight = selectedResolution?.config_height || media.height;
  const currentLabel = selectedResolution?.label || '原图';
  

  // 调试日志
  console.log('Media object:', {
    is_video: media.is_video,
    thumbnail: media.thumbnail,
    url: media.url,
    video_url: media.video_url,
    display_resources: media.display_resources?.length
  });

  // 对于视频，获取下载URL和预览URL，使用智能媒体代理
  // 使用 SVG 占位符替代不存在的图片文件
  const fallbackPlaceholder = generatePlaceholder(400, 400, media.is_video ? '视频预览' : '图片加载中');
  
  const previewUrl = media.is_video 
    ? (media.thumbnail // 视频使用 thumbnail 字段作为缩略图
        ? generateImageSrc(media.thumbnail, fallbackPlaceholder)
        : media.url // 如果没有 thumbnail，尝试使用 url
          ? generateImageSrc(media.url, fallbackPlaceholder)
          : fallbackPlaceholder) // 最后使用占位图
    : generateImageSrc(currentUrl, fallbackPlaceholder); // 图片直接使用当前选择的分辨率URL
  
  console.log('Generated previewUrl:', previewUrl);
  const downloadUrl = media.is_video ? (media.video_url || currentUrl) : currentUrl; // 下载使用视频URL或当前选择的分辨率
  
  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={previewUrl}
          alt={`Instagram 媒体 ${index + 1}`}
          width={400}
          height={400}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onImageClick(media.is_video ? downloadUrl : currentUrl, `Instagram 媒体 ${index + 1}`, media.is_video)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // 避免无限循环：只在不是占位符的情况下设置占位符
            if (!target.src.startsWith('data:image/svg+xml')) {
              console.warn('图片加载失败，使用占位符:', target.src);
              target.src = generatePlaceholder(400, 400, '媒体加载失败');
            }
          }}
        />
        {/* 视频标识 */}
        {media.is_video && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Film className="w-3 h-3" />
            {t('download.result.video')}
          </div>
        )}
        {/* 图片标识 */}
        {!media.is_video && (
          <div className="absolute top-2 left-2 bg-white/90 text-gray-800 px-2 py-1 rounded text-xs flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            {t('download.result.image')}
          </div>
        )}
        {/* 媒体序号 */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          #{index + 1}
        </div>
        
        {/* 视频播放按钮覆盖层 */}
        {media.is_video && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        
        {/* 分辨率选择器 */}
        {media.display_resources && media.display_resources.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('download.result.selectResolution')}:
            </label>
            <div className="flex flex-wrap gap-2">
              {media.display_resources.map((resource: DisplayResource, resIndex: number) => (
                <button
                  key={resIndex}
                  onClick={() => setSelectedResolution(resource)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedResolution === resource
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {resIndex === 0 ? t('download.result.original') : resource.label || `${resource.config_width}×${resource.config_height}`}
                </button>
              ))}
            </div>
            {/* 当前选择的分辨率信息 */}
            <div className="mt-2 text-xs text-gray-500">
              {currentWidth} × {currentHeight} • {currentLabel}
            </div>
          </div>
        )}
        
        {/* 操作按钮区域 */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-gray-700 hover:text-gray-900"
            onClick={() => onImageClick(media.is_video ? downloadUrl : currentUrl, `Instagram 媒体 ${index + 1}`, media.is_video)}
          >
            <ZoomIn className="w-4 h-4 mr-1" />
            {t('download.result.preview')}
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onDirectDownload(
              downloadUrl, 
              `instagram-${media.id || index}-${media.is_video ? 'video' : `${currentWidth}x${currentHeight}`}.${media.is_video ? 'mp4' : 'jpg'}`
            )}
          >
            <Download className="w-4 h-4 mr-1" />
            {t('common.download')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-gray-700 hover:text-gray-900"
            onClick={() => onCopyUrl(downloadUrl)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
