export default {
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
          '本規約の解釈と執行は、中華人民共和国の法律に準拠します。',
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
} as const;