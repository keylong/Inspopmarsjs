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
  Play
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InstagramPost, InstagramMedia, DownloadItem, DownloadResolution } from '@/types/instagram';
import { ResolutionSelector } from './resolution-selector';
import { MediaPreviewModal } from './media-preview-modal';
import { generateDownloadItems } from '@/lib/utils/instagram-data-transformer';
import { useI18n } from '@/lib/i18n/client';

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
      prev >= data.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev <= 0 ? data.media.length - 1 : prev - 1
    );
  };

  // 处理下载项生成
  const downloadItems = data ? generateDownloadItems(data) : [];

  // 获取内容类型标签
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post': return t?.download?.result?.post || '帖子';
      case 'story': return t?.download?.result?.story || '故事';
      case 'reel': return t?.download?.result?.reel || 'Reels';
      case 'igtv': return t?.download?.result?.igtv || 'IGTV';
      case 'highlight': return t?.download?.result?.highlight || '精彩时刻';
      default: return t?.download?.result?.content || '内容';
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t?.download?.result?.downloadFailed || '下载失败'}</h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              {errorCode && (
                <Badge variant="destructive" className="mb-4">
                  {t?.download?.result?.errorCode || '错误代码'}: {errorCode}
                </Badge>
              )}
              <Button onClick={onRetry} variant="outline">
                {t?.download?.result?.retryDownload || '重试下载'}
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
            {t?.download?.result?.completed || '下载完成'} - {getTypeLabel(data.type)}
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
                <span>{data.media.length} {t?.download?.result?.mediaFiles || '个媒体文件'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{t?.download?.result?.totalSize || '总大小'}: {formatFileSize(downloadItems.reduce((acc, item) => acc + (item.resolutions[0]?.size || 0), 0))}</span>
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
              <span>{t?.download?.result?.mediaDownload || '媒体下载'} ({downloadItems.length} 项)</span>
              <div className="flex items-center gap-2">
                {downloadItems.length > 1 && (
                  <Badge variant="secondary">
                    {data.type === 'carousel' ? (t?.download?.result?.carousel || '轮播') : (t?.download?.result?.multiMedia || '多媒体')}
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
                    const downloadItem = {
                      url: resolution.url,
                      filename: `${item.filename}_${resolution.label.replace(/\s+/g, '_')}.${item.type === 'video' ? 'mp4' : 'jpg'}`,
                      size: resolution.size,
                      type: item.type,
                      resolution: {
                        width: resolution.width,
                        height: resolution.height,
                        label: resolution.label
                      },
                      mediaId: item.mediaId
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
                共 {downloadItems.length} {t?.download?.result?.downloadOptions || '个下载选项，总大小约'} {formatFileSize(downloadItems.reduce((acc, item) => acc + (item.resolutions[0]?.size || 0), 0))}
              </div>
              <Button onClick={onDownloadAll} className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t?.download?.result?.downloadAll || '下载全部'}
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
  const t = useI18n();

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const currentResolution = item.resolutions.find(r => r.label === selectedResolution) || item.resolutions[0];
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentResolution.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(t?.download?.result?.copyFailed || '复制失败:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* 图片预览 */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <Image
          src={item.thumbnail}
          alt={`${t?.download?.result?.content || '媒体'} ${index + 1}`}
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
                {t?.download?.result?.video || '视频'}
              </>
            ) : (
              <>
                <ImageIcon className="w-3 h-3 mr-1" />
                {t?.download?.result?.image || '图片'}
              </>
            )}
          </Badge>
        </div>

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
            {item.type === 'video' ? (t?.download?.result?.videoContent || '视频内容') : (t?.download?.result?.imageContent || '图片内容')}
          </h3>
          <p className="text-sm text-gray-500">
            {t?.download?.result?.content || '媒体'} {index + 1} • {item.resolutions.length} {t?.download?.result?.resolutions || '种分辨率'}
          </p>
        </div>

        {/* 分辨率选择器 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t?.download?.result?.selectResolution || '选择分辨率'}:
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
{idx === 0 ? (t?.download?.result?.original || '原始') : resolution.label}
              </button>
            ))}
          </div>
          
          {/* 当前选择的分辨率信息 */}
          <div className="mt-2 text-xs text-gray-500">
            {currentResolution.width} × {currentResolution.height} • {formatFileSize(currentResolution.size)}
          </div>
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
            {t?.download?.result?.preview || '预览'}
          </Button>
          
          <Button 
            size="sm" 
            onClick={() => onDownload(currentResolution)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t?.common?.download || '下载'}
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