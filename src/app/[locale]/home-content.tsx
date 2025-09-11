'use client';

import dynamic from 'next/dynamic';
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Zap, 
  Shield, 
  Smartphone,
  Instagram,
  Play,
  Image,
  Star,
  Users,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n/client';
// 延迟加载下载表单组件
const DownloadForm = dynamic(() => import('@/components/download-form').then(mod => mod.DownloadForm), {
  ssr: true,
  loading: () => <div className="h-96 bg-white/80 rounded-2xl animate-pulse" />
});
import Link from 'next/link';

// 动态导入广告组件，减少初始加载
const AdSenseBanner = dynamic(
  () => import('@/components/ads/adsense').then(mod => mod.AdSenseBanner),
  { ssr: false, loading: () => null }
);

const AdSenseResponsive = dynamic(
  () => import('@/components/ads/adsense').then(mod => mod.AdSenseResponsive),
  { ssr: false, loading: () => null }
);

export function HomeContent() {
  const t = useI18n();

  // 使用翻译内容
  const content = {
    title: t('download.title'),
    subtitle: t('download.subtitle'), 
    downloadButton: t('download.downloadButton'),
    aboutButton: t('nav.about'),
    features: {
      fastSpeed: t('download.features.fastSpeed'),
      fastSpeedDesc: t('download.features.fastSpeedDesc'),
      noWatermark: t('download.features.noWatermark'),
      noWatermarkDesc: t('download.features.noWatermarkDesc'),
      allFormats: t('download.features.allFormats'),
      allFormatsDesc: t('download.features.allFormatsDesc'),
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* 背景装饰元素 - 在移动端简化 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none desktop-only">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
          animate={{ y: [-20, 20, -20], rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"
          animate={{ y: [20, -20, 20], x: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: [-180, 180, -180] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="container mx-auto mobile-padding py-8 sm:py-12 lg:py-16 relative">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Instagram Logo Animation */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <Instagram className="w-16 h-16 text-purple-600" />
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20 blur-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {content.title}
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto px-6 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {content.subtitle}
          </motion.p>

          {/* Download Section with Form */}
          <motion.div 
            id="download-section"
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <DownloadForm />
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 items-center px-6 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Users className="w-4 h-4 mr-1" />
              100K+ 用户
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-1" />
              4.9 评分
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-1" />
              安全可靠
            </Badge>
          </motion.div>
        </motion.div>

        {/* 顶部广告位 */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <AdSenseBanner />
        </motion.div>


        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 lg:mb-20 px-4 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{content.features.fastSpeed}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{content.features.fastSpeedDesc}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{content.features.noWatermark}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{content.features.noWatermarkDesc}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{content.features.allFormats}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{content.features.allFormatsDesc}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 中间广告位 */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <AdSenseResponsive />
        </motion.div>

        {/* Content Types Section */}
        <motion.div 
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
            支持下载所有 Instagram 内容
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
            {[
              { icon: Image, title: '图片', desc: '高清原图' },
              { icon: Play, title: '视频', desc: '最高画质' },
              { icon: Instagram, title: 'Reels', desc: '短视频' },
              { icon: Image, title: 'Stories', desc: '限时动态' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
              >
                <item.icon className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 底部广告位 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <AdSenseBanner />
        </motion.div>
      </div>
    </div>
  );
}