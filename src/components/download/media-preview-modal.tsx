'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InstagramMedia, DownloadItem } from '@/types/instagram';

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: InstagramMedia[];
  initialIndex?: number;
  downloads?: DownloadItem[];
  onDownload?: (item: DownloadItem) => void;
}

export function MediaPreviewModal({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
  downloads = [],
  onDownload
}: MediaPreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [videoError, setVideoError] = useState(false);

  const currentMedia = media[currentIndex];

  // 键盘导航
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          previousMedia();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextMedia();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case ' ':
          e.preventDefault();
          if (currentMedia?.is_video) {
            togglePlay();
          }
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          rotate();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, currentMedia?.is_video]);

  // 重置状态当媒体变化时
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setIsPlaying(false);
    setVideoError(false);
  }, [currentIndex]);

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const previousMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getCurrentMediaDownloads = () => {
    return downloads.filter(item => item.mediaId === currentMedia?.id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* 顶部工具栏 */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currentIndex + 1} / {media.length}
              </Badge>
              {currentMedia?.is_video && (
                <Badge variant="secondary" className="bg-purple-500/80 text-white">
                  <Play className="w-3 h-3 mr-1" />
                  视频
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 左侧导航 */}
        {media.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMedia}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        {/* 右侧导航 */}
        {media.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMedia}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}

        {/* 媒体内容 */}
        <div className="w-full h-full flex items-center justify-center p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentIndex}-${currentMedia?.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-full"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              {currentMedia?.is_video && !videoError ? (
                <video
                  src={currentMedia.video_url || currentMedia.url}
                  poster={currentMedia.thumbnail || currentMedia.url}
                  controls
                  autoPlay={isPlaying}
                  muted={isMuted}
                  className="max-w-full max-h-full object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error('视频加载失败:', e);
                    setVideoError(true);
                  }}
                  onLoadStart={() => console.log('开始加载视频:', currentMedia.video_url || currentMedia.url)}
                  onCanPlay={() => console.log('视频可以播放')}
                />
              ) : currentMedia?.is_video && videoError ? (
                <div className="max-w-full max-h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">视频无法播放</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      视频文件可能正在处理中或暂时无法访问
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setVideoError(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        重试播放
                      </button>
                      {currentMedia.thumbnail && (
                        <div className="text-xs text-gray-500">
                          显示视频缩略图
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={currentMedia?.url || ''}
                  alt={`媒体 ${currentIndex + 1}`}
                  width={currentMedia?.width || 800}
                  height={currentMedia?.height || 800}
                  className="max-w-full max-h-full object-contain"
                  priority
                  onError={(e) => {
                    console.error('图片加载失败:', currentMedia?.url);
                    const img = e.target as HTMLImageElement;
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzljYTNhZiI+CiAgICDlqpLkvZPliqDovb3lpLHotKUKICA8L3RleHQ+Cjwvc3ZnPgo=';
                  }}
                  onLoadStart={() => console.log('开始加载图片:', currentMedia?.url)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 底部工具栏 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            {/* 缩放控制 */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm min-w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                disabled={zoom >= 3}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="text-white hover:bg-white/20"
              >
                1:1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={rotate}
                className="text-white hover:bg-white/20"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>

            {/* 下载按钮 */}
            <div className="flex items-center gap-2">
              {getCurrentMediaDownloads().length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const firstItem = getCurrentMediaDownloads()[0];
                    if (firstItem) onDownload?.(firstItem);
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 缩略图导航栏 */}
        {media.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
            <div className="flex gap-2 bg-black/50 p-2 rounded-lg max-w-screen-md overflow-x-auto">
              {media.map((mediaItem, index) => (
                <button
                  key={mediaItem.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-white scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <Image
                    src={mediaItem.thumbnail || mediaItem.url}
                    alt={`缩略图 ${index + 1}`}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                  {mediaItem.is_video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 键盘快捷键提示 */}
        <div className="absolute top-20 right-4 z-10 bg-black/50 rounded-lg p-3 text-white text-xs space-y-1">
          <div className="font-semibold mb-2">快捷键</div>
          <div>← → 切换图片</div>
          <div>+/- 缩放</div>
          <div>R 旋转</div>
          <div>ESC 关闭</div>
          {currentMedia?.is_video && <div>空格 播放/暂停</div>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}