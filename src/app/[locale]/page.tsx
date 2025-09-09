'use client';

import Link from 'next/link';
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
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';

export default function Home() {
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();

  console.log('当前语言:', currentLocale);
  console.log('翻译对象:', t);

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
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      
      <div className="container mx-auto px-4 py-16 relative">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {content.title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {content.subtitle}
          </motion.p>
          
          {/* 统计数据 */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">1M+ {t('download.result.trustedUsers')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full">
              <Download className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-700">10M+ {t('download.result.totalDownloads')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold text-gray-700">4.8/5 {t('download.result.rating')}</span>
            </div>
          </motion.div>
          
          {/* CTA 按钮 */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${currentLocale}/download`}>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  {content.downloadButton}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${currentLocale}/about`}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 border-2 hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  {content.aboutButton}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 功能特色 */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {content.features.fastSpeed}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  {content.features.fastSpeedDesc}
                </p>
                <Badge variant="secondary" className="mt-3">
                  {t('download.result.extremeSpeed')}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {content.features.noWatermark}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  {content.features.noWatermarkDesc}
                </p>
                <Badge variant="secondary" className="mt-3">
                  {t('download.result.pureNoWatermark')}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {content.features.allFormats}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  {content.features.allFormatsDesc}
                </p>
                <Badge variant="secondary" className="mt-3">
                  {t('download.result.fullFormatSupport')}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* 支持的内容类型 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{t('download.result.supportedContent')}</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <motion.div 
              className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Image className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">{t('download.result.photoPosts')}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Play className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-700">{t('download.result.videoContent2')}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Star className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-700">{t('download.result.stories')}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Download className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">{t('download.result.reels')}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}