import { type WebApplication, type SoftwareApplication, type BreadcrumbList, type FAQPage } from 'schema-dts';
import { ContentType, contentTypeConfigs } from '@/lib/seo/config';

interface StructuredDataProps {
  contentType: ContentType;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export function StructuredData({ contentType, breadcrumbs }: StructuredDataProps) {
  const config = contentTypeConfigs[contentType];
  const baseUrl = 'https://ins.popmars.com';
  
  // Web应用程序结构化数据
  const webApplication: WebApplication = {
    '@type': 'WebApplication',
    '@id': `${baseUrl}#webapp`,
    name: 'Instagram下载软件',
    description: '专业的Instagram内容下载工具，支持图片、视频、Stories等多种内容类型下载',
    url: baseUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
      category: '免费'
    },
    featureList: [
      '高清图片下载',
      'Instagram视频下载',
      'Stories匿名下载',
      'Reels短视频下载',
      '头像高清获取',
      'Highlights批量下载',
      'IGTV长视频下载',
      '批量下载工具'
    ],
    screenshot: `${baseUrl}/screenshot.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2856',
      bestRating: '5',
      worstRating: '1'
    }
  };

  // 软件应用程序结构化数据
  const softwareApplication: SoftwareApplication = {
    '@type': 'SoftwareApplication',
    '@id': `${baseUrl}${config.canonicalPath}#software`,
    name: config.title,
    description: config.description,
    url: `${baseUrl}${config.canonicalPath}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    featureList: config.features,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY'
    },
    creator: {
      '@type': 'Organization',
      name: 'PopMars团队',
      url: baseUrl
    }
  };

  // 面包屑导航结构化数据
  const breadcrumbList: BreadcrumbList | null = breadcrumbs ? {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  } : null;

  // FAQ结构化数据
  const faqPage: FAQPage = {
    '@type': 'FAQPage',
    mainEntity: config.faqData.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  // 组织信息结构化数据
  const organization = {
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: 'PopMars团队',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://github.com/keylong/inspopmars',
      'https://twitter.com/inspopmars'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: '客户服务',
      email: 'support@popmars.com'
    }
  };

  // 网站结构化数据
  const website = {
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    name: 'Instagram下载软件',
    url: baseUrl,
    description: '专业的Instagram内容下载平台',
    publisher: {
      '@id': `${baseUrl}#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // 合并所有结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      organization,
      webApplication,
      softwareApplication,
      faqPage,
      ...(breadcrumbList ? [breadcrumbList] : [])
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// HowTo结构化数据组件
interface HowToStructuredDataProps {
  contentType: ContentType;
}

export function HowToStructuredData({ contentType }: HowToStructuredDataProps) {
  const config = contentTypeConfigs[contentType];
  const baseUrl = 'https://ins.popmars.com';

  const howToData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `如何使用${config.title}`,
    description: config.description,
    image: `${baseUrl}/how-to-${contentType}.png`,
    totalTime: 'PT3M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'CNY',
      value: '0'
    },
    step: config.howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.step,
      text: step.description,
      image: `${baseUrl}/step-${index + 1}-${contentType}.png`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToData) }}
    />
  );
}