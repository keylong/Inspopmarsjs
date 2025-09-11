'use client';

export const dynamic = 'force-dynamic';

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
import { useSearchParams } from 'next/navigation';
import { useOptionalAuth } from '@/hooks/useAuth';
import { useToast } from '@/lib/hooks/use-toast';

import { InstagramPost, DownloadItem } from '@/types/instagram';
import { generateImageSrc, isVideoUrl, generateVideoSrc } from '@/lib/utils/media-proxy';
import { VideoPreviewModal } from '@/components/ui/video-preview-modal';
import { PremiumUpgradeModal } from '@/components/ui/premium-upgrade-modal';
import { IPLimitModal } from '@/components/ui/ip-limit-modal';

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
  needsUpgrade?: boolean;
  meta?: {
    remainingUsage?: number;
    usageDeducted?: boolean;
    userAuthenticated?: boolean;
    actualQuality?: string;
    requestedQuality?: string;
    ipDownloads?: {
      downloadCount: number;
      remainingDownloads: number;
      resetTime?: number;
    };
  };
  ipLimited?: boolean;
}

export default function InstagramPostDownloadPage() {
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useOptionalAuth();
  const { toast, dismiss } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string; alt: string} | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{src: string; title: string} | null>(null);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [ipLimitModalOpen, setIpLimitModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [showLoadingPrompt, setShowLoadingPrompt] = useState(false);

  // 检查URL参数并自动填充和提交
  useEffect(() => {
    const urlParam = searchParams?.get('url');
    if (urlParam && !autoSubmitted) {
      setUrl(urlParam);
      setAutoSubmitted(true);
      // 延迟提交，让UI先渲染
      setTimeout(() => {
        handleAutoSubmit(urlParam);
      }, 100);
    }
  }, [searchParams, autoSubmitted]);

  // 滚动到结果区域
  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleAutoSubmit = async (autoUrl: string) => {
    if (!autoUrl.trim()) return;

    setLoading(true);
    setResult(null);
    // 如果是未登录用户，立即显示注册提示
    if (!isAuthenticated) {
      setShowLoadingPrompt(true);
    }

    try {
      const response = await fetch('/api/instagram/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: autoUrl.trim(),
          quality: isAuthenticated ? 'original' : 'hd'  // 登录用户请求原图，未登录用户限制为HD
        }),
      });

      const data: DownloadResult = await response.json();
      
      // 如果是次数不足错误，显示升级模态框
      if (!data.success && data.needsUpgrade) {
        setPremiumModalOpen(true);
        setLoading(false);
        return;
      }
      
      // 如果是IP限制错误，显示IP限制弹窗
      if (!data.success && data.ipLimited) {
        setIpLimitModalOpen(true);
        setLoading(false);
        return;
      }
      
      setResult(data);
      
      // 无论成功或失败，都滚动到结果区域
      setTimeout(() => {
        scrollToResults();
      }, 100);
      
      if (!data.success) {
        console.error('下载失败:', data.error);
      } else if (data.meta?.usageDeducted) {
        console.log('自动下载成功，已扣除1次下载次数，剩余:', data.meta.remainingUsage);
      }
    } catch (error) {
      console.error('API请求失败:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : t('errors.networkError')
      });
    } finally {
      setLoading(false);
      setShowLoadingPrompt(false);
    }
  };

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
    // 如果是未登录用户，立即显示注册提示
    if (!isAuthenticated) {
      setShowLoadingPrompt(true);
    }

    try {
      const response = await fetch('/api/instagram/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(),
          quality: isAuthenticated ? 'original' : 'hd'  // 登录用户请求原图，未登录用户限制为HD
        }),
      });

      const data: DownloadResult = await response.json();
      
      // 如果是次数不足错误，显示升级模态框
      if (!data.success && data.needsUpgrade) {
        setPremiumModalOpen(true);
        setLoading(false);
        return;
      }
      
      // 如果是IP限制错误，显示IP限制弹窗
      if (!data.success && data.ipLimited) {
        setIpLimitModalOpen(true);
        setLoading(false);
        return;
      }
      
      setResult(data);
      
      // 无论成功或失败，都滚动到结果区域
      setTimeout(() => {
        scrollToResults();
      }, 100);
      
      if (!data.success) {
        console.error('下载失败:', data.error);
      } else if (data.meta?.usageDeducted) {
        console.log('下载成功，已扣除1次下载次数，剩余:', data.meta.remainingUsage);
      }
    } catch (error) {
      console.error('API请求失败:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : t('errors.networkError')
      });
    } finally {
      setLoading(false);
      setShowLoadingPrompt(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    inputRef.current?.focus();
  };

  const handleCopyUrl = async () => {
    try {
      // 生成下载页面链接，使用原始Instagram URL
      const downloadPageUrl = `${window.location.origin}/${currentLocale}/download/post?url=${encodeURIComponent(url)}`;
      await navigator.clipboard.writeText(downloadPageUrl);
      toast.success('链接已复制', '下载链接已复制到剪贴板');
      console.log('复制的链接:', downloadPageUrl);
    } catch (error) {
      console.error('复制失败:', error);
      toast.error('复制失败', '无法复制链接到剪贴板');
    }
  };

  // 处理媒体点击预览（支持图片和视频）
  const handleMediaClick = (src: string, alt: string, isVideo: boolean = false) => {
    console.log('🖱️ handleMediaClick 被调用:', { src: src?.substring(0, 100), alt, isVideo });
    
    if (isVideo) {
      console.log('🎬 检测到视频，打开视频模态框');
      // 对于视频，直接使用src（已经是正确的代理URL）
      setSelectedVideo({ src: src, title: alt });
      setVideoModalOpen(true);
      return;
    }
    console.log('🖼️ 检测到图片，打开图片模态框');
    // 只有图片才使用Image组件的模态框
    setSelectedImage({ src, alt });
    setImageModalOpen(true);
  };

  // 处理直接下载
  const handleDirectDownload = async (url: string, filename?: string) => {
    // 防止重复点击
    const downloadKey = `${url}-${filename}`;
    if (downloadingItems.has(downloadKey)) {
      toast.warning('正在下载中', '请等待当前下载完成');
      return;
    }
    
    // 添加到下载中集合
    setDownloadingItems(prev => new Set(prev).add(downloadKey));
    
    // 判断媒体类型
    const isVideo = url.includes('video') || filename?.includes('video') || filename?.includes('.mp4');
    const mediaType = isVideo ? '视频' : '图片';
    
    // 显示下载开始提示
    const loadingId = toast.loading(`正在下载${mediaType}`, `正在处理您的下载请求...`);
    
    try {
      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'instagram-media';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 下载成功提示
      setTimeout(() => {
        dismiss(loadingId);
        toast.success('开始下载！', `${mediaType}正在下载到您的设备`);
      }, 500);
    } catch (error) {
      console.error('下载失败:', error);
      dismiss(loadingId);
      toast.error('下载失败', '请稍后重试或尝试其他分辨率');
    } finally {
      // 3秒后从下载中集合移除
      setTimeout(() => {
        setDownloadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(downloadKey);
          return newSet;
        });
      }, 3000);
    }
  };

  // 处理VIP升级模态框操作
  const handlePremiumSignUp = () => {
    setPremiumModalOpen(false);
    // 跳转到注册页面
    window.location.href = `/${currentLocale}/signin?tab=register`;
  };

  const handlePremiumLogin = () => {
    setPremiumModalOpen(false);
    // 跳转到登录页面
    window.location.href = `/${currentLocale}/signin`;
  };

  // 处理IP限制弹窗操作
  const handleIpLimitRegister = () => {
    setIpLimitModalOpen(false);
    // 跳转到注册页面
    window.location.href = `/${currentLocale}/signin?tab=register`;
  };

  const handleIpLimitLogin = () => {
    setIpLimitModalOpen(false);
    // 跳转到登录页面
    window.location.href = `/${currentLocale}/signin`;
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

              {/* 下载中的注册提示 - 立即显示 */}
              {showLoadingPrompt && !isAuthenticated && (
                <motion.div 
                  className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200 shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-800 text-lg">正在为您解析内容...</h4>
                      <p className="text-orange-700 text-sm">免费用户需要等待，注册会员立即享受极速下载！</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-3 mb-3">
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-yellow-500">👑</span>
                      升级VIP会员，解锁全部特权：
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <strong>秒速下载</strong> - 无任何等待时间
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <strong>原图画质</strong> - 最高分辨率，完美画质
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <strong>无限下载</strong> - 每月500次下载额度
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <strong>批量下载</strong> - 一键下载多个内容
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg"
                      onClick={() => window.location.href = `/${currentLocale}/signin?tab=register`}
                    >
                      <span className="mr-2">🚀</span>
                      立即注册VIP
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                      onClick={() => window.location.href = `/${currentLocale}/signin`}
                    >
                      已有账户？登录
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">
                      💰 限时优惠：首月仅需 ¥9.9，立省 ¥20
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 用户下载次数状态 */}
              {isAuthenticated && result?.meta && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 font-medium">
                      剩余下载次数：
                    </span>
                    <span className="text-blue-800 font-bold">
                      {result.meta.remainingUsage || 0}
                    </span>
                  </div>
                  {result.meta.usageDeducted && (
                    <p className="text-blue-600 text-xs mt-1">
                      ✅ 本次下载已扣除1次，剩余 {result.meta.remainingUsage} 次
                    </p>
                  )}
                </div>
              )}
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
              ref={resultsRef}
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
                                isAuthenticated={isAuthenticated}
                                isDownloading={downloadingItems.has(`${media.is_video ? media.video_url : media.url}-instagram-${media.id || index}-${media.is_video ? 'video' : `${media.display_resources?.[0]?.config_width}x${media.display_resources?.[0]?.config_height}`}.${media.is_video ? 'mp4' : 'jpg'}`)}
                                onImageClick={handleMediaClick}
                                onDirectDownload={handleDirectDownload}
                                onCopyUrl={handleCopyUrl}
                                onPremiumUpgrade={() => setPremiumModalOpen(true)}
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
                      onClick={() => handleCopyUrl()}
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

      {/* VIP升级模态框 */}
      <PremiumUpgradeModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        onSignUp={handlePremiumSignUp}
        onLogin={handlePremiumLogin}
      />

      {/* IP限制弹窗 */}
      <IPLimitModal
        isOpen={ipLimitModalOpen}
        onClose={() => setIpLimitModalOpen(false)}
        remainingHours={24}
        onRegister={handleIpLimitRegister}
        onLogin={handleIpLimitLogin}
      />
    </div>
  );
}

// 媒体卡片组件 - 解决 Hooks 在循环中使用的问题
import { InstagramMedia, DisplayResource } from '@/types/instagram';

// 获取分辨率标签的辅助函数
function getResolutionLabel(index: number, isAuthenticated: boolean, resource: DisplayResource, t: any): string {
  if (index === 0) {
    // 第一个选项（原图）
    return isAuthenticated ? t('download.result.original') : '原图 🔒';
  }
  
  // 其他选项
  if (index === 1) return '中等质量';
  if (index === 2) return '低质量';
  
  return resource.label || `${resource.config_width}×${resource.config_height}`;
}

interface MediaCardProps {
  media: InstagramMedia;
  index: number;
  isAuthenticated: boolean;
  isDownloading: boolean;
  onImageClick: (url: string, title: string, isVideo?: boolean) => void;
  onDirectDownload: (url: string, filename: string) => void;
  onCopyUrl: () => void;
  onPremiumUpgrade: () => void;
  t: any;
}

function MediaCard({ media, index, isAuthenticated, isDownloading, onImageClick, onDirectDownload, onCopyUrl, onPremiumUpgrade, t }: MediaCardProps) {
  // 处理分辨率选择
  const handleResolutionClick = (resource: DisplayResource, resIndex: number) => {
    // 如果是原图且用户未登录，显示VIP升级模态框
    if (resIndex === 0 && !isAuthenticated) {
      onPremiumUpgrade();
      return;
    }
    
    // 正常选择分辨率
    setSelectedResolution(resource);
  };
  // 获取分辨率选项（未登录用户也显示所有选项，用于引导注册）
  const getFilteredResolutions = () => {
    if (!media.display_resources || media.display_resources.length === 0) {
      return [];
    }
    
    // 所有用户都显示所有分辨率选项
    return media.display_resources;
  };

  const filteredResolutions = getFilteredResolutions();
  
  // 状态管理：当前选中的分辨率
  const getDefaultResolution = () => {
    if (filteredResolutions.length === 0) return null;
    
    // 未登录用户：默认选择第二个选项（中等质量）
    if (!isAuthenticated && filteredResolutions.length > 1) {
      return filteredResolutions[1];
    }
    
    // 登录用户：默认选择第一个选项（原图）
    return filteredResolutions[0];
  };
  
  const [selectedResolution, setSelectedResolution] = useState(getDefaultResolution());
  
  // 获取当前显示的URL和信息
  const currentUrl = selectedResolution?.src || media.url;
  const currentWidth = selectedResolution?.config_width || media.width;
  const currentHeight = selectedResolution?.config_height || media.height;
  
  // 获取当前选择分辨率的标签
  const getCurrentLabel = () => {
    if (!selectedResolution) return '默认';
    
    const currentIndex = filteredResolutions.findIndex(res => res === selectedResolution);
    if (currentIndex === -1) return selectedResolution.label || '默认';
    
    return getResolutionLabel(currentIndex, isAuthenticated, selectedResolution, t);
  };
  
  const currentLabel = getCurrentLabel();
  

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
          onClick={() => {
            console.log('🖱️ 图片卡片被点击:', {
              is_video: media.is_video,
              downloadUrl,
              currentUrl,
              video_url: media.video_url,
              传递给onImageClick的URL: media.is_video ? downloadUrl : currentUrl
            });
            onImageClick(media.is_video ? downloadUrl : currentUrl, `Instagram 媒体 ${index + 1}`, media.is_video);
          }}
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
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={() => {
              console.log('🖱️ 视频覆盖层被点击:', {
                is_video: media.is_video,
                downloadUrl,
                video_url: media.video_url
              });
              onImageClick(downloadUrl, `Instagram 媒体 ${index + 1}`, media.is_video);
            }}
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg pointer-events-none">
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        
        {/* 分辨率选择器 */}
        {filteredResolutions.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('download.result.selectResolution')}:
            </label>
            <div className="flex flex-wrap gap-2">
              {filteredResolutions.map((resource: DisplayResource, resIndex: number) => {
                const isPremiumOption = resIndex === 0 && !isAuthenticated;
                return (
                  <button
                    key={resIndex}
                    onClick={() => handleResolutionClick(resource, resIndex)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      selectedResolution === resource
                        ? 'bg-purple-600 text-white border-purple-600'
                        : isPremiumOption
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 text-gray-700 border-yellow-300 hover:border-yellow-400 cursor-pointer'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    } ${isPremiumOption ? 'relative' : ''}`}
                  >
                    {getResolutionLabel(resIndex, isAuthenticated, resource, t)}
                    {isPremiumOption && (
                      <span className="ml-1 text-xs text-yellow-600">VIP</span>
                    )}
                  </button>
                );
              })}
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
            onClick={() => {
              console.log('🖱️ 预览按钮被点击:', {
                is_video: media.is_video,
                downloadUrl,
                currentUrl,
                video_url: media.video_url,
                传递给onImageClick的URL: media.is_video ? downloadUrl : currentUrl
              });
              onImageClick(media.is_video ? downloadUrl : currentUrl, `Instagram 媒体 ${index + 1}`, media.is_video);
            }}
          >
            <ZoomIn className="w-4 h-4 mr-1" />
            {t('download.result.preview')}
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white relative overflow-hidden"
            disabled={isDownloading}
            onClick={() => onDirectDownload(
              downloadUrl, 
              `instagram-${media.id || index}-${media.is_video ? 'video' : `${currentWidth}x${currentHeight}`}.${media.is_video ? 'mp4' : 'jpg'}`
            )}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                下载中
                <span className="absolute inset-0 bg-white/10 animate-pulse" />
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-1" />
                {t('common.download')}
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-gray-700 hover:text-gray-900"
            onClick={() => onCopyUrl()}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
