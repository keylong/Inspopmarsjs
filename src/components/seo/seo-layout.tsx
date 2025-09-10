'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Download, 
  Shield, 
  Zap, 
  Users, 
  Star,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Breadcrumb, generateBreadcrumbs } from '@/components/ui/breadcrumb';
import { StructuredData, HowToStructuredData } from '@/components/seo/structured-data';
import { DownloadForm } from '@/components/download/download-form';
import { 
  ContentType, 
  generateSEOConfig, 
  contentTypeConfigs, 
  SEOContentConfig 
} from '@/lib/seo/config';

interface SEOLayoutProps {
  contentType: ContentType;
  children?: React.ReactNode;
  locale?: string;
}

export function SEOLayout({ contentType, children, locale = 'zh' }: SEOLayoutProps) {
  const seoConfig = generateSEOConfig(contentType, locale);
  const config = contentTypeConfigs[contentType];
  const breadcrumbs = generateBreadcrumbs(contentType, locale);

  return (
    <>
      {/* SEO metadata should be handled by generateMetadata in page.tsx */}
      <StructuredData 
        contentType={contentType} 
        breadcrumbs={breadcrumbs.map(b => ({ name: b.label, url: b.href || '' }))} 
      />
      <HowToStructuredData contentType={contentType} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* 面包屑导航 */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* 头部区域 */}
        <header className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {config.h1}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {config.description}
            </p>
            
            {/* 特性标签 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {config.features.slice(0, 4).map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>
        </header>

        {/* 主要内容区域 */}
        <main className="container mx-auto px-4 pb-16">
          {/* 下载表单区域 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-16"
          >
            {children}
          </motion.section>

          {/* 使用步骤 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              如何使用{config.title.split(' - ')[0]}？
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {config.howToSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.step}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 功能特色 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              为什么选择我们的{contentType === 'batch' ? '批量' : 'Instagram'}下载器？
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {config.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature}</h3>
                  <p className="text-gray-600 text-sm">
                    享受{feature}带来的便利体验，让内容下载变得更加简单高效。
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 统计数据 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                用户信赖的下载平台
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">2.8M+</div>
                  <div className="text-gray-600">总下载次数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">150K+</div>
                  <div className="text-gray-600">活跃用户</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                  <div className="text-gray-600">用户评分</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-gray-600">成功率</div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 常见问题 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              常见问题解答
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {config.faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 相关工具推荐 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              更多Instagram下载工具
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {Object.entries(contentTypeConfigs)
                .filter(([key]) => key !== contentType)
                .slice(0, 4)
                .map(([key, config]) => (
                  <div key={key} className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {config.title.split(' - ')[0]}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {config.description.substring(0, 80)}...
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      asChild
                    >
                      <a href={config.canonicalPath}>
                        试用工具 <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                ))}
            </div>
          </motion.section>
        </main>
      </div>
    </>
  );
}