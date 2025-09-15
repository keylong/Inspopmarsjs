'use client';

import { motion } from 'framer-motion';
import { Shield, FileText, Mail, Clock, Globe, User, Lock, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n/client';
import { type Locale } from '@/lib/i18n/config';

interface PrivacyPolicyClientProps {
  locale: Locale;
}

// 定义隐私政策内容类型
// interface SectionContent {
//   title: string;
//   content: string;
//   items?: string[];
//   email?: string;
//   address?: string;
//   response?: string;
// }

// interface PrivacySections {
//   overview: SectionContent;
//   dataCollection: SectionContent;
//   dataUsage: SectionContent;
//   dataSecurity: SectionContent;
//   thirdPartyServices: SectionContent;
//   userRights: SectionContent;
//   dataRetention: SectionContent;
//   cookies: SectionContent;
//   contact: SectionContent;
// }

// 翻译函数类型（未使用但保留作为类型定义）
// type TranslationFunction = (key: string) => string | PrivacySections;

export default function PrivacyPolicyClient({ locale: _locale }: PrivacyPolicyClientProps) {
  const t = useI18n();

  // 最后更新日期
  const lastUpdated = '2025-09-09';

  // 备用翻译内容 - 中文
  const fallbackContent = {
    title: '隐私政策',
    subtitle: '了解我们如何收集、使用和保护您的个人信息',
    lastUpdated: '最后更新',
    sections: {
      overview: {
        title: '概述',
        content: '本隐私政策说明了InstagramDown（"我们"、"我们的"）如何收集、使用和保护您在使用我们的Instagram内容下载服务时的个人信息。我们致力于保护您的隐私权，并确保遵守相关数据保护法律法规，包括GDPR（通用数据保护条例）和CCPA（加州消费者隐私法案）。'
      },
      dataCollection: {
        title: '数据收集',
        content: '我们收集以下类型的信息：',
        items: [
          '您提供的Instagram链接和URL',
          '浏览器类型、版本和操作系统信息',
          'IP地址和地理位置（仅用于分析目的）',
          'Cookie和类似技术收集的使用数据',
          '设备标识符和网络信息',
          '使用统计和性能数据'
        ]
      },
      dataUsage: {
        title: '数据使用',
        content: '我们使用收集的信息用于：',
        items: [
          '提供和改进我们的Instagram内容下载服务',
          '处理和执行您的下载请求',
          '分析服务使用情况和优化用户体验',
          '防止欺诈行为和确保服务安全',
          '遵守法律义务和响应法律程序',
          '发送重要的服务通知和更新'
        ]
      },
      dataSecurity: {
        title: '数据安全',
        content: '我们采取以下措施保护您的数据：',
        items: [
          'SSL/TLS加密传输所有敏感数据',
          '访问控制和身份验证机制',
          '定期安全审计和漏洞评估',
          '数据最小化原则 - 只收集必要信息',
          '安全的数据存储和备份程序',
          '员工数据保护培训和访问限制'
        ]
      },
      thirdPartyServices: {
        title: '第三方服务',
        content: '我们使用以下第三方服务，它们可能会收集您的信息：',
        items: [
          'Google Analytics - 网站使用分析',
          'Cloudflare - CDN和安全服务',
          'Instagram API - 内容获取（符合Instagram服务条款）',
          'Stripe - 支付处理（如适用）',
          '云存储提供商 - 临时文件存储'
        ]
      },
      userRights: {
        title: '您的权利',
        content: '根据GDPR和其他数据保护法律，您拥有以下权利：',
        items: [
          '访问权：获取我们持有的您的个人数据副本',
          '更正权：要求更正不准确或不完整的个人数据',
          '删除权：在特定情况下要求删除您的个人数据',
          '限制处理权：限制我们处理您的个人数据',
          '数据可携权：以结构化、常用格式接收您的数据',
          '反对权：反对基于合法利益的数据处理'
        ]
      },
      dataRetention: {
        title: '数据保留',
        content: '我们的数据保留政策如下：',
        items: [
          '下载历史：保留30天后自动删除',
          'IP地址和日志：保留90天用于安全分析',
          '分析数据：匿名化处理后保留2年',
          'Cookie数据：根据cookie类型保留不同期限',
          '联系信息：直到您要求删除或账户关闭',
          '法律要求的数据：按照适用法律要求保留'
        ]
      },
      cookies: {
        title: 'Cookie 政策',
        content: '我们使用以下类型的Cookie：',
        items: [
          '必要Cookie：确保网站正常运行的基本功能',
          '分析Cookie：帮助我们了解网站使用情况',
          '功能Cookie：记住您的偏好和设置',
          '营销Cookie：用于个性化广告和内容推荐',
          '您可以通过浏览器设置管理Cookie偏好',
          '禁用某些Cookie可能影响网站功能'
        ]
      },
      contact: {
        title: '联系我们',
        content: '如果您对我们的隐私政策有任何疑问或需要行使您的权利，请联系我们：',
        email: 'privacy@inspopmars.com',
        address: '数据保护官\nInstagramDown\n[公司地址]',
        response: '我们将在30天内回复您的请求'
      }
    },
    tableOfContents: '目录'
  };

  // 使用翻译或备用内容
  const content = {
    title: t('privacy.title') || fallbackContent.title,
    subtitle: t('privacy.subtitle') || fallbackContent.subtitle,
    lastUpdated: t('privacy.lastUpdated') || fallbackContent.lastUpdated,
    sections: (t as (key: string) => any)('privacy.sections') || fallbackContent.sections,
    tableOfContents: t('privacy.tableOfContents') || fallbackContent.tableOfContents
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const iconMap = {
    overview: Shield,
    dataCollection: Download,
    dataUsage: Eye,
    dataSecurity: Lock,
    thirdPartyServices: Globe,
    userRights: User,
    dataRetention: Clock,
    cookies: FileText,
    contact: Mail
  };

  const sections = [
    'overview',
    'dataCollection', 
    'dataUsage',
    'dataSecurity',
    'thirdPartyServices',
    'userRights',
    'dataRetention',
    'cookies',
    'contact'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            {content.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
          
          <Badge variant="secondary" className="text-sm">
            {content.lastUpdated}: {lastUpdated}
          </Badge>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {content.tableOfContents}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2" role="navigation" aria-label="页面导航">
                  {sections.map((sectionKey) => {
                    const sectionContent = content.sections[sectionKey as keyof typeof content.sections];
                    const title = typeof sectionContent === 'object' && 'title' in sectionContent 
                      ? sectionContent.title 
                      : sectionKey;
                    
                    return (
                      <a
                        key={sectionKey}
                        href={`#${sectionKey}`}
                        className="block text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`跳转到${title}部分`}
                      >
                        {sections.indexOf(sectionKey) + 1}. {title}
                      </a>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {sections.map((sectionKey) => {
                const sectionContent = content.sections[sectionKey as keyof typeof content.sections];
                const Icon = iconMap[sectionKey as keyof typeof iconMap];
                
                if (typeof sectionContent !== 'object' || !('title' in sectionContent)) {
                  return null;
                }

                return (
                  <motion.div
                    key={sectionKey}
                    id={sectionKey}
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="scroll-mt-8"
                  >
                    <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" aria-hidden="true">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {sectionContent.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {sectionContent.content}
                        </p>
                        
                        {sectionContent.items && Array.isArray(sectionContent.items) && (
                          <ul className="space-y-2" role="list">
                            {sectionContent.items.map((item: string, itemIndex: number) => (
                              <li key={itemIndex} className="flex items-start gap-2" role="listitem">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {sectionKey === 'contact' && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">邮箱：</span>
                                <a 
                                  href={`mailto:${sectionContent.email}`}
                                  className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                  aria-label={`发送邮件到${sectionContent.email}`}
                                >
                                  {sectionContent.email}
                                </a>
                              </div>
                              <div className="text-sm text-gray-600 whitespace-pre-line">
                                {sectionContent.address}
                              </div>
                              <div className="text-sm text-gray-600">
                                {sectionContent.response}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div 
          className="text-center mt-16 p-8 bg-white/50 backdrop-blur-sm rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">有疑问？</h3>
          <p className="text-gray-600 mb-6">
            如果您对我们的隐私政策有任何疑问，请随时联系我们的数据保护团队。
          </p>
          <a
            href="mailto:privacy@inspopmars.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="联系数据保护团队"
          >
            <Mail className="w-5 h-5" />
            联系我们
          </a>
        </motion.div>
      </div>
    </div>
  );
}