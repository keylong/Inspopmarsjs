export default {
  // Site information
  site: {
    title: 'Instagram ダウンローダー',
  },

  // Common UI elements
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    cancel: 'キャンセル',
    confirm: '確認',
    save: '保存',
    delete: '削除',
    edit: '編集',
    back: '戻る',
    next: '次へ',
    previous: '前へ',
    close: '閉じる',
    search: '検索',
    filter: 'フィルター',
    sort: '並び替え',
    download: 'ダウンロード',
    upload: 'アップロード',
    share: '共有',
    copy: 'コピー',
    copied: 'コピー完了',
    language: '言語',
  },

  // Navigation
  nav: {
    home: 'ホーム',
    download: 'ダウンロード',
    profile: 'プロフィール',
    settings: '設定',
    about: 'について',
    help: 'ヘルプ',
    contact: 'お問い合わせ',
    login: 'ログイン',
    register: '登録',
    logout: 'ログアウト',
    dashboard: 'ダッシュボード',
  },

  // Auth pages
  auth: {
    signin: {
      title: 'ログイン',
      subtitle: 'おかえりなさい！ログイン情報を入力してください',
      email: 'メールアドレス',
      password: 'パスワード',
      remember: 'ログイン状態を保持',
      forgot: 'パスワードを忘れましたか？',
      submit: 'ログイン',
      noAccount: 'アカウントをお持ちでないですか？',
      createAccount: 'アカウント作成',
      emailPlaceholder: 'メールアドレスを入力',
      passwordPlaceholder: 'パスワードを入力',
    },
    signup: {
      title: '新規登録',
      subtitle: '新しいアカウントを作成',
      name: '氏名',
      email: 'メールアドレス',
      password: 'パスワード',
      confirmPassword: 'パスワード確認',
      terms: '同意します',
      termsLink: '利用規約',
      privacy: 'プライバシーポリシー',
      submit: 'アカウント作成',
      hasAccount: 'すでにアカウントをお持ちですか？',
      signIn: 'ログイン',
      namePlaceholder: '氏名を入力',
      emailPlaceholder: 'メールアドレスを入力',
      passwordPlaceholder: 'パスワードを入力',
      confirmPasswordPlaceholder: 'パスワードを再入力',
    },
    errors: {
      invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
      loginFailed: 'ログインに失敗しました。もう一度試してください',
      registrationFailed: '登録に失敗しました',
      passwordMismatch: 'パスワードが一致しません',
      passwordTooShort: 'パスワードは最低6文字必要です',
      registrationSuccess: '登録が完了しました！自動ログイン中...',
      autoLoginFailed: '登録は完了しましたが、自動ログインに失敗しました。手動でログインしてください',
      loggingIn: 'ログイン中...',
      registering: 'アカウント作成中...',
      loginWithAccount: 'アカウントにサインイン',
      passwordHint: '(最低6文字)',
      or: 'または'
    }
  },

  // Download page
  download: {
    title: 'Instagram ダウンロードソフト',
    subtitle: 'Instagram の写真、動画、ストーリー、IGTV を素早くダウンロード',
    urlLabel: 'Instagram URL',
    urlPlaceholder: 'Instagram のリンクを貼り付け...',
    downloadButton: '今すぐダウンロード',
    supportedTypes: '対応タイプ',
    photos: '写真',
    videos: '動画',
    stories: 'ストーリー',
    igtv: 'IGTV',
    reels: 'リール',
    highlights: 'ハイライト',
    howTo: '使用方法',
    step1: 'Instagram のコンテンツリンクをコピー',
    step2: '上の入力ボックスに貼り付け',
    step3: 'ダウンロードボタンをクリック',
    step4: '処理完了を待ってダウンロード',
    features: {
      title: '機能',
      highQuality: '高品質',
      highQualityDesc: 'オリジナルの高画質写真・動画をダウンロード',
      noWatermark: '透かしなし',
      noWatermarkDesc: 'ダウンロードしたコンテンツに透かしは含まれません',
      fastSpeed: '高速ダウンロード',
      fastSpeedDesc: '最適化されたダウンロードエンジンで高速ダウンロードを実現',
      allFormats: '全フォーマット対応',
      allFormatsDesc: 'すべての Instagram コンテンツフォーマットに対応',
    },
    // ダウンロード結果ページ
    result: {
      completed: 'ダウンロード完了',
      downloadFailed: 'ダウンロード失敗',
      retryDownload: 'ダウンロード再試行',
      errorCode: 'エラーコード',
      mediaDownload: 'メディアダウンロード',
      selectResolution: '解像度選択',
      preview: 'プレビュー',
      copyFailed: 'コピー失敗',
      downloadAll: 'すべてダウンロード',
      downloadOptions: 'のダウンロードオプション、総サイズ約',
      mediaFiles: 'のメディアファイル',
      totalSize: '総サイズ',
      carousel: 'カルーセル',
      multiMedia: 'マルチメディア',
      original: 'オリジナル',
      video: '動画',
      image: '画像',
      videoContent: '動画コンテンツ',
      imageContent: '画像コンテンツ',
      resolutions: '解像度',
      post: '投稿',
      story: 'ストーリー',
      reel: 'リール',
      igtv: 'IGTV',
      highlight: 'ハイライト',
      content: 'コンテンツ',
      trustedUsers: 'ユーザーが信頼',
      totalDownloads: 'ダウンロード回数',
      rating: '評価',
      extremeSpeed: '超高速',
      pureNoWatermark: '完全透かしなし',
      fullFormatSupport: '全フォーマット対応',
      supportedContent: 'すべての Instagram コンテンツのダウンロードをサポート',
      photoPosts: '写真投稿',
      videoContent2: '動画コンテンツ',
      stories: 'ストーリー',
      reels: 'リール',
    },
    // ダウンロードフォーム
    form: {
      urlLabel: 'Instagram URL',
      urlPlaceholder: 'Instagram のリンクを貼り付け...',
      urlRequired: 'Instagram のリンクを入力してください',
      urlInvalid: '有効な URL を入力してください',
      urlInvalidInstagram: '有効な Instagram リンクを入力してください',
      urlValidationFailed: 'URL 検証に失敗',
      downloadFailed: 'ダウンロードに失敗',
      downloading: 'ダウンロード中...',
      startDownload: 'ダウンロード開始',
      detected: '検出',
      advancedOptions: '高度なオプション',
      contentType: 'コンテンツタイプ',
      quality: '品質',
      downloadFormat: 'ダウンロード形式',
      supportedTypes: 'サポートされるコンテンツタイプ:',
      autoDetect: '自動検出',
      originalQuality: 'オリジナル品質',
      hdQuality: '高画質',
      sdQuality: '標準画質',
      individualFiles: '個別ファイル',
      zipArchive: 'ZIP アーカイブ',
      posts: '📷 投稿',
      videos: '📹 動画',
      stories2: '⭐ ストーリー',
      highlights2: '✨ ハイライト',
      unknownType: '不明なタイプ',
      profileType: 'プロフィール',
      optimizedTool: '最適化ツール',
      contentDownloader: 'Instagram コンテンツダウンローダー',
    },
  },

  // Profile page
  profile: {
    title: 'プロフィール',
    editProfile: 'プロフィール編集',
    name: '名前',
    email: 'メール',
    avatar: 'アバター',
    downloadHistory: 'ダウンロード履歴',
    settings: 'アカウント設定',
    deleteAccount: 'アカウント削除',
    confirmDelete: 'アカウント削除の確認',
    deleteWarning: 'この操作は元に戻せません。すべてのデータが永久に削除されます。',
    // プロフィールページの追加項目
    pageTitle: 'プロフィール',
    pageDescription: 'アカウント情報と設定を管理',
    basicInfo: {
      title: '基本情報',
      description: 'アカウントの基本情報を更新',
      nameLabel: '名前',
      namePlaceholder: '名前を入力',
      emailLabel: 'メール',
      emailNote: 'メールアドレスは変更できません',
      saveButton: '保存',
      savingButton: '保存中...',
      cancelButton: 'キャンセル',
      editButton: 'プロフィール編集',
      updateSuccess: 'プロフィールの更新が完了しました',
      updateError: '更新に失敗しました。もう一度試してください'
    },
    accountInfo: {
      title: 'アカウント情報',
      description: 'アカウントの詳細を確認',
      email: 'メール',
      userId: 'ユーザー ID',
      registrationDate: '登録日'
    },
    dangerZone: {
      title: '危険な操作',
      description: 'これらの操作は元に戻すことができません。注意してご利用ください',
      deleteAccount: {
        title: 'アカウント削除',
        warning: 'アカウントを削除すると、すべてのデータが永久に削除されます。この操作は元に戻すことができません。',
        button: 'アカウント削除'
      }
    }
  },

  // SEO and meta
  seo: {
    siteName: 'InstagramDown - Instagram ダウンロードソフト',
    defaultTitle: 'Instagram ダウンロードソフト - 無料で Instagram の写真・動画をダウンロード',
    defaultDescription: '無料の Instagram ダウンロードソフト。Instagram の写真、動画、ストーリー、IGTV、リールを高品質で透かしなしでダウンロード。シンプルで使いやすい。',
    keywords: 'Instagram ダウンロードソフト, Instagram 写真ダウンロード, Instagram 動画ダウンロード, ストーリーダウンロード, IGTV ダウンロード, リールダウンロード',
  },

  // Error messages
  errors: {
    invalidUrl: '有効な Instagram URL を入力してください',
    networkError: 'ネットワーク接続に失敗しました。再試行してください',
    serverError: 'サーバーエラーが発生しました。しばらく後に再試行してください',
    notFound: 'コンテンツが見つかりません',
    rateLimited: 'リクエストが多すぎます。しばらく後に再試行してください',
    unauthorized: 'この操作を実行するにはログインが必要です',
    forbidden: 'この操作を実行する権限がありません',
    generic: '不明なエラーが発生しました。再試行してください',
  },

  // Success messages
  success: {
    downloadStarted: 'ダウンロードを開始しました',
    profileUpdated: 'プロフィールが更新されました',
    settingsSaved: '設定が保存されました',
    accountCreated: 'アカウントが作成されました',
    loginSuccess: 'ログインに成功しました',
  },

  // Terms of Service page
  terms: {
    title: '利用規約',
    subtitle: '以下の利用規約をよくお読みください。本サービスをご利用いただくことで、これらの条項に同意したものとみなされます。',
    lastUpdated: '最終更新日',
    version: 'バージョン',
    tableOfContents: '目次',
    sections: {
      serviceDescription: {
        title: '1. サービス説明',
        content: [
          'InstagramDown（以下「当社」「当サービス」といいます）は、Instagramから公開されているコンテンツ（写真、動画、ストーリー、リール、IGTVコンテンツを含む）をダウンロードすることができるWebベースのツールです。',
          '本サービスは個人的で非商業的な用途のみを目的としています。ユーザーは、ダウンロードしたコンテンツを違法または権利侵害の目的で使用しないことに同意します。',
          '当社は、事前の通知なしに、いつでもサービスを変更、停止、または終了する権利を留保します。'
        ]
      },
      userResponsibilities: {
        title: '2. ユーザーの責任',
        content: [
          'ユーザーは、著作権法、プライバシー法、データ保護法を含むがこれに限定されない、適用されるすべての法律および規制を遵守する必要があります。',
          'ユーザーは、著作権を所有している、または適切な許可を得たコンテンツのみをダウンロードできます。',
          'ユーザーは、以下の目的で本サービスを使用することを禁止されています：',
          '• 他者の著作権、商標権、その他の知的財産権の侵害',
          '• 他者への嫌がらせ、脅迫、プライバシーの侵害',
          '• マルウェア、ウイルス、その他の有害なコードの配布',
          '• いかなる形態の商業活動やマーケティング促進',
          '• Instagramの利用規約およびコミュニティガイドラインの違反',
          'ユーザーは、本サービスの使用について完全に責任を負います。'
        ]
      },
      intellectualProperty: {
        title: '3. 知的財産権',
        content: [
          '本サービスのすべてのコンテンツ、機能、技術は、著作権、商標権、その他の知的財産法により保護されています。',
          '本サービスを通じてダウンロードされたコンテンツの著作権は、元のコンテンツ作成者に帰属します。',
          'ユーザーは、当社の明示的な書面による許可なしに、本サービスのいかなる部分もコピー、変更、配布、商業化することはできません。',
          'InstagramはMeta Platforms, Inc.の商標です。当社はInstagramまたはMetaとは一切関係ありません。'
        ]
      },
      disclaimer: {
        title: '4. 免責事項',
        content: [
          '本サービスは「現状有姿」で提供され、明示または黙示の保証は一切ありません。',
          '当社は、サービスの継続性、正確性、完全性、適時性を保証しません。',
          '当社は以下について一切責任を負いません：',
          '• 本サービスの使用により生じた直接的または間接的な損失',
          '• サービスの中断、データの損失、システムの故障',
          '• 第三者コンテンツの正確性または合法性',
          '• ユーザーが法律や規制に違反することにより生じる結果',
          'ユーザーは自己責任で本サービスを使用します。'
        ]
      },
      serviceChanges: {
        title: '5. サービス変更',
        content: [
          '当社は、いつでもサービスを変更、更新、または終了する権利を留保します。',
          '重要な変更は、ウェブサイトでの発表またはその他の適切な手段によりユーザーに通知されます。',
          'サービスの継続使用は、そのような変更の受諾を示します。',
          'ユーザーが変更に同意しない場合は、直ちにサービスの使用を停止する必要があります。'
        ]
      },
      accountTermination: {
        title: '6. アカウント終了',
        content: [
          '当社は、以下の状況においてユーザーのアクセスを終了する権利を有します：',
          '• 本利用規約の違反',
          '• 違法または有害な活動への従事',
          '• サービスリソースの乱用または過度の使用',
          '• 当社が不適切と判断するその他の行為',
          'アカウント終了後、ユーザーは直ちにサービスの使用を停止する必要があります。',
          '当社は、アカウント終了により生じた損失について責任を負いません。'
        ]
      },
      disputeResolution: {
        title: '7. 紛争解決',
        content: [
          '本規約から生じるいかなる紛争も、まず友好的な交渉により解決されるべきです。',
          '交渉が失敗した場合、紛争はサービス提供者の所在地の管轄権を有する裁判所に提出されるべきです。',
          '本規約の解釈と執行は、日本の法律に準拠します。',
          '本規約のいずれかの条項が無効とみなされた場合でも、他の条項の有効性には影響しません。'
        ]
      },
      contact: {
        title: '8. お問い合わせ',
        content: [
          '本利用規約についてご質問がある場合は、以下の方法でお問い合わせください：',
          '• メール：support@instagramdown.com',
          '• オンラインサポート：詳細なヘルプについては当社ウェブサイトをご覧ください',
          'お問い合わせを受け取り次第、可能な限り迅速に対応いたします。'
        ]
      }
    },
    effectiveDate: '施行日：2024年1月1日',
    acknowledgment: '本サービスを使用することで、本利用規約を読み、理解し、これに拘束されることに同意したものとみなされます。'
  },

  // Download Center page
  downloadCenter: {
    title: 'Instagram ダウンロードセンター',
    subtitle: 'お好みのダウンロードタイプを選択し、プロフェッショナルな Instagram コンテンツダウンロードサービスをお楽しみください',
    breadcrumb: {
      home: 'ホーム',
      center: 'ダウンロードセンター'
    },
    badges: {
      freeUse: '無料利用',
      hdNoWatermark: 'HD 透かしなし'
    },
    options: {
      post: {
        title: 'Instagram 投稿',
        description: 'HD 品質で透かしなしの Instagram 写真・動画投稿をダウンロード',
        features: ['HD 品質', '透かしなし', '一括ダウンロード']
      },
      stories: {
        title: 'Instagram ストーリー',
        description: '匿名でストーリーをダウンロード、閲覧記録なし、24時間コンテンツ',
        features: ['匿名ダウンロード', '閲覧記録なし', 'リアルタイム取得']
      },
      reels: {
        title: 'Instagram リール',
        description: 'オリジナル品質を保持したまま Instagram リール短動画をダウンロード',
        features: ['短動画', 'オリジナル品質', '高速ダウンロード']
      },
      igtv: {
        title: 'IGTV 動画',
        description: 'HD 形式で IGTV 長動画コンテンツをダウンロード',
        features: ['長動画', 'HD 形式', '安定ダウンロード']
      },
      highlights: {
        title: 'ハイライト',
        description: 'ユーザーハイライトコンテンツを永続保存用にダウンロード',
        features: ['厳選コンテンツ', '永続保存', '一括処理']
      },
      profile: {
        title: 'ユーザープロフィール',
        description: 'ユーザーアバター、プロフィール写真その他コンテンツをダウンロード',
        features: ['アバターダウンロード', 'プロフィール写真', 'シンプル & 高速']
      }
    },
    howToUse: {
      title: 'Instagram ダウンローダーの使用方法',
      steps: {
        step1: {
          title: 'ダウンロードタイプ選択',
          description: 'ニーズに応じて投稿、ストーリー、リールなど異なるダウンロードタイプを選択'
        },
        step2: {
          title: 'リンク貼り付け',
          description: 'Instagram コンテンツリンクをコピーして対応するダウンロードページに貼り付け'
        },
        step3: {
          title: 'ダウンロード開始',
          description: 'ダウンロードボタンをクリック、処理完了を待ってデバイスにファイル保存'
        }
      }
    },
    button: {
      useNow: '今すぐ使用'
    }
  },

  // About page
  about: {
    title: 'Instagram ダウンローダーについて',
    features: {
      title: '機能',
      items: [
        'Instagram 写真・動画ダウンロード対応',
        '高品質メディアファイルダウンロード',
        '一括ダウンロード対応',
        'シンプルで使いやすいインターフェース',
        'Instagram アカウントログイン不要',
        '高速で安全なダウンロードプロセス'
      ]
    },
    contentTypes: {
      title: '対応コンテンツタイプ',
      items: [
        '単一画像投稿',
        '動画投稿',
        '写真・動画カルーセル',
        'Instagram ストーリー',
        'ハイライト',
        'プロフィール写真'
      ]
    },
    instructions: {
      title: '使用方法',
      steps: {
        step1: {
          title: 'リンクコピー',
          description: 'Instagram でダウンロードしたいコンテンツを見つけ、共有ボタンをクリックしてリンクをコピー'
        },
        step2: {
          title: 'リンク貼り付け',
          description: 'コピーしたリンクをダウンロードページの入力ボックスに貼り付け'
        },
        step3: {
          title: 'ダウンロード開始',
          description: 'ダウンロードボタンをクリックして処理完了を待つ'
        },
        step4: {
          title: 'ファイル保存',
          description: '処理完了後、ファイルが自動的にデバイスにダウンロード開始'
        }
      }
    }
  },

  // Footer
  footer: {
    company: 'Instagram ダウンローダー',
    copyright: '著作権',
    allRightsReserved: '全権利保留',
    links: {
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      help: 'ヘルプセンター',
      contact: 'お問い合わせ',
      about: '私たちについて',
    },
    social: {
      title: 'フォローする',
      twitter: 'Twitter',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
    },
    sections: {
      product: '製品',
      support: 'サポート',
      company: '会社',
      legal: '法的',
    },
    description: '最高の Instagram コンテンツダウンロードツール。写真、動画、ストーリー、IGTV、リールのダウンロードに対応。',
  },

  // Privacy Policy
  privacy: {
    title: 'プライバシーポリシー',
    subtitle: '個人情報の収集、使用、保護方法について',
    lastUpdated: '最終更新',
    tableOfContents: '目次',
    sections: {
      overview: {
        title: '概要',
        content: 'このプライバシーポリシーは、InstagramDown（「当社」、「私たち」）がInstagramコンテンツダウンロードサービスをご利用いただく際に、お客様の個人情報をどのように収集、使用、保護するかを説明します。当社はお客様のプライバシー権を保護し、GDPR（一般データ保護規則）やCCPA（カリフォルニア州消費者プライバシー法）などの関連するデータ保護法規への準拠を確保することをお約束します。'
      },
      dataCollection: {
        title: 'データ収集',
        content: '以下の種類の情報を収集します：',
        items: [
          'お客様が提供するInstagramリンクとURL',
          'ブラウザの種類、バージョン、オペレーティングシステム情報',
          'IPアドレスと地理的位置（分析目的のみ）',
          'Cookieや類似技術により収集される使用データ',
          'デバイス識別子とネットワーク情報',
          '使用統計とパフォーマンスデータ'
        ]
      },
      dataUsage: {
        title: 'データ使用',
        content: '収集した情報を以下の目的で使用します：',
        items: [
          'Instagramコンテンツダウンロードサービスの提供と改善',
          'ダウンロードリクエストの処理と実行',
          'サービス使用状況の分析とユーザーエクスペリエンスの最適化',
          '不正行為の防止とサービスセキュリティの確保',
          '法的義務の遵守と法的手続きへの対応',
          '重要なサービス通知とアップデートの送信'
        ]
      },
      dataSecurity: {
        title: 'データセキュリティ',
        content: 'お客様のデータを保護するために以下の対策を実施しています：',
        items: [
          'すべての機密データ送信のSSL/TLS暗号化',
          'アクセス制御と認証メカニズム',
          '定期的なセキュリティ監査と脆弱性評価',
          'データ最小化原則 - 必要な情報のみの収集',
          '安全なデータストレージとバックアップ手順',
          'スタッフのデータ保護研修とアクセス制限'
        ]
      },
      thirdPartyServices: {
        title: '第三者サービス',
        content: 'お客様の情報を収集する可能性がある以下の第三者サービスを使用しています：',
        items: [
          'Google Analytics - ウェブサイト使用分析',
          'Cloudflare - CDNとセキュリティサービス',
          'Instagram API - コンテンツ取得（Instagramサービス規約に準拠）',
          'Stripe - 決済処理（該当する場合）',
          'クラウドストレージプロバイダー - 一時ファイル保存'
        ]
      },
      userRights: {
        title: 'お客様の権利',
        content: 'GDPRおよびその他のデータ保護法に基づき、お客様には以下の権利があります：',
        items: [
          'アクセス権：当社が保有するお客様の個人データのコピーを取得',
          '修正権：不正確または不完全な個人データの修正を要求',
          '削除権：特定の状況でお客様の個人データの削除を要求',
          '処理制限権：当社によるお客様の個人データの処理を制限',
          'データポータビリティ権：構造化された一般的な形式でデータを受け取る',
          '異議申し立て権：正当な利益に基づく処理に異議を申し立てる'
        ]
      },
      dataRetention: {
        title: 'データ保持',
        content: '当社のデータ保持ポリシーは以下の通りです：',
        items: [
          'ダウンロード履歴：30日後に自動削除',
          'IPアドレスとログ：セキュリティ分析のために90日間保持',
          '分析データ：匿名化処理後に2年間保持',
          'Cookieデータ：Cookieタイプに基づいて異なる期間保持',
          '連絡先情報：削除要求またはアカウント閉鎖まで',
          '法的に必要なデータ：適用法に従って保持'
        ]
      },
      cookies: {
        title: 'Cookieポリシー',
        content: '以下の種類のCookieを使用しています：',
        items: [
          '必須Cookie：ウェブサイトの適切な動作を確保する基本機能',
          '分析Cookie：ウェブサイトの使用パターンの理解を支援',
          '機能Cookie：お客様の設定と preferences を記憶',
          'マーケティングCookie：パーソナライズされた広告とコンテンツ推奨に使用',
          'ブラウザ設定でCookieの設定を管理できます',
          '特定のCookieを無効にするとウェブサイトの機能に影響する場合があります'
        ]
      },
      contact: {
        title: 'お問い合わせ',
        content: 'プライバシーポリシーについてご質問がある場合や権利を行使する必要がある場合は、お気軽にお問い合わせください：',
        email: 'privacy@inspopmars.com',
        address: 'データ保護責任者\nInstagramDown\n[会社住所]',
        response: 'お客様のリクエストには30日以内に回答いたします'
      }
    }
  },

  // ダウンロードサブページ翻訳
  downloadPages: {
    stories: {
      title: 'Instagram ストーリーダウンローダー',
      description: 'プロフェッショナルな Instagram ストーリーダウンロードツール',
      heading: 'Instagram ストーリーダウンローダー',
      subheading: 'Instagram ストーリーの写真と動画を匿名でダウンロード',
      inputPlaceholder: 'Instagram ユーザー名またはストーリーリンクを入力...',
      features: ['匿名ダウンロード', '閲覧記録なし', '24時間コンテンツ'],
      howToUse: 'Instagram ストーリーのダウンロード方法',
      steps: {
        step1: 'ユーザー名を入力またはストーリーリンクをコピー',
        step2: 'ダウンロードボタンをクリックして処理開始',
        step3: 'ダウンロードするストーリーコンテンツを選択',
        step4: '処理完了を待ってデバイスに保存'
      }
    },
    post: {
      title: 'Instagram 投稿ダウンローダー',
      description: 'Instagram 写真・動画投稿ダウンロードツール',
      heading: 'Instagram 写真・動画ダウンロード',
      subheading: 'Instagram 投稿コンテンツを高品質でダウンロード、単一画像、カルーセル、動画対応',
      inputPlaceholder: 'Instagram 投稿リンクを貼り付け...',
      features: ['HD 品質', '透かしなし', '一括ダウンロード', 'カルーセル対応'],
      howToUse: 'Instagram 投稿のダウンロード方法'
    },
    reels: {
      title: 'Instagram リールダウンローダー',
      description: 'Instagram リール短動画ダウンロードツール',
      heading: 'Instagram リールダウンロード',
      subheading: 'オリジナル品質を保持して Instagram リール短動画をダウンロード',
      inputPlaceholder: 'Instagram リールリンクを貼り付け...',
      features: ['短動画', 'オリジナル品質', '高速ダウンロード', 'MP4 形式'],
      howToUse: 'Instagram リールのダウンロード方法'
    },
    igtv: {
      title: 'IGTV 動画ダウンローダー',
      description: 'IGTV 長動画コンテンツダウンロードツール',
      heading: 'IGTV 動画ダウンロード',
      subheading: 'HD 形式対応で IGTV 長動画コンテンツをダウンロード',
      inputPlaceholder: 'IGTV 動画リンクを貼り付け...',
      features: ['長動画', 'HD 形式', '安定ダウンロード', '大容量ファイル対応'],
      howToUse: 'IGTV 動画のダウンロード方法'
    },
    highlights: {
      title: 'ハイライトダウンローダー',
      description: 'Instagram ハイライト厳選コンテンツダウンロードツール',
      heading: 'ハイライトダウンロード',
      subheading: 'ユーザー厳選ハイライトコンテンツを永続保存用にダウンロード',
      inputPlaceholder: 'Instagram ユーザー名を入力...',
      features: ['厳選コンテンツ', '永続保存', '一括処理', 'カテゴリ別ダウンロード'],
      howToUse: 'Instagram ハイライトのダウンロード方法'
    },
    profile: {
      title: 'ユーザープロフィールダウンローダー',
      description: 'Instagram ユーザーアバター・プロフィールダウンロードツール',
      heading: 'ユーザーアバターダウンロード',
      subheading: 'ユーザーアバター、プロフィール写真その他コンテンツをダウンロード',
      inputPlaceholder: 'Instagram ユーザー名を入力...',
      features: ['アバターダウンロード', 'プロフィール写真', 'シンプル & 高速', 'HD 品質'],
      howToUse: 'ユーザープロフィールのダウンロード方法'
    },
    private: {
      title: '非公開コンテンツダウンローダー',
      description: 'Instagram 非公開コンテンツダウンロードツール',
      heading: '非公開コンテンツダウンロード',
      subheading: '非公開アカウントコンテンツのダウンロード（認証が必要）',
      inputPlaceholder: '非公開コンテンツダウンロードにはログイン認証が必要...',
      features: ['非公開コンテンツ', '認証アクセス', 'セキュアダウンロード', 'ユーザープライバシー'],
      howToUse: '非公開コンテンツのダウンロード方法'
    }
  },

  // サブスクリプションページ
  subscription: {
    // ページタイトルと説明
    pageTitle: 'サブスクリプション管理',
    pageDescription: 'サブスクリプションプランと請求情報を管理',
    // 現在のサブスクリプションセクション
    currentSubscription: '現在のサブスクリプション',
    noSubscription: 'アクティブなサブスクリプションなし',
    selectPlan: '開始に適したサブスクリプションプランを選択してください',
    plans: 'サブスクリプションプラン',
    currentPlan: '現在のプラン',
    validUntil: '有効期限',
    usageThisPeriod: 'この期間の使用量',
    unlimited: '無制限',
    times: '回',
    paymentMethod: '支払方法',
    stripePayment: 'Stripe 支払い',
    alipayPayment: 'Alipay 支払い',
    verifyingPayment: '支払状況確認中...',
    paymentSuccess: '支払い成功！',
    paymentCanceled: '支払いキャンセル',
    thankYouSubscription: 'サブスクリプションありがとうございます！アカウントが正常にアップグレードされ、フルサービスをご利用いただけます。',
    paymentCanceledMessage: '支払いがキャンセルされ、料金は発生しませんでした。ご質問がございましたら、お気軽にお問い合わせください。',
    viewSubscriptionDetails: 'サブスクリプション詳細表示',
    startUsing: '使用開始',
    retrySelectPlan: 'プラン再選択',
    returnHome: 'ホームに戻る',
    status: {
      active: 'アクティブ',
      canceled: 'キャンセル済み',
      expired: '期限切れ',
      pending: '保留中'
    },
    errors: {
      fetchFailed: 'サブスクリプション情報の取得に失敗',
      plansFetchFailed: 'プラン情報の取得に失敗',
      checkoutFailed: '支払いセッションの作成に失敗',
      unknownError: '未知のエラー',
      retryLater: '支払いセッションの作成に失敗、後でもう一度試してください'
    },
    duration: {
      monthly: 'ヶ月',
      yearly: '年'
    },
    // 元のプラン内容
    title: 'サブスクリプションプラン',
    description: '適切なサブスクリプションプランを選択',
    heading: 'サブスクリプションプランを選択',
    subheading: 'より多くの高度な機能をアンロックし、より良いダウンロード体験をお楽しみください',
    features: {
      title: '有料プランを選択する理由',
      items: [
        'より高いダウンロード制限',
        'より良い品質保証',
        '優先技術サポート',
        '継続的な機能アップデート'
      ]
    }
  },

  // 一括ダウンロードページ
  batchDownload: {
    // ページ基本情報
    pageTitle: '一括ダウンロード',
    pageDescription: '複数の Instagram リンクを効率的に処理して一括ダウンロード',
    placeholder: '一括ダウンロード用に複数の Instagram リンクを追加...',
    optimizedFor: '一括ダウンロード',
    features: ['一括処理', 'タスクキュー', '進行状況追跡'],
    title: '一括ダウンロード',
    description: '複数の Instagram コンテンツを一度にダウンロード',
    heading: '一括ダウンロードツール',
    subheading: '複数の Instagram リンクを一度に処理して効率を向上',
    inputPlaceholder: '1行に1つの Instagram リンクを入力...',
    addLink: 'リンク追加',
    removeLink: '削除',
    startBatch: '一括ダウンロード開始',
    progress: '進行状況',
    completed: '完了',
    failed: '失敗',
    pending: '保留中',
    howToUse: '一括ダウンロードの使用方法',
    steps: {
      step1: '複数の Instagram リンクを貼り付け（1行に1つずつ）',
      step2: '一括ダウンロード開始をクリック',
      step3: 'ダウンロード進行状況とステータスを監視',
      step4: 'ダウンロード完了後にアーカイブパッケージを取得'
    },
    limits: {
      free: '無料ユーザー：一括あたり最大5リンク',
      premium: 'プレミアムユーザー：一括あたり最大50リンク',
      pro: 'プロユーザー：無制限'
    }
  }
} as const;