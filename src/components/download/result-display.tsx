'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Video, 
  Package,
  Eye,
  Share2,
  Calendar,
  User,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Play,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InstagramPost, InstagramMedia, DownloadItem, DownloadResolution } from '@/types/instagram';
import { ResolutionSelector } from './resolution-selector';
import { MediaPreviewModal } from './media-preview-modal';
import { generateDownloadItems } from '@/lib/utils/instagram-data-transformer';
import { useI18n } from '@/lib/i18n/client';
import { generateImageSrc } from '@/lib/utils/media-proxy';
import { useToast } from '@/lib/hooks/use-toast';

interface ResultDisplayProps {
  result: {
    data?: InstagramPost;
    downloads?: DownloadItem[];
    error?: string | {
      code: string;
      message: string;
      details?: any;
    };
  };
  onDownloadAll?: () => void;
  onDownloadSelected?: (items: DownloadItem[]) => void;
  onSingleDownload?: (item: DownloadItem) => void;
  onRetry?: () => void;
  className?: string;
}

export function ResultDisplay({ 
  result, 
  onDownloadAll,
  onDownloadSelected,
  onSingleDownload, 
  onRetry, 
  className 
}: ResultDisplayProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<InstagramMedia | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewStartIndex, setPreviewStartIndex] = useState(0);
  const t = useI18n();

  const { data, downloads, error } = result;

  // 复制URL到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // 获取媒体类型图标
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'carousel': return <Package className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  // 轮播导航
  const nextMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev >= (data?.media.length || 0) - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev <= 0 ? (data?.media.length || 0) - 1 : prev - 1
    );
  };

  // 处理下载项生成
  const downloadItems = data ? generateDownloadItems(data) : [];

  // 获取内容类型标签
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post': return '帖子';
      case 'story': return '故事';
      case 'reel': return 'Reels';
      case 'igtv': return 'IGTV';
      case 'highlight': return '精彩时刻';
      default: return '内容';
    }
  };

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorCode = typeof error === 'object' && error.code ? error.code : null;
    
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">下载失败</h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              {errorCode && (
                <Badge variant="destructive" className="mb-4">
                  错误代码: {errorCode}
                </Badge>
              )}
              <Button onClick={onRetry} variant="outline">
                重试下载
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      {/* 内容信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getMediaIcon(data.media[0]?.type || 'image')}
            下载完成 - {getTypeLabel(data.type)}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 内容详情 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>@{data.username}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(data.timestamp).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>{data.media.length} 个媒体文件</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>总大小: {formatFileSize(downloadItems.reduce((acc, item) => acc + (item.resolutions[0]?.size || 0), 0))}</span>
              </div>
            </div>
          </div>

          {/* 标题/描述 */}
          {data.caption && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 line-clamp-3">
                {data.caption}
              </p>
            </div>
          )}

          {/* 原始链接 */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600 truncate flex-1">
              {data.url}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(data.url)}
              className="text-blue-600 hover:bg-blue-100"
            >
              {copiedUrl === data.url ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 媒体预览和下载选项 */}
      {downloadItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>媒体下载 ({downloadItems.length} 项)</span>
              <div className="flex items-center gap-2">
                {downloadItems.length > 1 && (
                  <Badge variant="secondary">
                    {data.is_carousel ? '轮播' : '多媒体'}
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloadItems.map((item, index) => (
                <MediaDownloadCard
                  key={item.mediaId}
                  item={item}
                  index={index}
                  onDownload={(resolution) => {
                    // 构造下载项
                    const downloadItem: DownloadItem = {
                      mediaId: item.mediaId,
                      filename: `${item.filename}_${resolution.label.replace(/\s+/g, '_')}`,
                      type: item.type,
                      resolutions: [resolution],
                      ...(item.thumbnail ? { thumbnail: item.thumbnail } : {}),
                      defaultResolution: resolution.label
                    };
                    onSingleDownload?.(downloadItem);
                  }}
                  onPreview={() => {
                    setPreviewStartIndex(index);
                    setShowPreviewModal(true);
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {/* 批量下载操作 */}
      {downloadItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                共 {downloadItems.length} 个下载选项，总大小约 {formatFileSize(downloadItems.reduce((acc, item) => acc + (item.resolutions[0]?.size || 0), 0))}
              </div>
              <Button onClick={onDownloadAll} className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                下载全部
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 媒体预览模态框 */}
      <MediaPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        media={data.media}
        initialIndex={previewStartIndex}
        downloads={downloadItems}
        onDownload={(item) => {
          onSingleDownload?.(item);
        }}
      />
    </motion.div>
  );
}

// 新的媒体下载卡片组件
interface MediaDownloadCardProps {
  item: DownloadItem;
  index: number;
  onDownload: (resolution: DownloadResolution) => void;
  onPreview: () => void;
}

function MediaDownloadCard({ item, index, onDownload, onPreview }: MediaDownloadCardProps) {
  const [selectedResolution, setSelectedResolution] = useState<string>(item.defaultResolution || '');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const t = useI18n();
  const { toast, dismiss } = useToast();


  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const currentResolution = item.resolutions.find(r => r.label === selectedResolution) || item.resolutions[0];
  
  const copyToClipboard = async () => {
    if (!currentResolution) return;
    try {
      await navigator.clipboard.writeText(currentResolution.url);
      setCopied(true);
      toast.success('链接已复制', '下载链接已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      toast.error('复制失败', '无法复制链接到剪贴板');
    }
  };
  
  const handleDownload = async (resolution: DownloadResolution) => {
    if (isDownloading) {
      toast.warning('正在下载中', '请等待当前下载完成');
      return;
    }
    
    setIsDownloading(true);
    const loadingId = toast.loading(
      `正在下载${item.type === 'video' ? '视频' : '图片'}`, 
      `正在下载 ${resolution.label} 分辨率...`
    );
    
    try {
      // 调用父组件的下载函数
      await onDownload(resolution);
      
      // 成功提示
      dismiss(loadingId);
      toast.success('开始下载！', `${item.type === 'video' ? '视频' : '图片'}正在下载到您的设备`);
    } catch (err) {
      dismiss(loadingId);
      toast.error('下载失败', '请稍后重试或尝试其他分辨率');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* 媒体预览 */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <Image
          src={
            item.type === 'video' 
              ? (item.thumbnail && !item.thumbnail.includes('video') 
                 ? generateImageSrc(item.thumbnail, '/placeholder-video.jpg')
                 : '/placeholder-video.jpg')
              : generateImageSrc(item.thumbnail || '', '/placeholder-image.jpg')
          }
          alt={`媒体 ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* 预览按钮 */}
        <button
          onClick={onPreview}
          className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        
        {/* 媒体类型标识 */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-black/50 text-white border-0">
            {item.type === 'video' ? (
              <>
                <Video className="w-3 h-3 mr-1" />
                视频
              </>
            ) : (
              <>
                <ImageIcon className="w-3 h-3 mr-1" />
                图片
              </>
            )}
          </Badge>
        </div>

        {/* 视频播放按钮覆盖层 */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        )}

        {/* 序号 */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            {index + 1}
          </Badge>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4 space-y-4">
        {/* 标题 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-1">
            {item.type === 'video' ? '视频内容' : '图片内容'}
          </h3>
          <p className="text-sm text-gray-500">
            媒体 {index + 1} • {item.resolutions.length} 种分辨率
          </p>
        </div>

        {/* 分辨率选择器 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择分辨率:
          </label>
          <div className="flex flex-wrap gap-2">
            {item.resolutions.map((resolution, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedResolution(resolution.label)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedResolution === resolution.label
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
{idx === 0 ? '原始' : resolution.label}
              </button>
            ))}
          </div>
          
          {/* 当前选择的分辨率信息 */}
          {currentResolution && (
            <div className="mt-2 text-xs text-gray-500">
              {currentResolution.width} × {currentResolution.height} • {formatFileSize(currentResolution.size)}
            </div>
          )}
        </div>

        {/* 下载和预览按钮 */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="flex-1 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            预览
          </Button>
          
          <Button 
            size="sm" 
            onClick={() => currentResolution && handleDownload(currentResolution)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 relative overflow-hidden"
            disabled={!currentResolution || isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                下载中
                <span className="absolute inset-0 bg-white/10 animate-pulse" />
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                下载
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}