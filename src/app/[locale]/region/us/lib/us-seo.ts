import { Metadata } from 'next';

export function generateUSSEOMetadata(): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inspopmars.com';
  const canonicalUrl = `${baseUrl}/en/region/us`;
  
  return {
    title: 'Instagram Downloader for US E-commerce | No VPN Required | Inspopmars',
    description: 'The #1 Instagram photo & video downloader trusted by 100K+ US businesses. Download HD content without watermarks. Perfect for Amazon FBA sellers, Shopify stores, and social media managers. No VPN needed in USA.',
    keywords: 'instagram downloader usa, instagram video downloader, instagram photo downloader, amazon fba tools, shopify instagram tools, social media downloader, bulk instagram download, no watermark downloader, instagram reels downloader, instagram stories downloader',
    
    alternates: {
      canonical: canonicalUrl,
    },
    
    openGraph: {
      title: 'Instagram Downloader for US E-commerce Sellers | Inspopmars',
      description: 'Download Instagram photos, videos, Reels & Stories in HD. Trusted by 100,000+ US businesses. No VPN required, 24/7 US support.',
      url: canonicalUrl,
      siteName: 'Inspopmars - Instagram Downloader USA',
      images: [
        {
          url: `${baseUrl}/og-image-us.png`,
          width: 1200,
          height: 630,
          alt: 'Instagram Downloader for US E-commerce',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: 'Instagram Downloader for US E-commerce | No VPN Required',
      description: 'Download Instagram content in HD. Trusted by 100K+ US businesses. Perfect for e-commerce sellers.',
      images: [`${baseUrl}/og-image-us.png`],
      creator: '@inspopmars',
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    other: {
      'geo.region': 'US',
      'geo.position': '37.7749;-122.4194', // San Francisco coordinates
      'ICBM': '37.7749, -122.4194',
      'target': 'all',
      'audience': 'all',
      'coverage': 'Worldwide',
      'distribution': 'Global',
      'rating': 'General',
      'revisit-after': '7 days',
    },
  };
}

// 美国市场特定的结构化数据
export function generateUSStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inspopmars.com';
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${baseUrl}/#webapp`,
        name: 'Inspopmars Instagram Downloader',
        url: baseUrl,
        description: 'Professional Instagram content downloader for US businesses',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '10432',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Inspopmars USA',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          'https://twitter.com/inspopmars',
          'https://www.facebook.com/inspopmars',
          'https://www.linkedin.com/company/inspopmars',
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'US',
          addressRegion: 'CA',
          addressLocality: 'San Francisco',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is this Instagram downloader free to use in the USA?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, our basic Instagram downloader is completely free. We offer premium plans starting at $19/month for advanced features like bulk downloads and API access.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need a VPN to use this Instagram downloader in the US?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No, you don\'t need a VPN. Our service works perfectly in all US states without any restrictions.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is it legal to download Instagram content for business use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You should always respect copyright and obtain permission when necessary. Our tool is designed for downloading public content for legitimate business purposes such as social media management and e-commerce.',
            },
          },
          {
            '@type': 'Question',
            name: 'What payment methods do you accept?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We accept all major US payment methods including Visa, Mastercard, American Express, PayPal, and Stripe. All payments are processed securely with SSL encryption.',
            },
          },
        ],
      },
      {
        '@type': 'Product',
        name: 'Inspopmars Professional Plan',
        description: 'Professional Instagram downloader plan for US businesses',
        brand: {
          '@type': 'Brand',
          name: 'Inspopmars',
        },
        offers: {
          '@type': 'Offer',
          url: `${baseUrl}/en/subscription`,
          priceCurrency: 'USD',
          price: '19',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Inspopmars USA',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '5234',
        },
      },
    ],
  };
}

// 美国市场关键词映射
export const usKeywordMapping = {
  primary: [
    'instagram downloader',
    'instagram video downloader',
    'instagram photo downloader',
    'download instagram videos',
    'download instagram photos',
  ],
  secondary: [
    'instagram downloader no watermark',
    'bulk instagram downloader',
    'instagram reels downloader',
    'instagram stories downloader',
    'instagram carousel downloader',
  ],
  business: [
    'instagram tools for amazon sellers',
    'instagram downloader for shopify',
    'social media tools for ecommerce',
    'instagram content for dropshipping',
    'instagram ugc downloader',
  ],
  local: [
    'instagram downloader usa',
    'instagram downloader america',
    'instagram downloader no vpn',
    'us instagram downloader',
    'american instagram tools',
  ],
};

// 美国市场特定的页面配置
export const usPageConfig = {
  hero: {
    headline: 'The #1 Instagram Downloader for US E-commerce Sellers',
    subheadline: 'Download high-quality Instagram content instantly. No watermarks, no VPN required.',
    cta: {
      primary: 'Start Free Download',
      secondary: 'View Premium Plans',
    },
  },
  features: {
    noVPN: {
      title: 'No VPN Required',
      description: 'Works perfectly in all 50 US states without any restrictions',
    },
    fast: {
      title: 'Lightning Fast',
      description: 'Download from US-based servers for maximum speed',
    },
    support: {
      title: '24/7 US Support',
      description: 'Get help from our US-based support team anytime',
    },
    secure: {
      title: 'DMCA Compliant',
      description: 'Fully compliant with US copyright laws and regulations',
    },
  },
  trust: {
    users: '100,000+ US Businesses',
    rating: '4.9/5 Average Rating',
    downloads: '10M+ Downloads',
    support: '24/7 US Support',
  },
};