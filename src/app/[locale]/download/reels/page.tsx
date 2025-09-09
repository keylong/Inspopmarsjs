'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Download,
  Film,
  ArrowLeft,
  Instagram,
  Play,
  Zap,
  FileVideo,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';

export default function InstagramReelsDownloadPage() {
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      return;
    }

    setLoading(true);
    // 这里添加实际的下载逻辑
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="text-sm mb-8">
          <Link href={`/${currentLocale}`} className="text-blue-600 hover:underline">{t('nav.home')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/${currentLocale}/download`} className="text-blue-600 hover:underline">{t('downloadCenter.title')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{t('downloadPages.reels.title')}</span>
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
              <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                <Play className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-red-900 to-orange-900 bg-clip-text text-transparent">
              {t('downloadPages.reels.heading')}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {t('downloadPages.reels.subheading')}
            </p>

            {/* 特性标签 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.values(t('downloadPages.reels.features') as Record<string, string>).map((feature: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* 下载表单 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Film className="w-5 h-5" />
                {t('download.form.urlLabel')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="url"
                    placeholder={t('downloadPages.reels.inputPlaceholder')}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
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
                
                <div className="text-center text-sm text-gray-500">
                  <p>{t('downloadPages.reels.description')}</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* 使用步骤 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('downloadPages.reels.howToUse')}
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('download.step1')}
              </h3>
              <p className="text-gray-600">
                在 Instagram 中找到 Reels 视频，复制链接
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('download.step2')}
              </h3>
              <p className="text-gray-600">
                将链接粘贴到上方的输入框中
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('download.step3')}
              </h3>
              <p className="text-gray-600">
                点击下载按钮开始处理
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('download.step4')}
              </h3>
              <p className="text-gray-600">
                等待处理完成并保存到设备
              </p>
            </div>
          </div>
        </section>

        {/* 功能特色 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('download.features.title')} - Reels
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-red-500 mb-3"><Play /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('downloadPages.reels.features.0' as any)}</h3>
              <p className="text-gray-600 text-sm">
                专为 Instagram Reels 优化的下载器，支持各种分辨率。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-red-500 mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('downloadPages.reels.features.1' as any)}</h3>
              <p className="text-gray-600 text-sm">
                保持视频原始质量，不压缩，不降低画质。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-red-500 mb-3"><Zap /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('downloadPages.reels.features.2' as any)}</h3>
              <p className="text-gray-600 text-sm">
                优化的下载算法，确保快速获取视频内容。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-red-500 mb-3"><FileVideo /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('downloadPages.reels.features.3' as any)}</h3>
              <p className="text-gray-600 text-sm">
                下载为标准 MP4 格式，兼容所有设备和播放器。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-red-500 mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('download.features.noWatermark')}</h3>
              <p className="text-gray-600 text-sm">
                {t('download.features.noWatermarkDesc')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-red-500 mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">隐私保护</h3>
              <p className="text-gray-600 text-sm">
                不保存用户数据，不追踪用户行为，完全匿名。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}