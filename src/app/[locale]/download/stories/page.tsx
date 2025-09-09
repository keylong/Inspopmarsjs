'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Download,
  User,
  Link as LinkIcon,
  ArrowLeft,
  Instagram,
  Eye,
  EyeOff,
  Clock,
  Users,
  Globe,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';

export default function InstagramStoriesDownloadPage() {
  const currentLocale = useCurrentLocale() || 'zh-CN';
  const t = useI18n();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      return;
    }

    setLoading(true);
    // 这里添加实际的下载逻辑
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="text-sm mb-8">
          <Link href={`/${currentLocale}`} className="text-blue-600 hover:underline">{t('nav.home')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/${currentLocale}/download`} className="text-blue-600 hover:underline">{t('downloadCenter.title')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{t('downloadPages.stories.title')}</span>
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
              <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-pink-900 to-purple-900 bg-clip-text text-transparent">
              {t('downloadPages.stories.heading')}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {t('downloadPages.stories.subheading')}
            </p>

            {/* 特性标签 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.values(t('downloadPages.stories.features') as Record<string, string>).map((feature: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* 下载表单 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-5 h-5" />
                {t('downloadPages.stories.inputPlaceholder')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder={t('downloadPages.stories.inputPlaceholder')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !username.trim()}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
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
                  <p>{t('downloadPages.stories.description')}</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* 使用步骤 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('downloadPages.stories.howToUse')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t('downloadPages.stories.steps') && Object.entries(t('downloadPages.stories.steps')).map(([key, step], index) => (
              <div key={key} className="text-center">
                <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </h3>
                <p className="text-gray-600">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 功能特色 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('download.features.title')} - Stories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3"><EyeOff /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{(t('downloadPages.stories.features') as Record<string, string>)['0']}</h3>
              <p className="text-gray-600 text-sm">
                无需登录 Instagram 账号即可下载 Stories，保护您的隐私。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3"><Eye className="opacity-50" /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{(t('downloadPages.stories.features') as Record<string, string>)['1']}</h3>
              <p className="text-gray-600 text-sm">
                下载 Stories 不会留下任何浏览痕迹，对方无法知道您查看过。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3"><Clock /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{(t('downloadPages.stories.features') as Record<string, string>)['2']}</h3>
              <p className="text-gray-600 text-sm">
                自动获取最新的 Stories 内容，确保不错过任何更新。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('download.features.highQuality')}</h3>
              <p className="text-gray-600 text-sm">
                {t('download.features.highQualityDesc')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3"><Users /></div>
              <h3 className="font-semibold text-gray-900 mb-2">批量保存</h3>
              <p className="text-gray-600 text-sm">
                支持一次性下载用户所有的 Stories 内容，节省时间。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3"><Globe /></div>
              <h3 className="font-semibold text-gray-900 mb-2">全球可用</h3>
              <p className="text-gray-600 text-sm">
                支持全球所有地区的 Instagram Stories 下载。
              </p>
            </div>
          </div>
        </section>

        {/* 常见问题 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            常见问题解答
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">
                下载 Stories 会被发现吗？
              </h3>
              <p className="text-gray-600">
                不会。我们的工具采用匿名下载技术，不会在对方的 Stories 查看记录中留下任何痕迹。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">
                可以下载私人账号的 Stories 吗？
              </h3>
              <p className="text-gray-600">
                只能下载公开账号的 Stories。私人账号需要关注后才能查看其 Stories 内容。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">
                Stories 过期了还能下载吗？
              </h3>
              <p className="text-gray-600">
                不能。Stories 在 Instagram 上过期后（24小时后），我们的工具也无法获取和下载这些内容。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}