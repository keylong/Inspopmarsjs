'use client';


import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Download,
  Image,
  Play,
  Star,
  Users,
  Film,
  Bookmark,
  ArrowRight,
  Instagram
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';
import { AdSenseBanner, AdSenseResponsive } from '@/components/ads/adsense';

export default function DownloadPage() {
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();

  const downloadOptions = [
    {
      title: t('downloadCenter.options.post.title'),
      description: t('downloadCenter.options.post.description'),
      icon: Image,
      href: `/download/post`,
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-50 to-purple-50',
      features: (() => { const data = (t as any)('downloadCenter.options.post.features'); return typeof data === 'object' ? Object.values(data) as string[] : ['HD Quality', 'No Watermark', 'Batch Download']; })()
    },
    {
      title: t('downloadCenter.options.stories.title'),
      description: t('downloadCenter.options.stories.description'),
      icon: Star,
      href: `/download/stories`,
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      features: (() => { const data = (t as any)('downloadCenter.options.stories.features'); return typeof data === 'object' ? Object.values(data) as string[] : ['Anonymous Download', 'No View Records', '24-hour Content']; })()
    },
    {
      title: t('downloadCenter.options.reels.title'),
      description: t('downloadCenter.options.reels.description'),
      icon: Play,
      href: `/download/reels`,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      features: (() => { const data = (t as any)('downloadCenter.options.reels.features'); return typeof data === 'object' ? Object.values(data) as string[] : ['Short Videos', 'Original Quality', 'Fast Download']; })()
    },
    {
      title: t('downloadCenter.options.igtv.title'),
      description: t('downloadCenter.options.igtv.description'),
      icon: Film,
      href: `/download/igtv`,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      features: (() => { const data = (t as any)('downloadCenter.options.igtv.features'); return typeof data === 'object' ? Object.values(data) as string[] : ['Long Videos', 'HD Format', 'Stable Download']; })()
    },
    {
      title: t('downloadCenter.options.highlights.title'),
      description: t('downloadCenter.options.highlights.description'),
      icon: Bookmark,
      href: `/download/highlights`,
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50',
      features: (() => { const data = (t as any)('downloadCenter.options.highlights.features'); return typeof data === 'object' ? Object.values(data) as string[] : ['Curated Content', 'Permanent Storage', 'Batch Processing']; })()
    },
    {
      title: t('downloadCenter.options.profile.title'),
      description: t('downloadCenter.options.profile.description'),
      icon: Users,
      href: `/download/profile`,
      gradient: 'from-teal-500 to-cyan-500',
      bgGradient: 'from-teal-50 to-cyan-50',
      features: (() => { const data = (t as any)('downloadCenter.options.profile.features'); return typeof data === 'object' ? Object.values(data) as string[] : ['Avatar Download', 'Profile Pictures', 'Simple & Quick']; })()
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <div className="container mx-auto px-4 py-12">
        {/* 面包屑导航 */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-blue-600 hover:underline">{t('downloadCenter.breadcrumb.home')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{t('downloadCenter.breadcrumb.center')}</span>
        </nav>

        {/* 头部区域 */}
        <motion.header 
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <Instagram className="w-16 h-16 text-purple-600" />
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20 blur-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            {t('downloadCenter.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            {t('downloadCenter.subtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full">
              <Download className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-700">{t('downloadCenter.badges.freeUse')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold text-gray-700">{t('downloadCenter.badges.hdNoWatermark')}</span>
            </div>
          </div>
        </motion.header>

        {/* 顶部横幅广告 - 仅对非登录用户显示 */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AdSenseBanner className="max-w-4xl" />
        </motion.div>

        {/* 下载选项网格 */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {downloadOptions.map((option, index) => (
            <motion.div
              key={option.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className={`h-full bg-gradient-to-br ${option.bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden`}>
                <CardHeader className="relative pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${option.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    {option.title}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {option.features.map((feature, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <Link href={`/${currentLocale}${option.href}`}>
                    <Button 
                      className={`w-full bg-gradient-to-r ${option.gradient} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                      size="lg"
                    >
                      {t('downloadCenter.button.useNow')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* 使用说明 */}
        <motion.section 
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {t('downloadCenter.howToUse.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('downloadCenter.howToUse.steps.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('downloadCenter.howToUse.steps.step1.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('downloadCenter.howToUse.steps.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('downloadCenter.howToUse.steps.step2.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('downloadCenter.howToUse.steps.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('downloadCenter.howToUse.steps.step3.description')}
              </p>
            </div>
          </div>
        </motion.section>

        {/* 底部响应式广告 - 仅对非登录用户显示 */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <AdSenseResponsive className="max-w-4xl" />
        </motion.div>
      </div>
    </div>
  );
}