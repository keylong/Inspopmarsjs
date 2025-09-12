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

  // 组织信息结构化数据 - 增强国际化支持
  const organization = {
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: 'PopMars团队',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://github.com/keylong/inspopmars',
      'https://twitter.com/inspopmars',
      'https://facebook.com/inspopmars',
      'https://instagram.com/inspopmars'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: '客户服务',
        email: 'support@popmars.com',
        areaServed: ['US', 'CN', 'HK', 'TW', 'JP', 'MY', 'SG', 'KH', 'GB'],
        availableLanguage: ['zh-CN', 'zh-TW', 'en', 'ja']
      },
      {
        '@type': 'ContactPoint',
        contactType: '技术支持',
        email: 'api@popmars.com',
        areaServed: 'Worldwide',
        availableLanguage: ['en', 'zh-CN']
      }
    ]
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

// 跨境电商专用结构化数据
export function EcommerceStructuredData() {
  const baseUrl = 'https://ins.popmars.com';
  
  const ecommerceData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}#ecommerce-tool`,
    name: 'Instagram批量下载工具 - 跨境电商专业版',
    description: '专为跨境电商卖家设计的Instagram内容批量下载和管理工具，支持竞品分析、批量处理、API集成',
    brand: {
      '@type': 'Brand',
      name: 'PopMars'
    },
    category: 'Business Software',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '299',
      offerCount: '4',
      offers: [
        {
          '@type': 'Offer',
          name: '免费版',
          price: '0',
          priceCurrency: 'USD',
          description: '每天10次下载，基础功能',
          availability: 'https://schema.org/InStock'
        },
        {
          '@type': 'Offer',
          name: '个人版',
          price: '19',
          priceCurrency: 'USD',
          description: '每天100次下载，批量下载',
          availability: 'https://schema.org/InStock'
        },
        {
          '@type': 'Offer',
          name: '商业版',
          price: '99',
          priceCurrency: 'USD',
          description: '无限下载，API访问，优先支持',
          availability: 'https://schema.org/InStock'
        },
        {
          '@type': 'Offer',
          name: '企业版',
          price: '299',
          priceCurrency: 'USD',
          description: '定制化服务，专属客服，SLA保障',
          availability: 'https://schema.org/InStock'
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '3500',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: '张先生 - 深圳跨境卖家'
        },
        datePublished: '2025-01-15',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        reviewBody: '作为跨境电商卖家，这个工具帮我节省了大量时间。批量下载竞品图片功能特别实用！'
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Jennifer - US Seller'
        },
        datePublished: '2025-01-20',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        reviewBody: 'Perfect tool for e-commerce sellers. The API integration works seamlessly with our system.'
      }
    ]
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ecommerceData) }}
    />
  );
}

// 地区专属结构化数据
export function LocalBusinessStructuredData({ region }: { region: string }) {
  const baseUrl = 'https://ins.popmars.com';
  
  const regionConfig = {
    'us': {
      name: 'Instagram Downloader - US Service',
      areaServed: 'US',
      priceRange: '$0-$99',
      telephone: '+1-xxx-xxx-xxxx',
      language: 'en-US'
    },
    'hk': {
      name: 'Instagram下載器 - 香港服務',
      areaServed: 'HK',
      priceRange: 'HK$0-HK$800',
      telephone: '+852-xxxx-xxxx',
      language: 'zh-HK'
    },
    'jp': {
      name: 'Instagramダウンローダー - 日本サービス',
      areaServed: 'JP',
      priceRange: '¥0-¥10000',
      telephone: '+81-xx-xxxx-xxxx',
      language: 'ja-JP'
    }
  };
  
  const config = regionConfig[region as keyof typeof regionConfig] || regionConfig['us'];
  
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/${region}#local`,
    name: config.name,
    image: `${baseUrl}/logo.png`,
    url: `${baseUrl}/${region}`,
    telephone: config.telephone,
    priceRange: config.priceRange,
    address: {
      '@type': 'PostalAddress',
      addressCountry: config.areaServed
    },
    areaServed: config.areaServed,
    availableLanguage: config.language,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
        'Friday', 'Saturday', 'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    }
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  );
}

// AIO优化的问答结构化数据
export function AIOptimizedFAQData() {
  const baseUrl = 'https://ins.popmars.com';
  
  const aioFaqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}#ai-faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Instagram下载器是什么？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Instagram下载器是一个免费的在线工具，可以帮助您下载Instagram上的图片、视频、Stories、Reels等内容。无需安装任何软件，只需复制链接即可下载。'
        }
      },
      {
        '@type': 'Question',
        name: '如何批量下载Instagram图片？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '1. 复制多个Instagram帖子链接 2. 使用我们的批量下载功能 3. 一次性粘贴所有链接 4. 点击批量下载按钮。VIP用户可以同时下载100+个链接。'
        }
      },
      {
        '@type': 'Question',
        name: '跨境电商卖家如何使用Instagram下载器？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '跨境电商卖家可以：1. 下载竞品产品图片进行分析 2. 批量保存网红推广内容 3. 收集用户生成内容(UGC) 4. 通过API集成到自己的系统中自动化处理。'
        }
      },
      {
        '@type': 'Question',
        name: '在美国使用Instagram下载器合法吗？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '是的，下载公开的Instagram内容供个人使用是合法的。但请注意：1. 尊重版权 2. 不要用于商业目的未经许可 3. 遵守Instagram服务条款 4. 保护用户隐私。'
        }
      },
      {
        '@type': 'Question',
        name: '支持哪些支付方式？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '我们支持多种国际支付方式：PayPal、Stripe（支持信用卡）、支付宝、微信支付。覆盖全球主要市场，方便海外华人和跨境电商用户。'
        }
      }
    ]
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(aioFaqData) }}
    />
  );
}