'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Copy,
  RotateCcw
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
  onDownload?: (url: string, filename: string) => void;
  onCopyUrl?: () => void;
}

export function VideoPreviewModal({
  isOpen,
  onClose,
  videoSrc,
  title,
  onDownload,
  onCopyUrl
}: VideoPreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 格式化时间显示
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 播放/暂停切换
  const togglePlay = async () => {
    console.log('🎬 播放按钮被点击，当前状态:', { isPlaying, isLoading, hasError, videoSrc });
    
    if (videoRef.current) {
      try {
        if (isPlaying) {
          console.log('🎬 暂停视频');
          videoRef.current.pause();
        } else {
          console.log('🎬 开始播放视频');
          await videoRef.current.play();
        }
        // 状态由onPlay和onPause事件处理，不需要手动设置
      } catch (error) {
        console.error('🎬 视频播放失败:', error);
        setHasError(true);
      }
    } else {
      console.error('🎬 videoRef.current 为空');
    }
  };

  // 静音切换
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 重新加载视频
  const reloadVideo = () => {
    if (videoRef.current) {
      setHasError(false);
      setIsLoading(true);
      videoRef.current.load();
    }
  };

  // 处理进度条拖拽
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // 处理音量调节
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isPlaying, duration]);

  // Safari 浏览器检测
  useEffect(() => {
    const detectSafari = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const vendor = navigator.vendor?.toLowerCase() || '';
      
      // 检测 Safari 浏览器
      const isSafariBrowser = vendor.includes('apple') && 
                            (userAgent.includes('safari') && !userAgent.includes('chrome'));
      
      // 检测 iOS 设备
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      return isSafariBrowser || isIOS;
    };
    
    setIsSafari(detectSafari());
  }, []);

  // 重置状态当模态框关闭时
  useEffect(() => {
    if (!isOpen) {
      console.log('🎬 视频模态框关闭，重置状态');
      setIsPlaying(false);
      setCurrentTime(0);
      setIsLoading(true);
      setHasError(false);
    } else {
      console.log('🎬 视频模态框打开，视频源:', videoSrc);
    }
  }, [isOpen, videoSrc]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={containerRef}
          className="relative w-full max-w-4xl max-h-[90vh] mx-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭按钮 */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white border-white/20 z-10"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* 视频容器 */}
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
            {/* 视频元素 */}
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-auto max-h-[70vh] object-contain"
              preload="metadata"
              onLoadStart={() => {
                console.log('🎬 视频开始加载:', videoSrc);
                setIsLoading(true);
              }}
              onCanPlay={() => {
                console.log('🎬 视频可以播放');
                setIsLoading(false);
              }}
              onError={(e) => {
                console.error('🎬 视频加载错误:', e, '视频源:', videoSrc);
                setHasError(true);
                setIsLoading(false);
              }}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  console.log('🎬 视频元数据加载完成，时长:', videoRef.current.duration);
                  setDuration(videoRef.current.duration);
                }
              }}
              onPlay={() => {
                console.log('🎬 视频开始播放');
                setIsPlaying(true);
              }}
              onPause={() => {
                console.log('🎬 视频暂停');
                setIsPlaying(false);
              }}
            />

            {/* 加载状态 */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">加载中...</p>
                </div>
              </div>
            )}

            {/* 错误状态 */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <p className="text-sm mb-2">
                    {isSafari ? 'Safari 浏览器可能无法播放此视频' : '视频加载失败'}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={reloadVideo}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      重试
                    </Button>
                    {isSafari && onDownload && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => onDownload(videoSrc, title)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        直接下载
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 播放控制覆盖层 */}
            {!isLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20 rounded-full w-16 h-16"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
              </div>
            )}

            {/* 底部控制栏 */}
            {!isLoading && !hasError && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* 进度条 */}
                <div 
                  className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-2"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                {/* 控制按钮 */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10 p-2"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10 p-2"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-blue-500"
                    />

                    <span className="text-xs">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/10 p-2"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 视频信息和操作 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-b-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">
                  {
                    isSafari 
                      ? 'Safari 浏览器可能无法正常播放视频，建议直接下载'
                      : '使用空格键播放/暂停，M键静音，F键全屏，←→键快进/快退'
                  }
                </p>
              </div>
              <div className="flex gap-2">
                {onDownload && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onDownload(videoSrc, title)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    下载
                  </Button>
                )}
                {onCopyUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyUrl()}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    复制链接
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}