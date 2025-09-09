export default {
  // Site information
  site: {
    title: 'Instagram 下載器',
  },

  // Common UI elements
  common: {
    loading: '載入中...',
    error: '發生錯誤',
    success: '成功',
    cancel: '取消',
    confirm: '確認',
    save: '儲存',
    delete: '刪除',
    edit: '編輯',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '關閉',
    search: '搜尋',
    filter: '篩選',
    sort: '排序',
    download: '下載',
    upload: '上傳',
    share: '分享',
    copy: '複製',
    copied: '已複製',
    language: '語言',
  },

  // Navigation
  nav: {
    home: '首頁',
    download: '下載',
    profile: '個人資料',
    settings: '設定',
    about: '關於',
    help: '說明',
    contact: '聯絡我們',
    login: '登入',
    register: '註冊',
    logout: '登出',
    dashboard: '控制台',
  },

  // Auth pages
  auth: {
    signin: {
      title: '登入',
      subtitle: '歡迎回來！請輸入您的登入資訊',
      email: '電子信箱',
      password: '密碼',
      remember: '記住我',
      forgot: '忘記密碼？',
      submit: '登入',
      noAccount: '還沒有帳戶？',
      createAccount: '建立帳戶',
      emailPlaceholder: '請輸入電子信箱',
      passwordPlaceholder: '請輸入密碼',
    },
    signup: {
      title: '註冊',
      subtitle: '建立您的新帳戶',
      name: '姓名',
      email: '電子信箱',
      password: '密碼',
      confirmPassword: '確認密碼',
      terms: '我同意',
      termsLink: '服務條款',
      privacy: '隱私政策',
      submit: '建立帳戶',
      hasAccount: '已有帳戶？',
      signIn: '立即登入',
      namePlaceholder: '請輸入姓名',
      emailPlaceholder: '請輸入電子信箱',
      passwordPlaceholder: '請輸入密碼',
      confirmPasswordPlaceholder: '請再次輸入密碼',
    },
    errors: {
      invalidCredentials: '電子信箱或密碼不正確',
      loginFailed: '登入失敗，請重試',
      registrationFailed: '註冊失敗',
      passwordMismatch: '密碼不相符',
      passwordTooShort: '密碼至少需要 6 個字元',
      registrationSuccess: '註冊成功！正在自動登入...',
      autoLoginFailed: '註冊成功但自動登入失敗，請手動登入',
      loggingIn: '正在登入...',
      registering: '正在建立帳戶...',
      loginWithAccount: '登入您的帳戶',
      passwordHint: '(至少 6 個字元)',
      or: '或'
    }
  },

  // Download page
  download: {
    title: 'Instagram 內容下載器',
    subtitle: '快速下載 Instagram 圖片、影片、Stories 和 IGTV',
    urlLabel: 'Instagram URL',
    urlPlaceholder: '貼上 Instagram 連結...',
    downloadButton: '立即下載',
    supportedTypes: '支援類型',
    photos: '圖片',
    videos: '影片',
    stories: 'Stories',
    igtv: 'IGTV',
    reels: 'Reels',
    highlights: 'Highlights',
    howTo: '使用方法',
    step1: '複製 Instagram 內容連結',
    step2: '貼到上方輸入框',
    step3: '點擊下載按鈕',
    step4: '等待處理完成並下載',
    features: {
      title: '功能特色',
      highQuality: '高清品質',
      highQualityDesc: '下載原始高清品質的圖片和影片',
      noWatermark: '無浮水印',
      noWatermarkDesc: '下載的內容不含任何浮水印',
      fastSpeed: '高速下載',
      fastSpeedDesc: '最佳化的下載引擎，確保快速下載',
      allFormats: '全格式支援',
      allFormatsDesc: '支援所有 Instagram 內容格式',
    },
    // 下載結果頁面
    result: {
      completed: '下載完成',
      downloadFailed: '下載失敗',
      retryDownload: '重試下載',
      errorCode: '錯誤代碼',
      mediaDownload: '媒體下載',
      selectResolution: '選擇解析度',
      preview: '預覽',
      copyFailed: '複製失敗',
      downloadAll: '全部下載',
      downloadOptions: '個下載選項，總大小約',
      mediaFiles: '個媒體檔案',
      totalSize: '總大小',
      carousel: '輪播',
      multiMedia: '多媒體',
      original: '原始',
      video: '影片',
      image: '圖片',
      videoContent: '影片內容',
      imageContent: '圖片內容',
      resolutions: '解析度',
      post: '貼文',
      story: 'Story',
      reel: 'Reel',
      igtv: 'IGTV',
      highlight: 'Highlight',
      content: '內容',
      trustedUsers: '位用戶信任',
      totalDownloads: '次下載',
      rating: '評分',
      extremeSpeed: '極速',
      pureNoWatermark: '純無浮水印',
      fullFormatSupport: '完整格式支援',
      supportedContent: '支援下載所有 Instagram 內容',
      photoPosts: '圖片貼文',
      videoContent2: '影片內容',
      stories: 'Stories',
      reels: 'Reels',
    },
    // 下載表單
    form: {
      urlLabel: 'Instagram URL',
      urlPlaceholder: '貼上 Instagram 連結...',
      urlRequired: '請輸入 Instagram 連結',
      urlInvalid: '請輸入有效的 URL',
      urlInvalidInstagram: '請輸入有效的 Instagram 連結',
      urlValidationFailed: 'URL 驗證失敗',
      downloadFailed: '下載失敗',
      downloading: '下載中...',
      startDownload: '開始下載',
      detected: '已偵測',
      advancedOptions: '進階選項',
      contentType: '內容類型',
      quality: '品質',
      downloadFormat: '下載格式',
      supportedTypes: '支援的內容類型：',
      autoDetect: '自動偵測',
      originalQuality: '原始品質',
      hdQuality: '高清',
      sdQuality: '標清',
      individualFiles: '個別檔案',
      zipArchive: 'ZIP 壓縮檔',
      posts: '📷 貼文',
      videos: '📹 影片',
      stories2: '⭐ Stories',
      highlights2: '✨ Highlights',
      unknownType: '未知類型',
      profileType: '個人檔案',
      optimizedTool: '最佳化工具',
      contentDownloader: 'Instagram 內容下載器',
    },
  },

  // Profile page
  profile: {
    title: '個人資料',
    editProfile: '編輯資料',
    name: '姓名',
    email: '電子信箱',
    avatar: '頭像',
    downloadHistory: '下載紀錄',
    settings: '帳戶設定',
    deleteAccount: '刪除帳戶',
    confirmDelete: '確認刪除帳戶',
    deleteWarning: '此操作無法復原。您的所有資料將被永久刪除。',
    // 個人資料頁面新增項目
    pageTitle: '個人資料',
    pageDescription: '管理您的帳戶資訊和設定',
    basicInfo: {
      title: '基本資訊',
      description: '更新您的基本帳戶資訊',
      nameLabel: '姓名',
      namePlaceholder: '請輸入您的姓名',
      emailLabel: '電子信箱',
      emailNote: '電子信箱地址無法修改',
      saveButton: '儲存',
      savingButton: '儲存中...',
      cancelButton: '取消',
      editButton: '編輯個人資料',
      updateSuccess: '個人資料更新成功',
      updateError: '更新失敗，請重試'
    },
    accountInfo: {
      title: '帳戶資訊',
      description: '檢視您的帳戶詳細資料',
      email: '電子信箱',
      userId: '使用者 ID',
      registrationDate: '註冊日期'
    },
    dangerZone: {
      title: '危險區域',
      description: '這些操作無法復原，請謹慎使用',
      deleteAccount: {
        title: '刪除帳戶',
        warning: '刪除您的帳戶將永久移除所有資料。此操作無法復原。',
        button: '刪除帳戶'
      }
    }
  },

  // SEO and meta
  seo: {
    siteName: 'InstagramDown - Instagram 內容下載器',
    defaultTitle: 'Instagram 下載器 - 免費下載 Instagram 圖片和影片',
    defaultDescription: '免費的 Instagram 下載工具，支援下載圖片、影片、Stories、IGTV 和 Reels，高清無浮水印，簡單易用。',
    keywords: 'Instagram 下載器, Instagram 圖片下載, Instagram 影片下載, Stories 下載, IGTV 下載, Reels 下載',
  },

  // Error messages
  errors: {
    invalidUrl: '請輸入有效的 Instagram 連結',
    networkError: '網路連線失敗，請重試',
    serverError: '伺服器錯誤，請稍後重試',
    notFound: '未找到相關內容',
    rateLimited: '請求過於頻繁，請稍後重試',
    unauthorized: '您需要登入才能執行此操作',
    forbidden: '您沒有權限執行此操作',
    generic: '發生未知錯誤，請重試',
  },

  // Success messages
  success: {
    downloadStarted: '下載已開始',
    profileUpdated: '個人資料已更新',
    settingsSaved: '設定已儲存',
    accountCreated: '帳戶建立成功',
    loginSuccess: '登入成功',
  },

  // Terms of Service page
  terms: {
    title: '使用條款',
    subtitle: '請仔細閱讀以下使用條款，使用我們的服務即表示您同意遵守這些條款',
    lastUpdated: '最後更新時間',
    version: '版本',
    tableOfContents: '目錄',
    sections: {
      serviceDescription: {
        title: '1. 服務描述',
        content: [
          'InstagramDown（以下簡稱「我們」或「本服務」）是一個基於網頁的工具，允許用戶從Instagram下載公開可用的內容，包括圖片、影片、Stories、Reels和IGTV內容。',
          '本服務僅用於個人、非商業用途。用戶承諾不會將下載的內容用於任何違法或侵權的目的。',
          '我們保留隨時修改、暫停或終止服務的權利，恕不另行通知。'
        ]
      },
      userResponsibilities: {
        title: '2. 用戶責任',
        content: [
          '用戶必須遵守所有適用的法律法規，包括但不限於著作權法、隱私法和資料保護法。',
          '用戶只能下載自己擁有著作權或獲得適當授權的內容。',
          '禁止用戶將本服務用於以下目的：',
          '• 侵犯他人著作權、商標權或其他智慧財產權',
          '• 騷擾、威脅或侵犯他人隱私',
          '• 傳播惡意軟體、病毒或其他有害代碼',
          '• 進行任何形式的商業活動或行銷推廣',
          '• 違反Instagram的使用條款和社群準則',
          '用戶對其使用本服務的行為承擔全部責任。'
        ]
      },
      intellectualProperty: {
        title: '3. 智慧財產權',
        content: [
          '本服務的所有內容、功能和技術均受著作權、商標權和其他智慧財產權法律保護。',
          '用戶通過本服務下載的內容的著作權歸原始內容創作者所有。',
          '用戶不得複製、修改、分發或商業化使用本服務的任何部分，除非獲得我們的明確書面許可。',
          'Instagram是Meta Platforms, Inc.的商標。我們與Instagram或Meta沒有任何關聯。'
        ]
      },
      disclaimer: {
        title: '4. 免責聲明',
        content: [
          '本服務按「現狀」提供，不提供任何明示或暗示的保證。',
          '我們不保證服務的連續性、準確性、完整性或及時性。',
          '我們不對以下情況承擔任何責任：',
          '• 因使用本服務而造成的任何直接或間接損失',
          '• 服務中斷、資料丟失或系統故障',
          '• 第三方內容的準確性或合法性',
          '• 用戶違反法律法規而產生的後果',
          '用戶使用本服務的風險由其自行承擔。'
        ]
      },
      serviceChanges: {
        title: '5. 服務變更',
        content: [
          '我們保留隨時修改、更新或終止服務的權利。',
          '重大變更將通過網站公告或其他適當方式通知用戶。',
          '繼續使用服務即表示接受相關變更。',
          '如果用戶不同意變更，應立即停止使用服務。'
        ]
      },
      accountTermination: {
        title: '6. 帳戶終止',
        content: [
          '我們有權在以下情況下終止用戶的訪問權限：',
          '• 違反本使用條款',
          '• 從事非法或有害活動',
          '• 濫用或過度使用服務資源',
          '• 其他我們認為不當的行為',
          '帳戶終止後，用戶應立即停止使用服務。',
          '我們不對因帳戶終止而造成的任何損失承擔責任。'
        ]
      },
      disputeResolution: {
        title: '7. 爭議解決',
        content: [
          '因本條款引起的任何爭議，雙方應首先通過友好協商解決。',
          '如協商不成，爭議應提交至服務提供方所在地有管轄權的法院解決。',
          '本條款的解釋和執行適用中華民國法律。',
          '如本條款的某一條款被認定為無效，不影響其他條款的有效性。'
        ]
      },
      contact: {
        title: '8. 聯絡我們',
        content: [
          '如果您對本使用條款有任何疑問，請通過以下方式聯絡我們：',
          '• 電子郵件：support@instagramdown.com',
          '• 線上客服：造訪我們的網站獲取更多幫助',
          '我們將在收到您的詢問後儘快回覆。'
        ]
      }
    },
    effectiveDate: '生效日期：2024年1月1日',
    acknowledgment: '使用本服務即表示您已閱讀、理解並同意受本使用條款約束。'
  },

  // Download Center page
  downloadCenter: {
    title: 'Instagram 下載中心',
    subtitle: '選擇您偏好的下載類型，享受專業的 Instagram 內容下載服務',
    breadcrumb: {
      home: '首頁',
      center: '下載中心'
    },
    badges: {
      freeUse: '免費使用',
      hdNoWatermark: '高清無浮水印'
    },
    options: {
      post: {
        title: 'Instagram 貼文',
        description: '下載高清無浮水印的 Instagram 圖片和影片貼文',
        features: ['高清品質', '無浮水印', '批量下載']
      },
      stories: {
        title: 'Instagram Stories',
        description: '匿名下載 Stories，無觀看記錄，24小時內容',
        features: ['匿名下載', '無觀看記錄', '即時獲取']
      },
      reels: {
        title: 'Instagram Reels',
        description: '保持原始品質下載 Instagram Reels 短影片',
        features: ['短影片', '原始品質', '快速下載']
      },
      igtv: {
        title: 'IGTV 影片',
        description: '以高清格式下載 IGTV 長影片內容',
        features: ['長影片', '高清格式', '穩定下載']
      },
      highlights: {
        title: 'Highlights',
        description: '下載用戶精選 Highlights 內容供永久保存',
        features: ['精選內容', '永久保存', '批量處理']
      },
      profile: {
        title: '用戶個人檔案',
        description: '下載用戶頭像、個人檔案圖片和其他內容',
        features: ['頭像下載', '個人檔案圖片', '簡單快速']
      }
    },
    howToUse: {
      title: '如何使用 Instagram 下載器',
      steps: {
        step1: {
          title: '選擇下載類型',
          description: '根據需求選擇不同的下載類型，如貼文、Stories、Reels 等'
        },
        step2: {
          title: '貼上連結',
          description: '複製 Instagram 內容連結並貼到對應的下載頁面'
        },
        step3: {
          title: '開始下載',
          description: '點擊下載按鈕，等待處理完成並將檔案儲存到您的裝置'
        }
      }
    },
    button: {
      useNow: '立即使用'
    }
  },

  // About page
  about: {
    title: '關於 Instagram 下載器',
    features: {
      title: '功能特色',
      items: [
        '支援下載 Instagram 圖片和影片',
        '高品質媒體檔案下載',
        '支援批量下載',
        '簡潔易用的介面',
        '無需登入 Instagram 帳戶',
        '快速安全的下載流程'
      ]
    },
    contentTypes: {
      title: '支援的內容類型',
      items: [
        '單張圖片貼文',
        '影片貼文',
        '圖片/影片輪播',
        'Instagram Stories',
        'Highlights',
        '個人檔案圖片'
      ]
    },
    instructions: {
      title: '使用說明',
      steps: {
        step1: {
          title: '複製連結',
          description: '在 Instagram 上找到您想下載的內容，點擊分享按鈕並複製連結'
        },
        step2: {
          title: '貼上連結',
          description: '將複製的連結貼到下載頁面的輸入框中'
        },
        step3: {
          title: '開始下載',
          description: '點擊下載按鈕並等待處理完成'
        },
        step4: {
          title: '儲存檔案',
          description: '處理完成後，檔案將自動開始下載到您的裝置'
        }
      }
    }
  },

  // Footer
  footer: {
    company: 'Instagram 下載器',
    copyright: '版權所有',
    allRightsReserved: '保留所有權利',
    links: {
      privacy: '隱私政策',
      terms: '服務條款',
      help: '說明中心',
      contact: '聯絡我們',
      about: '關於我們',
    },
    social: {
      title: '關注我們',
      twitter: 'Twitter',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
    },
    sections: {
      product: '產品',
      support: '支援',
      company: '公司',
      legal: '法律',
    },
    description: '最好用的 Instagram 內容下載工具，支援圖片、影片、Stories、IGTV 和 Reels 下載。',
  },

  // Privacy Policy
  privacy: {
    title: '隱私政策',
    subtitle: '了解我們如何收集、使用和保護您的個人資訊',
    lastUpdated: '最後更新',
    tableOfContents: '目錄',
    sections: {
      overview: {
        title: '概述',
        content: '本隱私政策說明了InstagramDown（「我們」、「我們的」）如何收集、使用和保護您在使用我們的Instagram內容下載服務時的個人資訊。我們致力於保護您的隱私權，並確保遵守相關資料保護法律法規，包括GDPR（通用資料保護條例）和CCPA（加州消費者隱私法案）。'
      },
      dataCollection: {
        title: '資料收集',
        content: '我們收集以下類型的資訊：',
        items: [
          '您提供的Instagram連結和URL',
          '瀏覽器類型、版本和作業系統資訊',
          'IP位址和地理位置（僅用於分析目的）',
          'Cookie和類似技術收集的使用資料',
          '裝置識別碼和網路資訊',
          '使用統計和效能資料'
        ]
      },
      dataUsage: {
        title: '資料使用',
        content: '我們使用收集的資訊用於：',
        items: [
          '提供和改進我們的Instagram內容下載服務',
          '處理和執行您的下載請求',
          '分析服務使用情況和最佳化使用者體驗',
          '防止詐欺行為和確保服務安全',
          '遵守法律義務和回應法律程序',
          '傳送重要的服務通知和更新'
        ]
      },
      dataSecurity: {
        title: '資料安全',
        content: '我們採取以下措施保護您的資料：',
        items: [
          'SSL/TLS加密傳輸所有敏感資料',
          '存取控制和身份驗證機制',
          '定期安全稽核和漏洞評估',
          '資料最小化原則 - 只收集必要資訊',
          '安全的資料儲存和備份程序',
          '員工資料保護培訓和存取限制'
        ]
      },
      thirdPartyServices: {
        title: '第三方服務',
        content: '我們使用以下第三方服務，它們可能會收集您的資訊：',
        items: [
          'Google Analytics - 網站使用分析',
          'Cloudflare - CDN和安全服務',
          'Instagram API - 內容獲取（符合Instagram服務條款）',
          'Stripe - 付款處理（如適用）',
          '雲端儲存提供商 - 臨時檔案儲存'
        ]
      },
      userRights: {
        title: '您的權利',
        content: '根據GDPR和其他資料保護法律，您擁有以下權利：',
        items: [
          '存取權：獲取我們持有的您的個人資料副本',
          '更正權：要求更正不準確或不完整的個人資料',
          '刪除權：在特定情況下要求刪除您的個人資料',
          '限制處理權：限制我們處理您的個人資料',
          '資料可攜權：以結構化、常用格式接收您的資料',
          '反對權：反對基於合法利益的資料處理'
        ]
      },
      dataRetention: {
        title: '資料保留',
        content: '我們的資料保留政策如下：',
        items: [
          '下載歷史：保留30天後自動刪除',
          'IP位址和日誌：保留90天用於安全分析',
          '分析資料：匿名化處理後保留2年',
          'Cookie資料：根據cookie類型保留不同期限',
          '聯絡資訊：直到您要求刪除或帳戶關閉',
          '法律要求的資料：按照適用法律要求保留'
        ]
      },
      cookies: {
        title: 'Cookie 政策',
        content: '我們使用以下類型的Cookie：',
        items: [
          '必要Cookie：確保網站正常運行的基本功能',
          '分析Cookie：幫助我們了解網站使用情況',
          '功能Cookie：記住您的偏好和設定',
          '行銷Cookie：用於個人化廣告和內容推薦',
          '您可以通過瀏覽器設定管理Cookie偏好',
          '停用某些Cookie可能影響網站功能'
        ]
      },
      contact: {
        title: '聯絡我們',
        content: '如果您對我們的隱私政策有任何疑問或需要行使您的權利，請聯絡我們：',
        email: 'privacy@inspopmars.com',
        address: '資料保護官\nInstagramDown\n[公司地址]',
        response: '我們將在30天內回覆您的請求'
      }
    }
  },

  // 下載子頁面翻譯
  downloadPages: {
    stories: {
      title: 'Instagram Stories 下載器',
      description: '專業的 Instagram Stories 下載工具',
      heading: 'Instagram Stories 下載器',
      subheading: '匿名下載 Instagram Stories 圖片和影片',
      inputPlaceholder: '輸入 Instagram 用戶名或 Stories 連結...',
      features: {
        0: '匿名下載',
        1: '無觀看記錄',
        2: '24小時內容'
      },
      howToUse: '如何下載 Instagram Stories',
      steps: {
        step1: '輸入用戶名或複製 Stories 連結',
        step2: '點擊下載按鈕開始處理',
        step3: '選擇要下載的 Stories 內容',
        step4: '等待處理完成並儲存到裝置'
      }
    },
    post: {
      title: 'Instagram 貼文下載器',
      description: 'Instagram 圖片和影片貼文下載工具',
      heading: 'Instagram 圖片/影片下載',
      subheading: '高品質下載 Instagram 貼文內容，支援單張圖片、輪播和影片',
      inputPlaceholder: '貼上 Instagram 貼文連結...',
      features: {
        0: '高清品質',
        1: '無浮水印',
        2: '批量下載',
        3: '輪播支援'
      },
      howToUse: '如何下載 Instagram 貼文'
    },
    reels: {
      title: 'Instagram Reels 下載器',
      description: 'Instagram Reels 短影片下載工具',
      heading: 'Instagram Reels 下載',
      subheading: '保持原始品質下載 Instagram Reels 短影片',
      inputPlaceholder: '貼上 Instagram Reels 連結...',
      features: {
        0: '短影片',
        1: '原始品質',
        2: '快速下載',
        3: 'MP4格式'
      },
      howToUse: '如何下載 Instagram Reels'
    },
    igtv: {
      title: 'IGTV 影片下載器',
      description: 'IGTV 長影片內容下載工具',
      heading: 'IGTV 影片下載',
      subheading: '支援高清格式的 IGTV 長影片內容下載',
      inputPlaceholder: '貼上 IGTV 影片連結...',
      features: {
        0: '長影片',
        1: '高清格式',
        2: '穩定下載',
        3: '大檔案支援'
      },
      howToUse: '如何下載 IGTV 影片'
    },
    highlights: {
      title: 'Highlights 下載器',
      description: 'Instagram Highlights 精選內容下載工具',
      heading: 'Highlights 下載',
      subheading: '下載用戶精選 Highlights 內容供永久保存',
      inputPlaceholder: '輸入 Instagram 用戶名...',
      features: {
        0: '精選內容',
        1: '永久保存',
        2: '批量處理',
        3: '分類下載'
      },
      howToUse: '如何下載 Instagram Highlights'
    },
    profile: {
      title: '用戶個人檔案下載器',
      description: 'Instagram 用戶頭像和個人檔案下載工具',
      heading: '用戶頭像下載',
      subheading: '下載用戶頭像、個人檔案圖片和其他內容',
      inputPlaceholder: '輸入 Instagram 用戶名...',
      features: {
        0: '頭像下載',
        1: '個人檔案圖片',
        2: '簡單快速',
        3: '高清品質'
      },
      howToUse: '如何下載用戶個人檔案'
    },
    private: {
      title: '私人內容下載器',
      description: 'Instagram 私人內容下載工具',
      heading: '私人內容下載',
      subheading: '下載私人帳戶內容（需要授權）',
      inputPlaceholder: '私人內容下載需要登入授權...',
      features: {
        0: '私人內容',
        1: '授權存取',
        2: '安全下載',
        3: '用戶隱私'
      },
      howToUse: '如何下載私人內容'
    }
  },

  // 訂閱頁面
  subscription: {
    // 頁面標題和描述
    pageTitle: '訂閱管理',
    pageDescription: '管理您的訂閱計劃和付款資訊',
    // 當前訂閱部分
    currentSubscription: '當前訂閱',
    noSubscription: '無有效訂閱',
    selectPlan: '選擇適合您開始使用的訂閱計劃',
    plans: '訂閱計劃',
    currentPlan: '當前計劃',
    validUntil: '有效期至',
    usageThisPeriod: '本期使用量',
    unlimited: '無限',
    times: '次',
    paymentMethod: '付款方式',
    stripePayment: 'Stripe 付款',
    alipayPayment: 'Alipay 付款',
    verifyingPayment: '正在驗證付款狀態...',
    paymentSuccess: '付款成功！',
    paymentCanceled: '付款已取消',
    paymentCanceledMessage: '您的付款已被取消，未產生任何費用。如有問題，請隨時聯絡我們。',
    thankYouSubscription: '感謝您的訂閱！您的帳戶已成功升級，現在可以享受完整的服務。',
    viewSubscriptionDetails: '查看訂閱詳情',
    startUsing: '開始使用',
    retrySelectPlan: '重新選擇計劃',
    returnHome: '返回首頁',
    status: {
      active: '有效',
      canceled: '已取消',
      expired: '已過期',
      pending: '待處理'
    },
    errors: {
      fetchFailed: '獲取訂閱資訊失敗',
      plansFetchFailed: '獲取計劃資訊失敗',
      checkoutFailed: '建立付款會話失敗',
      unknownError: '未知錯誤',
      retryLater: '建立付款會話失敗，請稍後重試'
    },
    duration: {
      monthly: '個月',
      yearly: '年'
    },
    // 計劃內容
    title: '訂閱計劃',
    description: '選擇適合您的訂閱計劃',
    heading: '選擇您的訂閱計劃',
    subheading: '解鎖更多進階功能，享受更好的下載體驗',
    planDetails: {
      free: {
        title: '免費計劃',
        price: '$0',
        period: '/月',
        features: [
          '每日限制下載 10 次',
          '基礎下載功能',
          '標準品質',
          '社群支援'
        ],
        button: '當前計劃'
      },
      premium: {
        title: '高級計劃',
        price: '$4.99',
        period: '/月',
        features: [
          '無限制下載',
          '高清品質保證',
          '批量下載功能',
          '優先客服支援',
          '無廣告體驗'
        ],
        button: '升級到高級版',
        popular: '推薦'
      },
      pro: {
        title: '專業計劃',
        price: '$14.99',
        period: '/月',
        features: [
          '高級版所有功能',
          '私人內容存取',
          'API 介面存取',
          '專屬客服支援',
          '高級分析功能'
        ],
        button: '升級到專業版'
      }
    },
    features: {
      title: '為什麼選擇付費計劃？',
      items: [
        '更高的下載限制',
        '更好的品質保證',
        '優先技術支援',
        '持續的功能更新'
      ]
    }
  },

  // 批量下載頁面
  batchDownload: {
    // 頁面基本資訊
    pageTitle: '批量下載',
    pageDescription: '高效處理多個 Instagram 連結進行批量下載',
    placeholder: '添加多個 Instagram 連結進行批量下載...',
    optimizedFor: '批量下載',
    featureLabels: {
        0: '批量處理',
        1: '任務佇列',
        2: '進度追蹤'
      },
    title: '批量下載',
    description: '一次下載多個 Instagram 內容',
    heading: '批量下載工具',
    subheading: '一次處理多個 Instagram 連結，提高效率',
    inputPlaceholder: '每行輸入一個 Instagram 連結...',
    addLink: '添加連結',
    removeLink: '移除',
    startBatch: '開始批量下載',
    progress: '進度',
    completed: '已完成',
    failed: '失敗',
    pending: '待處理',
    howToUse: '如何使用批量下載',
    steps: {
      step1: '貼上多個 Instagram 連結（每行一個）',
      step2: '點擊開始批量下載',
      step3: '監控下載進度和狀態',
      step4: '下載完成後獲取打包檔案'
    },
    limits: {
      free: '免費用戶：每批最多 5 個連結',
      premium: '高級用戶：每批最多 50 個連結',
      pro: '專業用戶：無限制'
    }
  },

} as const;