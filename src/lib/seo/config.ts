import type { NextSeoProps } from 'next-seo';

// 基础SEO配置 - 优化CTR
export const baseSEOConfig: NextSeoProps = {
  defaultTitle: 'Instagram图片/视频下载软件 - 免费批量下载工具',
  titleTemplate: '%s | Instagram图片/视频下载软件',
  description: '专业的Instagram图片/视频下载软件，支持批量下载100+链接。✅无水印✅高清原图✅匿名下载。跨境电商卖家必备，已服务10万+用户。',
  canonical: 'https://ins.popmars.com',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://ins.popmars.com',
    site_name: 'Instagram图片/视频下载软件',
    title: 'Instagram图片/视频下载软件 - 免费批量下载工具',
    description: '专业的Instagram图片/视频下载软件，支持批量下载图片、视频、Stories、Reels、IGTV等内容。无需登录，快速安全，保持原画质量。',
    images: [
      {
        url: 'https://ins.popmars.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Instagram下载软件',
      },
    ],
  },
  twitter: {
    handle: '@inspopmars',
    site: '@inspopmars',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#7c3aed',
    },
    {
      name: 'author',
      content: 'PopMars团队',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
  ],
};

// 内容类型SEO配置
export type ContentType = 'post' | 'stories' | 'reels' | 'profile' | 'highlights' | 'igtv' | 'private' | 'batch';

export interface SEOContentConfig {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  ogTitle: string;
  ogDescription: string;
  canonicalPath: string;
  faqData: Array<{
    question: string;
    answer: string;
  }>;
  features: string[];
  howToSteps: Array<{
    step: string;
    description: string;
  }>;
}

export const contentTypeConfigs: Record<ContentType, SEOContentConfig> = {
  post: {
    title: 'Instagram图片下载器 - 免费下载Instagram帖子图片',
    description: '专业的Instagram图片下载工具，支持批量下载Instagram帖子中的高清图片。无需登录，保持原画质量，支持单张和多张图片下载。',
    keywords: ['Instagram图片下载', 'Instagram帖子下载', 'Instagram照片保存', 'Ins图片下载器', '高清图片下载'],
    h1: 'Instagram图片下载器 - 快速保存高清图片',
    ogTitle: 'Instagram图片下载器 - 免费下载Instagram帖子图片',
    ogDescription: '专业的Instagram图片下载工具，支持批量下载Instagram帖子中的高清图片。无需登录，保持原画质量。',
    canonicalPath: '/download/post',
    faqData: [
      {
        question: '如何下载Instagram帖子中的图片？',
        answer: '复制Instagram帖子链接，粘贴到我们的下载框中，点击下载按钮即可获取高清图片。'
      },
      {
        question: '下载的图片质量如何？',
        answer: '我们提供原画质量的图片下载，确保您获得最高清晰度的Instagram图片。'
      },
      {
        question: '是否支持批量下载多张图片？',
        answer: '是的，如果Instagram帖子包含多张图片，我们会自动检测并提供批量下载选项。'
      }
    ],
    features: [
      '高清画质保持',
      '批量图片下载',
      '无需登录Instagram',
      '快速下载速度',
      '支持所有图片格式',
      '移动端友好界面'
    ],
    howToSteps: [
      { step: '复制链接', description: '复制Instagram帖子的分享链接' },
      { step: '粘贴链接', description: '将链接粘贴到下载框中' },
      { step: '开始下载', description: '点击下载按钮获取高清图片' }
    ]
  },
  stories: {
    title: 'Instagram Stories下载器 - 匿名下载Instagram故事',
    description: '专业的Instagram Stories下载工具，支持匿名下载Instagram故事图片和视频。保护隐私，无需登录，快速保存限时内容。',
    keywords: ['Instagram Stories下载', 'Instagram故事下载', 'Stories保存', 'Ins故事下载器', '匿名下载Stories'],
    h1: 'Instagram Stories下载器 - 匿名保存故事内容',
    ogTitle: 'Instagram Stories下载器 - 匿名下载Instagram故事',
    ogDescription: '专业的Instagram Stories下载工具，支持匿名下载Instagram故事图片和视频。保护隐私，无需登录。',
    canonicalPath: '/download/stories',
    faqData: [
      {
        question: '如何匿名下载Instagram Stories？',
        answer: '输入用户名或复制Stories链接，我们的工具会匿名获取Stories内容供您下载，不会留下浏览记录。'
      },
      {
        question: 'Stories下载是否有时间限制？',
        answer: 'Instagram Stories通常24小时后消失，建议及时下载。我们的工具可以下载当前可见的所有Stories。'
      },
      {
        question: '下载Stories是否会被发现？',
        answer: '完全匿名下载，Instagram用户不会收到任何通知，保护您的隐私。'
      }
    ],
    features: [
      '完全匿名下载',
      '支持图片和视频',
      '批量Stories下载',
      '无浏览记录',
      '快速获取内容',
      '隐私保护'
    ],
    howToSteps: [
      { step: '输入用户名', description: '输入Instagram用户名或Stories链接' },
      { step: '选择Stories', description: '选择要下载的Stories内容' },
      { step: '匿名下载', description: '点击下载，完全匿名保存到设备' }
    ]
  },
  reels: {
    title: 'Instagram Reels下载器 - 免费下载Instagram短视频',
    description: '专业的Instagram Reels下载工具，支持下载高清Instagram短视频。无水印下载，保持原始画质，支持MP4格式导出。',
    keywords: ['Instagram Reels下载', 'Instagram短视频下载', 'Reels视频保存', 'Ins Reels下载器', '无水印视频下载'],
    h1: 'Instagram Reels下载器 - 高清短视频下载',
    ogTitle: 'Instagram Reels下载器 - 免费下载Instagram短视频',
    ogDescription: '专业的Instagram Reels下载工具，支持下载高清Instagram短视频。无水印下载，保持原始画质。',
    canonicalPath: '/download/reels',
    faqData: [
      {
        question: '如何下载Instagram Reels视频？',
        answer: '复制Reels分享链接，粘贴到下载框中，选择视频质量后即可下载高清MP4视频文件。'
      },
      {
        question: '下载的Reels视频有水印吗？',
        answer: '我们提供无水印的原始视频下载，确保您获得干净的视频内容。'
      },
      {
        question: '支持哪些视频质量选项？',
        answer: '支持多种清晰度选择，包括高清1080p、标清720p等，满足不同需求。'
      }
    ],
    features: [
      '高清视频下载',
      '无水印输出',
      '多种清晰度选择',
      'MP4格式导出',
      '快速下载速度',
      '移动端支持'
    ],
    howToSteps: [
      { step: '复制Reels链接', description: '复制Instagram Reels的分享链接' },
      { step: '选择质量', description: '选择想要的视频画质' },
      { step: '下载视频', description: '点击下载获取高清MP4视频' }
    ]
  },
  profile: {
    title: 'Instagram头像下载器 - 高清头像图片下载',
    description: '专业的Instagram头像下载工具，支持下载高清Instagram用户头像。无需登录，快速获取原始尺寸头像图片。',
    keywords: ['Instagram头像下载', 'Instagram头像保存', 'Ins头像下载器', '高清头像下载', '用户头像获取'],
    h1: 'Instagram头像下载器 - 高清头像获取',
    ogTitle: 'Instagram头像下载器 - 高清头像图片下载',
    ogDescription: '专业的Instagram头像下载工具，支持下载高清Instagram用户头像。无需登录，快速获取原始尺寸头像。',
    canonicalPath: '/download/profile',
    faqData: [
      {
        question: '如何下载Instagram用户头像？',
        answer: '输入Instagram用户名，我们会自动获取该用户的高清头像供您下载。'
      },
      {
        question: '下载的头像是最高清晰度吗？',
        answer: '是的，我们获取Instagram存储的原始尺寸头像，确保最高清晰度。'
      },
      {
        question: '是否可以批量下载多个用户头像？',
        answer: '目前支持单个用户头像下载，计划未来版本加入批量下载功能。'
      }
    ],
    features: [
      '高清头像下载',
      '原始尺寸获取',
      '无需登录账号',
      '快速头像检索',
      '支持所有用户',
      '简单易用界面'
    ],
    howToSteps: [
      { step: '输入用户名', description: '输入Instagram用户名' },
      { step: '获取头像', description: '系统自动检索用户头像' },
      { step: '下载保存', description: '点击下载保存高清头像' }
    ]
  },
  highlights: {
    title: 'Instagram Highlights下载器 - 精选故事下载',
    description: '专业的Instagram Highlights下载工具，支持下载Instagram精选故事集合。保存永久Stories内容，支持批量下载。',
    keywords: ['Instagram Highlights下载', 'Instagram精选下载', 'Highlights保存', 'Ins精选故事下载', '故事集合下载'],
    h1: 'Instagram Highlights下载器 - 精选故事保存',
    ogTitle: 'Instagram Highlights下载器 - 精选故事下载',
    ogDescription: '专业的Instagram Highlights下载工具，支持下载Instagram精选故事集合。保存永久Stories内容。',
    canonicalPath: '/download/highlights',
    faqData: [
      {
        question: '什么是Instagram Highlights？',
        answer: 'Highlights是Instagram用户保存的精选Stories集合，显示在个人资料页面，不会像普通Stories那样消失。'
      },
      {
        question: '如何下载Instagram Highlights？',
        answer: '输入用户名，选择要下载的Highlights集合，我们会批量下载其中的所有内容。'
      },
      {
        question: '是否支持下载私密账户的Highlights？',
        answer: '仅支持公开账户的Highlights下载，私密账户需要先关注才能访问。'
      }
    ],
    features: [
      '批量Highlights下载',
      '永久内容保存',
      '支持图片和视频',
      '分类内容管理',
      '高清质量保持',
      '快速批量处理'
    ],
    howToSteps: [
      { step: '输入用户名', description: '输入Instagram用户名' },
      { step: '选择Highlights', description: '选择要下载的精选故事集合' },
      { step: '批量下载', description: '一键下载所有Highlights内容' }
    ]
  },
  igtv: {
    title: 'IGTV视频下载器 - Instagram长视频下载',
    description: '专业的IGTV下载工具，支持下载Instagram长视频内容。高清画质，支持大文件下载，保持原始视频格式。',
    keywords: ['IGTV下载', 'Instagram长视频下载', 'IGTV视频保存', 'Instagram TV下载器', '长视频下载工具'],
    h1: 'IGTV下载器 - Instagram长视频保存',
    ogTitle: 'IGTV视频下载器 - Instagram长视频下载',
    ogDescription: '专业的IGTV下载工具，支持下载Instagram长视频内容。高清画质，支持大文件下载。',
    canonicalPath: '/download/igtv',
    faqData: [
      {
        question: '什么是IGTV？',
        answer: 'IGTV是Instagram的长视频平台，支持上传1分钟到60分钟的竖屏视频内容。'
      },
      {
        question: '如何下载IGTV视频？',
        answer: '复制IGTV视频链接，粘贴到下载框中，选择清晰度后即可下载完整视频。'
      },
      {
        question: '下载大文件IGTV会很慢吗？',
        answer: '我们优化了下载算法，支持大文件快速下载，并提供下载进度显示。'
      }
    ],
    features: [
      '长视频下载支持',
      '高清画质保持',
      '大文件快速下载',
      '进度实时显示',
      'MP4格式输出',
      '移动端兼容'
    ],
    howToSteps: [
      { step: '复制IGTV链接', description: '复制Instagram IGTV视频链接' },
      { step: '选择清晰度', description: '选择合适的视频画质' },
      { step: '下载视频', description: '开始下载长视频到设备' }
    ]
  },
  private: {
    title: 'Instagram私密内容下载器 - 私人账户内容下载',
    description: '专业的Instagram私密内容下载工具，支持下载私人账户的帖子、Stories等内容。需要授权访问，保护隐私安全。',
    keywords: ['Instagram私密下载', '私人账户下载', 'Instagram私有内容', '授权下载工具', '私密帖子下载'],
    h1: 'Instagram私密下载器 - 私人内容安全下载',
    ogTitle: 'Instagram私密内容下载器 - 私人账户内容下载',
    ogDescription: '专业的Instagram私密内容下载工具，支持下载私人账户的帖子、Stories等内容。需要授权访问，保护隐私。',
    canonicalPath: '/download/private',
    faqData: [
      {
        question: '如何下载私密Instagram账户的内容？',
        answer: '需要您授权登录Instagram账户，确保有权限访问私密内容后，才能进行下载。'
      },
      {
        question: '下载私密内容是否安全？',
        answer: '我们采用OAuth安全认证，不存储您的登录信息，仅在授权期间访问必要内容。'
      },
      {
        question: '是否支持下载朋友的私密Stories？',
        answer: '仅能下载您有访问权限的私密内容，需要对方已接受您的关注请求。'
      }
    ],
    features: [
      'OAuth安全认证',
      '私密内容访问',
      '隐私保护',
      '授权下载',
      '安全数据处理',
      '临时访问令牌'
    ],
    howToSteps: [
      { step: '安全登录', description: '使用Instagram账户安全登录' },
      { step: '授权访问', description: '授权访问私密内容权限' },
      { step: '下载内容', description: '下载有权限访问的私密内容' }
    ]
  },
  batch: {
    title: 'Instagram批量下载器 - 批量下载Instagram内容',
    description: '专业的Instagram批量下载工具，支持批量下载多个Instagram帖子、用户内容。高效处理，节省时间，支持任务队列管理。',
    keywords: ['Instagram批量下载', '批量下载工具', 'Instagram内容批量保存', '多任务下载器', '批量处理工具'],
    h1: 'Instagram批量下载器 - 高效批量处理',
    ogTitle: 'Instagram批量下载器 - 批量下载Instagram内容',
    ogDescription: '专业的Instagram批量下载工具，支持批量下载多个Instagram帖子、用户内容。高效处理，节省时间。',
    canonicalPath: '/batch-download',
    faqData: [
      {
        question: '如何进行Instagram批量下载？',
        answer: '添加多个Instagram链接到下载列表，选择下载类型和质量，一键开始批量下载任务。'
      },
      {
        question: '批量下载有数量限制吗？',
        answer: '免费用户每次可批量下载10个链接，VIP用户可享受更大批量下载配额。'
      },
      {
        question: '批量下载失败的链接如何处理？',
        answer: '系统会自动重试失败的下载，并提供详细的错误报告供您参考。'
      }
    ],
    features: [
      '批量链接处理',
      '任务队列管理',
      '进度实时跟踪',
      '错误自动重试',
      '下载统计报告',
      '高效并发下载'
    ],
    howToSteps: [
      { step: '添加链接', description: '批量添加Instagram内容链接' },
      { step: '配置选项', description: '设置下载质量和格式' },
      { step: '开始批量下载', description: '一键启动批量下载任务' }
    ]
  }
};

// 生成页面SEO配置
export function generateSEOConfig(contentType: ContentType, _locale: string = 'zh'): NextSeoProps {
  const config = contentTypeConfigs[contentType];
  const baseUrl = 'https://ins.popmars.com';
  
  return {
    ...baseSEOConfig,
    title: config.title,
    description: config.description,
    canonical: `${baseUrl}${config.canonicalPath}`,
    openGraph: {
      ...baseSEOConfig.openGraph,
      title: config.ogTitle,
      description: config.ogDescription,
      url: `${baseUrl}${config.canonicalPath}`,
    },
    additionalMetaTags: [
      ...baseSEOConfig.additionalMetaTags || [],
      {
        name: 'keywords',
        content: config.keywords.join(', '),
      },
    ],
  };
}