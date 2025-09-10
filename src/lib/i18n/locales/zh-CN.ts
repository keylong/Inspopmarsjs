export default {
  // 网站信息
  site: {
    title: 'Instagram 下载软件',
  },

  // Common UI elements
  common: {
    loading: '加载中...',
    error: '出错了',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    download: '下载',
    upload: '上传',
    share: '分享',
    copy: '复制',
    copied: '已复制',
    language: '语言',
  },

  // Navigation
  nav: {
    home: '首页',
    download: '下载',
    profile: '个人资料',
    settings: '设置',
    about: '关于',
    help: '帮助',
    contact: '联系我们',
    login: '登录',
    register: '注册',
    logout: '退出登录',
    dashboard: '控制台',
    subscription: '开通VIP',
    vip: 'VIP',
  },

  // Auth pages
  auth: {
    signin: {
      title: '登录',
      subtitle: '欢迎回来！请输入您的登录信息',
      email: '邮箱地址',
      password: '密码',
      remember: '记住我',
      forgot: '忘记密码？',
      submit: '登录',
      noAccount: '还没有账户？',
      createAccount: '创建账户',
      emailPlaceholder: '请输入邮箱地址',
      passwordPlaceholder: '请输入密码',
    },
    signup: {
      title: '注册',
      subtitle: '创建您的新账户',
      name: '姓名',
      email: '邮箱地址',
      password: '密码',
      confirmPassword: '确认密码',
      terms: '我同意',
      termsLink: '服务条款',
      privacy: '隐私政策',
      submit: '创建账户',
      hasAccount: '已有账户？',
      signIn: '立即登录',
      namePlaceholder: '请输入姓名',
      emailPlaceholder: '请输入邮箱地址',
      passwordPlaceholder: '请输入密码',
      confirmPasswordPlaceholder: '请再次输入密码',
    },
    errors: {
      invalidCredentials: '邮箱或密码错误',
      loginFailed: '登录失败，请重试',
      registrationFailed: '注册失败',
      passwordMismatch: '两次输入的密码不一致',
      passwordTooShort: '密码至少需要6个字符',
      registrationSuccess: '注册成功！正在为您自动登录...',
      autoLoginFailed: '注册成功但自动登录失败，请手动登录',
      loggingIn: '登录中...',
      registering: '注册中...',
      loginWithAccount: '登录到您的账户',
      passwordHint: '(至少6个字符)',
      or: '或者'
    }
  },

  // Download page
  download: {
    title: 'Instagram 下载软件',
    subtitle: '快速下载 Instagram 图片、视频、Stories 和 IGTV',
    urlLabel: 'Instagram URL',
    urlPlaceholder: '粘贴 Instagram 链接...',
    downloadButton: '立即下载',
    supportedTypes: '支持的类型',
    photos: '图片',
    videos: '视频',
    stories: 'Stories',
    igtv: 'IGTV',
    reels: 'Reels',
    highlights: 'Highlights',
    howTo: '使用方法',
    step1: '复制 Instagram 内容链接',
    step2: '粘贴到上方输入框',
    step3: '点击下载按钮',
    step4: '等待处理完成并下载',
    features: {
      title: '功能特色',
      highQuality: '高清质量',
      highQualityDesc: '下载原始高清质量的图片和视频',
      noWatermark: '无水印',
      noWatermarkDesc: '下载的内容不含任何水印',
      fastSpeed: '高速下载',
      fastSpeedDesc: '优化的下载引擎，确保快速下载',
      allFormats: '全格式支持',
      allFormatsDesc: '支持所有 Instagram 内容格式',
    },
    // 下载结果页面
    result: {
      completed: '下载完成',
      downloadFailed: '下载失败',
      retryDownload: '重试下载',
      errorCode: '错误代码',
      mediaDownload: '媒体下载',
      selectResolution: '选择分辨率',
      preview: '预览',
      copyFailed: '复制失败',
      downloadAll: '下载全部',
      downloadOptions: '个下载选项，总大小约',
      mediaFiles: '个媒体文件',
      totalSize: '总大小',
      carousel: '轮播',
      multiMedia: '多媒体',
      original: '原始',
      video: '视频',
      image: '图片',
      videoContent: '视频内容',
      imageContent: '图片内容',
      resolutions: '种分辨率',
      post: '帖子',
      story: '故事',
      reel: 'Reels',
      igtv: 'IGTV',
      highlight: '精彩时刻',
      content: '内容',
      trustedUsers: '用户信赖',
      totalDownloads: '次下载',
      rating: '评分',
      extremeSpeed: '极速体验',
      pureNoWatermark: '纯净无水印',
      fullFormatSupport: '全格式支持',
      supportedContent: '支持下载所有 Instagram 内容',
      photoPosts: '图片帖子',
      videoContent2: '视频内容',
      stories: 'Stories',
      reels: 'Reels',
    },
    // 下载表单
    form: {
      title: '快速下载 Instagram 内容',
      subtitle: '支持图片、视频、Stories、Reels 等所有格式',
      urlLabel: 'Instagram 链接',
      placeholder: '输入或粘贴 Instagram 链接（例如：https://www.instagram.com/p/...）',
      urlPlaceholder: '粘贴 Instagram 链接...',
      urlRequired: '请输入 Instagram 链接',
      invalidUrl: '请输入有效的 Instagram 链接',
      urlInvalid: '请输入有效的 URL',
      urlInvalidInstagram: '请输入有效的 Instagram 链接',
      urlValidationFailed: 'URL验证失败',
      downloadFailed: '下载失败',
      downloading: '下载中...',
      analyze: '解析链接',
      analyzing: '正在解析...',
      paste: '粘贴',
      startDownload: '开始下载',
      detected: '检测到',
      advancedOptions: '高级选项',
      contentType: '内容类型',
      quality: '画质',
      downloadFormat: '下载格式',
      supportedTypes: '支持的内容类型：',
      supportedContent: '支持所有格式',
      contentTypes: '图片 • 视频 • Stories • Reels • IGTV',
      autoDetect: '自动检测',
      originalQuality: '原画质',
      hdQuality: '高清',
      sdQuality: '标清',
      individualFiles: '单独文件',
      zipArchive: 'ZIP 压缩包',
      posts: '📷 帖子',
      videos: '📹 视频',
      stories2: '⭐ 故事',
      highlights2: '✨ 精彩时刻',
      unknownType: '未知类型',
      profileType: '个人资料',
      optimizedTool: '工具',
      contentDownloader: 'Instagram 内容下载器',
    },
  },

  // Profile page
  profile: {
    title: '个人资料',
    editProfile: '编辑资料',
    name: '姓名',
    email: '邮箱',
    avatar: '头像',
    downloadHistory: '下载历史',
    settings: '账户设置',
    deleteAccount: '删除账户',
    confirmDelete: '确认删除账户',
    deleteWarning: '此操作无法撤销。您的所有数据将被永久删除。',
    // New additions for profile page
    pageTitle: '个人资料',
    pageDescription: '管理您的账户信息和设置',
    basicInfo: {
      title: '基本信息',
      description: '更新您的基本账户信息',
      nameLabel: '姓名',
      namePlaceholder: '请输入姓名',
      emailLabel: '邮箱',
      emailNote: '邮箱地址无法修改',
      saveButton: '保存',
      savingButton: '保存中...',
      cancelButton: '取消',
      editButton: '编辑资料',
      updateSuccess: '资料更新成功',
      updateError: '更新失败，请重试'
    },
    accountInfo: {
      title: '账户信息',
      description: '查看您的账户详细信息',
      email: '邮箱',
      userId: '用户ID',
      registrationDate: '注册时间'
    },
    dangerZone: {
      title: '危险操作',
      description: '这些操作不可逆，请谨慎使用',
      deleteAccount: {
        title: '删除账户',
        warning: '删除您的账户将永久删除所有数据，此操作不可恢复。',
        button: '删除账户'
      }
    }
  },

  // SEO and meta
  seo: {
    siteName: 'InstagramDown - Instagram 下载软件',
    defaultTitle: 'Instagram 下载软件 - 免费下载 Instagram 图片和视频',
    defaultDescription: '免费的 Instagram 下载软件，支持下载图片、视频、Stories、IGTV 和 Reels，高清无水印，简单易用。',
    keywords: 'Instagram 下载软件, Instagram 图片下载, Instagram 视频下载, Stories 下载, IGTV 下载, Reels 下载',
  },

  // Error messages
  errors: {
    invalidUrl: '请输入有效的 Instagram 链接',
    networkError: '网络连接失败，请重试',
    serverError: '服务器错误，请稍后重试',
    notFound: '未找到相关内容',
    rateLimited: '请求过于频繁，请稍后重试',
    unauthorized: '您需要登录才能执行此操作',
    forbidden: '您没有权限执行此操作',
    generic: '发生未知错误，请重试',
  },

  // Success messages
  success: {
    downloadStarted: '下载已开始',
    profileUpdated: '个人资料已更新',
    settingsSaved: '设置已保存',
    accountCreated: '账户创建成功',
    loginSuccess: '登录成功',
  },

  // Terms of Service page
  terms: {
    title: '使用条款',
    subtitle: '请仔细阅读以下使用条款，使用我们的服务即表示您同意遵守这些条款',
    lastUpdated: '最后更新时间',
    version: '版本',
    tableOfContents: '目录',
    sections: {
      serviceDescription: {
        title: '1. 服务描述',
        content: [
          'InstagramDown（以下简称"我们"或"本服务"）是一个基于网页的工具，允许用户从Instagram下载公开可用的内容，包括图片、视频、Stories、Reels和IGTV内容。',
          '本服务仅用于个人、非商业用途。用户承诺不会将下载的内容用于任何违法或侵权的目的。',
          '我们保留随时修改、暂停或终止服务的权利，恕不另行通知。'
        ]
      },
      userResponsibilities: {
        title: '2. 用户责任',
        content: [
          '用户必须遵守所有适用的法律法规，包括但不限于版权法、隐私法和数据保护法。',
          '用户只能下载自己拥有版权或获得适当授权的内容。',
          '禁止用户将本服务用于以下目的：',
          '• 侵犯他人版权、商标权或其他知识产权',
          '• 骚扰、威胁或侵犯他人隐私',
          '• 传播恶意软件、病毒或其他有害代码',
          '• 进行任何形式的商业活动或营销推广',
          '• 违反Instagram的使用条款和社区准则',
          '用户对其使用本服务的行为承担全部责任。'
        ]
      },
      intellectualProperty: {
        title: '3. 知识产权',
        content: [
          '本服务的所有内容、功能和技术均受版权、商标权和其他知识产权法律保护。',
          '用户通过本服务下载的内容的版权归原始内容创作者所有。',
          '用户不得复制、修改、分发或商业化使用本服务的任何部分，除非获得我们的明确书面许可。',
          'Instagram是Meta Platforms, Inc.的商标。我们与Instagram或Meta没有任何关联。'
        ]
      },
      disclaimer: {
        title: '4. 免责声明',
        content: [
          '本服务按"现状"提供，不提供任何明示或暗示的保证。',
          '我们不保证服务的连续性、准确性、完整性或及时性。',
          '我们不对以下情况承担任何责任：',
          '• 因使用本服务而造成的任何直接或间接损失',
          '• 服务中断、数据丢失或系统故障',
          '• 第三方内容的准确性或合法性',
          '• 用户违反法律法规而产生的后果',
          '用户使用本服务的风险由其自行承担。'
        ]
      },
      serviceChanges: {
        title: '5. 服务变更',
        content: [
          '我们保留随时修改、更新或终止服务的权利。',
          '重大变更将通过网站公告或其他适当方式通知用户。',
          '继续使用服务即表示接受相关变更。',
          '如果用户不同意变更，应立即停止使用服务。'
        ]
      },
      accountTermination: {
        title: '6. 账户终止',
        content: [
          '我们有权在以下情况下终止用户的访问权限：',
          '• 违反本使用条款',
          '• 从事非法或有害活动',
          '• 滥用或过度使用服务资源',
          '• 其他我们认为不当的行为',
          '账户终止后，用户应立即停止使用服务。',
          '我们不对因账户终止而造成的任何损失承担责任。'
        ]
      },
      disputeResolution: {
        title: '7. 争议解决',
        content: [
          '因本条款引起的任何争议，双方应首先通过友好协商解决。',
          '如协商不成，争议应提交至服务提供方所在地有管辖权的法院解决。',
          '本条款的解释和执行适用中华人民共和国法律。',
          '如本条款的某一条款被认定为无效，不影响其他条款的有效性。'
        ]
      },
      contact: {
        title: '8. 联系我们',
        content: [
          '如果您对本使用条款有任何疑问，请通过以下方式联系我们：',
          '• 邮箱：support@instagramdown.com',
          '• 在线客服：访问我们的网站获取更多帮助',
          '我们将在收到您的询问后尽快回复。'
        ]
      }
    },
    effectiveDate: '生效日期：2024年1月1日',
    acknowledgment: '使用本服务即表示您已阅读、理解并同意受本使用条款约束。'
  },

  // Download Center page
  downloadCenter: {
    title: 'Instagram 下载中心',
    subtitle: '选择您需要的下载类型，享受专业的 Instagram 内容下载服务',
    breadcrumb: {
      home: '首页',
      center: '下载中心'
    },
    badges: {
      freeUse: '免费使用',
      hdNoWatermark: '高清无水印'
    },
    options: {
      post: {
        title: 'Instagram 帖子',
        description: '下载 Instagram 图片和视频帖子，支持高清无水印下载',
        features: ['高清画质', '无水印', '批量下载']
      },
      stories: {
        title: 'Instagram Stories',
        description: '匿名下载 Stories 内容，不留浏览记录，24小时内容',
        features: ['匿名下载', '无浏览记录', '实时获取']
      },
      reels: {
        title: 'Instagram Reels',
        description: '下载 Instagram Reels 短视频，保持原始质量',
        features: ['短视频', '原始质量', '快速下载']
      },
      igtv: {
        title: 'IGTV 视频',
        description: '下载 IGTV 长视频内容，支持高清格式',
        features: ['长视频', '高清格式', '稳定下载']
      },
      highlights: {
        title: 'Highlights 精选',
        description: '下载用户精选集锦内容，永久保存',
        features: ['精选内容', '永久保存', '批量处理']
      },
      profile: {
        title: '用户资料',
        description: '下载用户头像、个人资料图片等内容',
        features: ['头像下载', '资料图片', '简单快捷']
      }
    },
    howToUse: {
      title: '如何使用 Instagram 下载器？',
      steps: {
        step1: {
          title: '选择下载类型',
          description: '根据需要选择帖子、Stories、Reels 等不同的下载类型'
        },
        step2: {
          title: '粘贴链接',
          description: '复制 Instagram 内容链接并粘贴到相应的下载页面'
        },
        step3: {
          title: '开始下载',
          description: '点击下载按钮，等待处理完成并保存文件到设备'
        }
      }
    },
    button: {
      useNow: '立即使用'
    }
  },

  // About page
  about: {
    title: '关于 Instagram 下载器',
    features: {
      title: '功能特点',
      items: {
        0: '支持下载 Instagram 图片和视频',
        1: '高质量媒体文件下载',
        2: '支持批量下载',
        3: '简单易用的界面',
        4: '无需登录 Instagram 账户',
        5: '快速安全的下载过程'
      }
    },
    contentTypes: {
      title: '支持的内容类型',
      items: {
        0: '单张图片帖子',
        1: '视频帖子',
        2: '轮播图片/视频',
        3: 'Instagram Stories',
        4: 'Highlights',
        5: '个人资料图片'
      }
    },
    instructions: {
      title: '使用说明',
      steps: {
        step1: {
          title: '复制链接',
          description: '在 Instagram 中找到要下载的内容，点击分享按钮，复制链接'
        },
        step2: {
          title: '粘贴链接',
          description: '将复制的链接粘贴到下载页面的输入框中'
        },
        step3: {
          title: '开始下载',
          description: '点击下载按钮，等待处理完成'
        },
        step4: {
          title: '保存文件',
          description: '处理完成后，文件将自动开始下载到您的设备'
        }
      }
    }
  },

  // Footer
  footer: {
    company: 'Instagram下载软件',
    copyright: '版权所有',
    allRightsReserved: '保留所有权利',
    links: {
      privacy: '隐私政策',
      terms: '服务条款',
      help: '帮助中心',
      contact: '联系我们',
      about: '关于我们',
      postDownload: '帖子下载',
      storiesDownload: 'Stories下载',
    },
    social: {
      title: '关注我们',
      twitter: 'Twitter',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      followOn: '在',
      followUs: '上关注我们',
    },
    sections: {
      product: '产品',
      support: '支持',
      company: '公司',
      legal: '法律',
    },
    description: '最好用的 Instagram 内容下载工具，支持图片、视频、Stories、IGTV 和 Reels 下载。',
    ariaLabel: {
      footer: '网站页脚',
      backToHome: '回到首页',
    },
  },

  // Privacy Policy
  privacy: {
    title: '隐私政策',
    subtitle: '了解我们如何收集、使用和保护您的个人信息',
    lastUpdated: '最后更新',
    tableOfContents: '目录',
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
    }
  },

  // 下载子页面翻译
  downloadPages: {
    stories: {
      title: 'Instagram Stories 下载器',
      description: '专业的 Instagram Stories 下载工具',
      heading: 'Instagram Stories 下载器',
      subheading: '匿名下载 Instagram Stories 图片和视频',
      inputPlaceholder: '输入Instagram用户名或Stories链接...',
      features: {
        0: '匿名下载',
        1: '无浏览记录',
        2: '24小时内容'
      },
      howToUse: '如何下载 Instagram Stories？',
      steps: {
        step1: '输入用户名或复制Stories链接',
        step2: '点击下载按钮开始处理',
        step3: '选择要下载的Stories内容',
        step4: '等待处理完成并保存到设备'
      }
    },
    post: {
      title: 'Instagram 帖子下载器',
      description: 'Instagram 图片和视频帖子下载工具',
      heading: 'Instagram 图片/视频下载',
      subheading: '高清下载 Instagram 帖子内容，支持单图、轮播和视频',
      inputPlaceholder: '粘贴Instagram帖子链接...',
      features: {
        0: '高清质量',
        1: '无水印',
        2: '批量下载',
        3: '支持轮播'
      },
      howToUse: '如何下载 Instagram 帖子？'
    },
    reels: {
      title: 'Instagram Reels 下载器',
      description: 'Instagram Reels 短视频下载工具',
      heading: 'Instagram Reels 下载',
      subheading: '下载 Instagram Reels 短视频，保持原始画质',
      inputPlaceholder: '粘贴Instagram Reels链接...',
      features: {
        0: '短视频',
        1: '原始质量',
        2: '快速下载',
        3: 'MP4格式'
      },
      howToUse: '如何下载 Instagram Reels？'
    },
    igtv: {
      title: 'IGTV 视频下载器',
      description: 'IGTV 长视频内容下载工具',
      heading: 'IGTV 视频下载',
      subheading: '下载 IGTV 长视频内容，支持高清格式',
      inputPlaceholder: '粘贴IGTV视频链接...',
      features: {
        0: '长视频',
        1: '高清格式',
        2: '稳定下载',
        3: '大文件支持'
      },
      howToUse: '如何下载 IGTV 视频？'
    },
    highlights: {
      title: 'Highlights 精选下载器',
      description: 'Instagram Highlights 精选内容下载工具',
      heading: 'Highlights 精选下载',
      subheading: '下载用户精选集锦内容，永久保存',
      inputPlaceholder: '输入Instagram用户名...',
      features: {
        0: '精选内容',
        1: '永久保存',
        2: '批量处理',
        3: '分类下载'
      },
      howToUse: '如何下载 Instagram Highlights？'
    },
    profile: {
      title: '用户资料下载器',
      description: 'Instagram 用户头像和资料下载工具',
      heading: '用户头像下载',
      subheading: '下载用户头像、个人资料图片等内容',
      inputPlaceholder: '输入Instagram用户名...',
      features: {
        0: '头像下载',
        1: '资料图片',
        2: '简单快捷',
        3: '高清质量'
      },
      howToUse: '如何下载用户资料？'
    },
    private: {
      title: '私密内容下载器',
      description: 'Instagram 私密内容下载工具',
      heading: '私密内容下载',
      subheading: '下载私密账户的内容（需要授权）',
      inputPlaceholder: '需要登录授权后下载私密内容...',
      features: {
        0: '私密内容',
        1: '授权访问',
        2: '安全下载',
        3: '用户隐私'
      },
      howToUse: '如何下载私密内容？'
    }
  },

  // 订阅页面
  subscription: {
    // 页面标题和描述
    pageTitle: '订阅管理',
    pageDescription: '管理您的订阅计划和账单信息',
    // 当前订阅部分
    currentSubscription: '当前订阅',
    noSubscription: '暂无有效订阅',
    selectPlan: '选择适合您的订阅套餐开始使用',
    plans: '订阅套餐',
    currentPlan: '当前套餐',
    validUntil: '有效期至',
    usageThisPeriod: '本周期使用',
    unlimited: '无限制',
    times: '次',
    paymentMethod: '支付方式',
    stripePayment: 'Stripe 支付',
    alipayPayment: '支付宝支付',
    verifyingPayment: '正在验证支付状态...',
    paymentSuccess: '支付成功！',
    paymentCanceled: '支付已取消',
    paymentCanceledMessage: '您的支付已被取消，没有产生任何费用。如有疑问，请随时联系我们。',
    thankYouSubscription: '感谢您的订阅！您的账户已成功升级，现在可以享受完整的服务了。',
    viewSubscriptionDetails: '查看订阅详情',
    startUsing: '开始使用',
    retrySelectPlan: '重新选择套餐',
    returnHome: '返回首页',
    status: {
      active: '激活',
      canceled: '已取消',
      expired: '已过期',
      pending: '待支付'
    },
    errors: {
      fetchFailed: '获取订阅信息失败',
      plansFetchFailed: '获取套餐信息失败',
      checkoutFailed: '创建支付会话失败',
      unknownError: '未知错误',
      retryLater: '创建支付会话失败，请稍后重试'
    },
    duration: {
      monthly: '月',
      yearly: '年'
    },
    // 计划内容
    title: '订阅计划',
    description: '选择适合您的订阅计划',
    heading: '选择您的订阅计划',
    subheading: '解锁更多高级功能，享受更好的下载体验',
    planDetails: {
      free: {
        title: '免费版',
        price: '¥0',
        period: '/月',
        features: [
          '每日限制下载 10 次',
          '基础下载功能',
          '标准画质',
          '社区支持'
        ],
        button: '当前计划'
      },
      premium: {
        title: '高级版',
        price: '¥29',
        period: '/月',
        features: [
          '无限制下载',
          '高清画质保证',
          '批量下载功能',
          '优先客服支持',
          '无广告体验'
        ],
        button: '升级到高级版',
        popular: '推荐'
      },
      pro: {
        title: '专业版',
        price: '¥99',
        period: '/月',
        features: [
          '高级版所有功能',
          '私密内容访问',
          'API 接口访问',
          '专属客服支持',
          '高级统计功能'
        ],
        button: '升级到专业版'
      }
    },
    features: {
      title: '为什么选择付费计划？',
      items: [
        '更高的下载次数限制',
        '更好的下载质量保证',
        '优先技术支持',
        '持续的功能更新'
      ]
    }
  },

  // 批量下载页面
  batchDownload: {
    // 页面基础信息
    pageTitle: '批量下载',
    pageDescription: '高效处理多个Instagram链接，一次性完成批量下载',
    placeholder: '添加多个Instagram链接进行批量下载...',
    optimizedFor: '批量下载',
    featureLabels: {
        0: '批量处理',
        1: '任务队列',
        2: '进度跟踪'
      },
    title: '批量下载',
    description: '一次下载多个Instagram内容',
    heading: '批量下载工具',
    subheading: '提高效率，一次处理多个Instagram链接',
    inputPlaceholder: '每行输入一个Instagram链接...',
    addLink: '添加链接',
    removeLink: '删除',
    startBatch: '开始批量下载',
    progress: '进度',
    completed: '已完成',
    failed: '失败',
    pending: '等待中',
    features: [
      '支持多种内容类型',
      '智能错误处理',
      '下载进度跟踪',
      '批量压缩包下载'
    ],
    howToUse: '如何使用批量下载？',
    steps: {
      step1: '粘贴多个Instagram链接（每行一个）',
      step2: '点击开始批量下载',
      step3: '查看下载进度和状态',
      step4: '下载完成后获取压缩包'
    },
    limits: {
      free: '免费用户：每次最多5个链接',
      premium: '高级用户：每次最多50个链接',
      pro: '专业用户：无限制'
    }
  },

  // Help page
  help: {
    title: '使用帮助',
    subtitle: '了解如何使用我们的 Instagram 下载工具，获得最佳使用体验',
    
    // 快速导航
    quickStart: {
      title: '快速开始',
      description: '新手入门指南',
      step1: {
        title: '复制链接',
        description: '从 Instagram 复制您想下载的内容链接',
        example: '示例链接格式：',
        tip1: '支持帖子、视频、Stories、Reels 等',
        tip2: '确保链接完整且有效'
      },
      step2: {
        title: '粘贴下载',
        description: '将链接粘贴到下载框并点击下载',
        placeholder: '粘贴 Instagram 链接...',
        note: '系统会自动分析并提供下载选项'
      }
    },
    
    downloadGuide: {
      title: '下载指南',
      description: '详细下载步骤',
      stepByStep: {
        title: '详细下载步骤',
        description: '按照以下步骤轻松下载任何 Instagram 内容'
      },
      steps: {
        step1: {
          title: '找到目标内容',
          description: '在 Instagram 中浏览并找到您想要下载的图片、视频或其他内容',
          tip: '💡 提示：确保内容是公开可见的，私密账户的内容可能无法下载'
        },
        step2: {
          title: '复制内容链接',
          description: '点击内容右上角的三个点菜单，选择"复制链接"选项',
        },
        step3: {
          title: '粘贴链接到下载器',
          description: '返回我们的网站，将复制的链接粘贴到下载输入框中',
        },
        step4: {
          title: '选择格式并下载',
          description: '选择您需要的质量和格式，然后点击下载按钮开始下载',
        }
      },
      tips: {
        title: '下载小贴士',
        tip1: '选择最高质量以获得最佳效果',
        tip2: '批量下载可以节省时间',
        tip3: '定期清理下载的文件以节省存储空间',
        tip4: '尊重原创者的版权，仅供个人使用'
      },
      limitations: {
        title: '使用限制',
        item1: '只能下载公开可见的内容',
        item2: '无法下载已删除或私密的内容',
        item3: '请遵守相关法律法规和平台条款'
      }
    },
    
    faq: {
      title: '常见问题',
      description: '快速解答常见疑问',
      items: {
        q1: {
          question: '这个下载工具是免费的吗？',
          answer: '是的，我们的基础下载功能完全免费。高级用户可以选择付费计划以获得更多功能和更快的下载速度。'
        },
        q2: {
          question: '可以下载私密账户的内容吗？',
          answer: '出于隐私保护，我们无法下载私密账户的内容。只有公开可见的内容才能被下载。'
        },
        q3: {
          question: '下载的内容质量如何？',
          answer: '我们提供原始质量的下载，确保您获得最高清的图片和视频，无任何质量损失。'
        },
        q4: {
          question: '支持哪些类型的内容？',
          answer: '我们支持 Instagram 的所有主要内容类型：图片帖子、视频帖子、Stories、Reels、IGTV 和 Highlights。'
        },
        q5: {
          question: '下载速度慢怎么办？',
          answer: '下载速度取决于文件大小和您的网络连接。如果遇到问题，请尝试刷新页面或稍后重试。付费用户享有优先下载通道。'
        },
        q6: {
          question: '可以同时下载多个内容吗？',
          answer: '是的，我们支持批量下载功能。您可以添加多个链接并一次性下载所有内容。'
        },
        q7: {
          question: '下载的文件会包含水印吗？',
          answer: '不会，我们下载的是原始文件，不含任何水印或标识。但请尊重原创者的版权。'
        },
        q8: {
          question: '如何举报问题或提供反馈？',
          answer: '您可以通过我们的联系页面提交问题报告或建议。我们重视每一个用户的反馈。'
        }
      }
    },
    
    // 标签页
    tabs: {
      quickStart: '快速开始',
      downloadGuide: '下载指南',
      faq: '常见问题',
      troubleshooting: '故障排除'
    },
    
    // 支持的内容类型
    supportedTypes: {
      title: '支持的内容类型',
      description: '我们支持 Instagram 平台上的所有主要内容格式',
      photos: '图片帖子',
      photosDesc: '单张或多张图片',
      videos: '视频帖子',
      videosDesc: '各种格式的视频',
      stories: 'Stories',
      storiesDesc: '24小时动态内容',
      reels: 'Reels 短视频',
      reelsDesc: '竖屏短视频内容',
      igtv: 'IGTV 长视频',
      igtvDesc: '长格式视频内容',
      highlights: 'Highlights 精选',
      highlightsDesc: '用户精选集锦'
    },
    
    // 故障排除
    troubleshooting: {
      common: {
        title: '常见问题排除',
        description: '遇到问题时的解决方案'
      },
      problems: {
        problem1: {
          title: '链接无法识别',
          description: '系统提示"无法识别链接"或"链接无效"',
          solution: '确保复制的是完整的 Instagram 链接，格式类似于 https://www.instagram.com/p/... 检查链接是否包含必要的参数。'
        },
        problem2: {
          title: '下载失败',
          description: '点击下载后没有响应或显示错误信息',
          solution: '刷新页面重试，检查网络连接是否稳定。如果内容已被删除或设为私密，则无法下载。'
        },
        problem3: {
          title: '文件质量不佳',
          description: '下载的图片或视频质量比预期低',
          solution: '选择"原始质量"或"高清"选项。某些内容可能只有较低质量版本可用。'
        },
        problem4: {
          title: '下载速度慢',
          description: '下载过程耗时较长',
          solution: '大文件需要更多时间下载。确保网络连接稳定，避免同时进行其他下载任务。付费用户享有更快速度。'
        }
      },
      solution: '解决方案'
    },
    
    // 需要更多帮助
    needMoreHelp: {
      title: '需要更多帮助？',
      description: '如果您没有找到答案，请随时联系我们的支持团队',
      contactUs: '联系我们',
      tryNow: '立即试用'
    },
    
    contact: {
      title: '联系支持',
      description: '获得专业帮助'
    }
  },
  
  // Premium upgrade modal
  premiumUpgrade: {
    title: '解锁原图画质',
    subtitle: '升级至VIP会员，享受无限制原图下载',
    features: {
      originalQuality: {
        title: '原图画质下载',
        description: '获得最高分辨率图片'
      },
      unlimitedDownloads: {
        title: '无限下载次数',
        description: '不再受限制约束'
      },
      prioritySupport: {
        title: '优先支持',
        description: '专属客服优先处理'
      }
    },
    buttons: {
      signUp: '立即注册成为VIP',
      login: '已有账户？立即登录'
    },
    promotion: {
      title: '💎 限时优惠：',
      description: '新用户首月仅需 ¥9.9，立享所有VIP特权！'
    }
  },

  // Contact page
  contact: {
    title: '联系我们',
    subtitle: '有任何问题或建议？我们很乐意听取您的反馈并提供帮助',
    
    // 联系信息
    info: {
      title: '联系信息',
      description: '通过以下方式与我们取得联系',
      email: '邮箱地址',
      hours: '工作时间',
      hoursDetail: '周一至周五 9:00-18:00 (GMT+8)',
      location: '服务地区',
      locationDetail: '全球在线服务'
    },
    
    // 响应时间
    responseTime: {
      title: '预期响应时间',
      urgent: '紧急问题',
      normal: '一般咨询',
      general: '普通反馈',
      hours: '小时'
    },
    
    // 联系表单
    form: {
      title: '发送消息',
      description: '请填写以下表单，我们会尽快回复您',
      name: '姓名',
      namePlaceholder: '请输入您的姓名',
      email: '邮箱地址',
      emailPlaceholder: '请输入您的邮箱地址',
      subject: '主题',
      subjectPlaceholder: '简要描述您的问题',
      category: '问题类别',
      categoryPlaceholder: '选择问题类型',
      categories: {
        support: '技术支持',
        bug: '错误报告',
        feedback: '意见反馈',
        feature: '功能建议',
        other: '其他问题'
      },
      message: '详细描述',
      messagePlaceholder: '请详细描述您的问题或建议，我们会根据您的描述提供针对性的帮助...',
      submit: '发送消息',
      submitting: '发送中...',
      reset: '重置表单',
      note: '我们承诺保护您的隐私，不会将您的信息用于其他用途。'
    },
    
    // 提交成功页面
    success: {
      title: '消息发送成功！',
      description: '感谢您的反馈，我们已收到您的消息',
      details: '我们会在 24 小时内回复您。如果您的问题比较紧急，您也可以通过邮箱直接联系我们。',
      sendAnother: '发送其他消息',
      backHome: '返回首页'
    },
    
    // 快速帮助
    quickHelp: {
      title: '快速获得帮助',
      description: '在联系我们之前，您也可以尝试以下快速解决方案',
      faq: {
        title: '常见问题',
        description: '查看最常见的问题和答案',
        button: '查看 FAQ'
      },
      guide: {
        title: '使用指南',
        description: '详细的使用说明和技巧',
        button: '查看指南'
      },
      troubleshooting: {
        title: '故障排除',
        description: '解决常见的技术问题',
        button: '排除故障'
      }
    }
  },

} as const;