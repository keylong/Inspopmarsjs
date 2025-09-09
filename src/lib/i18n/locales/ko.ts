export default {
  // Common UI elements
  common: {
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    back: '뒤로',
    next: '다음',
    previous: '이전',
    close: '닫기',
    search: '검색',
    filter: '필터',
    sort: '정렬',
    download: '다운로드',
    upload: '업로드',
    share: '공유',
    copy: '복사',
    copied: '복사됨',
    language: '언어',
  },

  // Navigation
  nav: {
    home: '홈',
    download: '다운로드',
    profile: '프로필',
    settings: '설정',
    about: '소개',
    help: '도움말',
    contact: '연락처',
    login: '로그인',
    register: '회원가입',
    logout: '로그아웃',
    dashboard: '대시보드',
  },

  // Auth pages
  auth: {
    signin: {
      title: '로그인',
      subtitle: '다시 오신 것을 환영합니다! 로그인 정보를 입력해주세요',
      email: '이메일 주소',
      password: '비밀번호',
      remember: '로그인 상태 유지',
      forgot: '비밀번호를 잊으셨나요?',
      submit: '로그인',
      noAccount: '계정이 없으신가요?',
      createAccount: '계정 만들기',
      emailPlaceholder: '이메일 주소를 입력하세요',
      passwordPlaceholder: '비밀번호를 입력하세요',
    },
    signup: {
      title: '회원가입',
      subtitle: '새 계정을 만드세요',
      name: '전체 이름',
      email: '이메일 주소',
      password: '비밀번호',
      confirmPassword: '비밀번호 확인',
      terms: '다음에 동의합니다',
      termsLink: '서비스 이용약관',
      privacy: '개인정보처리방침',
      submit: '계정 만들기',
      hasAccount: '이미 계정이 있으신가요?',
      signIn: '로그인',
      namePlaceholder: '전체 이름을 입력하세요',
      emailPlaceholder: '이메일 주소를 입력하세요',
      passwordPlaceholder: '비밀번호를 입력하세요',
      confirmPasswordPlaceholder: '비밀번호를 다시 입력하세요',
    },
  },

  // Download page
  download: {
    title: 'Instagram 다운로드 소프트웨어',
    subtitle: 'Instagram 사진, 동영상, 스토리, IGTV를 빠르게 다운로드하세요',
    urlLabel: 'Instagram URL',
    urlPlaceholder: 'Instagram 링크를 여기에 붙여넣으세요...',
    downloadButton: '지금 다운로드',
    supportedTypes: '지원 형식',
    photos: '사진',
    videos: '동영상',
    stories: '스토리',
    igtv: 'IGTV',
    reels: '릴스',
    highlights: '하이라이트',
    howTo: '사용 방법',
    step1: 'Instagram 콘텐츠 링크 복사',
    step2: '위의 입력 상자에 붙여넣기',
    step3: '다운로드 버튼 클릭',
    step4: '처리 완료 및 다운로드 대기',
    features: {
      title: '기능',
      highQuality: '고화질',
      highQualityDesc: '원본 고화질 사진 및 동영상 다운로드',
      noWatermark: '워터마크 없음',
      noWatermarkDesc: '다운로드한 콘텐츠에는 워터마크가 없습니다',
      fastSpeed: '빠른 다운로드',
      fastSpeedDesc: '최적화된 다운로드 엔진으로 빠른 다운로드 보장',
      allFormats: '모든 형식',
      allFormatsDesc: '모든 Instagram 콘텐츠 형식 지원',
    },
  },

  // Profile page
  profile: {
    title: '프로필',
    editProfile: '프로필 편집',
    name: '이름',
    email: '이메일',
    avatar: '아바타',
    downloadHistory: '다운로드 기록',
    settings: '계정 설정',
    deleteAccount: '계정 삭제',
    confirmDelete: '계정 삭제 확인',
    deleteWarning: '이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다.',
  },

  // SEO and meta
  seo: {
    siteName: 'InstagramDown - Instagram 다운로드 소프트웨어',
    defaultTitle: 'Instagram 다운로드 소프트웨어 - 무료 Instagram 사진 및 동영상 다운로더',
    defaultDescription: '무료 Instagram 다운로드 소프트웨어. 워터마크 없이 고화질의 Instagram 사진, 동영상, 스토리, IGTV, 릴스를 다운로드하세요. 간단하고 사용하기 쉽습니다.',
    keywords: 'Instagram 다운로드 소프트웨어, Instagram 사진 다운로드, Instagram 동영상 다운로드, 스토리 다운로드, IGTV 다운로드, 릴스 다운로드',
  },

  // Error messages
  errors: {
    invalidUrl: '유효한 Instagram URL을 입력해주세요',
    networkError: '네트워크 연결이 실패했습니다. 다시 시도해주세요',
    serverError: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요',
    notFound: '콘텐츠를 찾을 수 없습니다',
    rateLimited: '요청이 너무 많습니다. 나중에 다시 시도해주세요',
    unauthorized: '이 작업을 수행하려면 로그인이 필요합니다',
    forbidden: '이 작업을 수행할 권한이 없습니다',
    generic: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요',
  },

  // Success messages
  success: {
    downloadStarted: '다운로드가 시작되었습니다',
    profileUpdated: '프로필이 성공적으로 업데이트되었습니다',
    settingsSaved: '설정이 성공적으로 저장되었습니다',
    accountCreated: '계정이 성공적으로 생성되었습니다',
    loginSuccess: '로그인에 성공했습니다',
  },

  // Terms of Service page
  terms: {
    title: '서비스 이용약관',
    subtitle: '이 서비스 이용약관을 주의 깊게 읽어보시기 바랍니다. 저희 서비스를 이용함으로써 귀하는 이 약관에 동의하는 것으로 간주됩니다.',
    lastUpdated: '최종 업데이트',
    version: '버전',
    tableOfContents: '목차',
    sections: {
      serviceDescription: {
        title: '1. 서비스 설명',
        content: [
          'InstagramDown("저희", "저희 팀", 또는 "서비스"로 지칭)은 사용자가 사진, 동영상, 스토리, 릴스, IGTV 콘텐츠를 포함한 Instagram의 공개된 콘텐츠를 다운로드할 수 있게 해주는 웹 기반 도구입니다.',
          '이 서비스는 개인적이고 비상업적인 용도로만 사용하도록 의도되었습니다. 사용자는 다운로드한 콘텐츠를 불법적이거나 침해적인 목적으로 사용하지 않는다는 데 동의합니다.',
          '저희는 사전 통지 없이 언제든지 서비스를 수정, 중단 또는 종료할 권리를 보유합니다.'
        ]
      },
      userResponsibilities: {
        title: '2. 사용자 책임',
        content: [
          '사용자는 저작권법, 개인정보보호법, 데이터 보호법을 포함한 모든 관련 법률 및 규정을 준수해야 합니다.',
          '사용자는 자신이 저작권을 소유하거나 적절한 허가를 받은 콘텐츠만 다운로드할 수 있습니다.',
          '사용자는 다음과 같은 목적으로 이 서비스를 사용하는 것이 금지됩니다:',
          '• 타인의 저작권, 상표권 또는 기타 지적재산권 침해',
          '• 타인에 대한 괴롭힘, 위협 또는 개인정보 침해',
          '• 악성코드, 바이러스 또는 기타 유해한 코드 배포',
          '• 어떤 형태의 상업적 활동이나 마케팅 홍보 참여',
          '• Instagram의 이용약관 및 커뮤니티 가이드라인 위반',
          '사용자는 이 서비스 사용에 대한 모든 책임을 집니다.'
        ]
      },
      intellectualProperty: {
        title: '3. 지적재산',
        content: [
          '이 서비스의 모든 콘텐츠, 기능 및 기술은 저작권, 상표권 및 기타 지적재산법의 보호를 받습니다.',
          '이 서비스를 통해 다운로드한 콘텐츠의 저작권은 원래 콘텐츠 제작자에게 있습니다.',
          '사용자는 저희의 명시적인 서면 허가 없이 이 서비스의 어떤 부분도 복사, 수정, 배포 또는 상업화할 수 없습니다.',
          'Instagram은 Meta Platforms, Inc.의 상표입니다. 저희는 Instagram 또는 Meta와 어떤 방식으로든 제휴하지 않았습니다.'
        ]
      },
      disclaimer: {
        title: '4. 면책조항',
        content: [
          '이 서비스는 명시적이거나 묵시적인 보증 없이 "있는 그대로" 제공됩니다.',
          '저희는 서비스의 연속성, 정확성, 완전성 또는 적시성을 보장하지 않습니다.',
          '저희는 다음에 대해 책임지지 않습니다:',
          '• 이 서비스 사용으로 인한 직접적 또는 간접적 손실',
          '• 서비스 중단, 데이터 손실 또는 시스템 장애',
          '• 제3자 콘텐츠의 정확성 또는 합법성',
          '• 사용자가 법률 및 규정을 위반함으로 인한 결과',
          '사용자는 자신의 위험을 감수하고 이 서비스를 사용합니다.'
        ]
      },
      serviceChanges: {
        title: '5. 서비스 변경',
        content: [
          '저희는 언제든지 서비스를 수정, 업데이트 또는 종료할 권리를 보유합니다.',
          '주요 변경 사항은 웹사이트 공지 또는 기타 적절한 수단을 통해 사용자에게 전달됩니다.',
          '서비스의 지속적인 사용은 그러한 변경 사항에 대한 동의를 나타냅니다.',
          '사용자가 변경 사항에 동의하지 않는 경우, 서비스 사용을 즉시 중단해야 합니다.'
        ]
      },
      accountTermination: {
        title: '6. 계정 종료',
        content: [
          '저희는 다음과 같은 상황에서 사용자 액세스를 종료할 권리가 있습니다:',
          '• 이 서비스 이용약관 위반',
          '• 불법적이거나 유해한 활동 참여',
          '• 서비스 리소스 남용 또는 과도한 사용',
          '• 저희가 부적절하다고 판단하는 기타 행위',
          '계정 종료 후, 사용자는 즉시 서비스 사용을 중단해야 합니다.',
          '저희는 계정 종료로 인한 손실에 대해 책임지지 않습니다.'
        ]
      },
      disputeResolution: {
        title: '7. 분쟁 해결',
        content: [
          '이 약관에서 발생하는 모든 분쟁은 먼저 우호적인 협상을 통해 해결되어야 합니다.',
          '협상이 실패할 경우, 분쟁은 서비스 제공자가 위치한 곳의 관할 법원에 제출되어야 합니다.',
          '이 약관의 해석과 시행은 대한민국 법률의 적용을 받습니다.',
          '이 약관의 어떤 조항이 무효하다고 판단되더라도, 다른 조항의 유효성에는 영향을 주지 않습니다.'
        ]
      },
      contact: {
        title: '8. 연락처',
        content: [
          '이 서비스 이용약관에 대해 질문이 있으시면 다음을 통해 연락해 주세요:',
          '• 이메일: support@instagramdown.com',
          '• 온라인 지원: 더 많은 도움을 위해 저희 웹사이트를 방문하세요',
          '저희는 귀하의 문의사항을 접수한 후 가능한 빨리 응답하겠습니다.'
        ]
      }
    },
    effectiveDate: '시행일: 2024년 1월 1일',
    acknowledgment: '이 서비스를 사용함으로써 귀하는 이 서비스 이용약관을 읽고 이해했으며, 이에 구속되는 것에 동의함을 인정합니다.'
  },

  // Footer
  footer: {
    company: 'Instagram 다운로더',
    copyright: '저작권',
    allRightsReserved: '모든 권리 보유',
    links: {
      privacy: '개인정보처리방침',
      terms: '서비스 이용약관',
      help: '도움말 센터',
      contact: '연락하기',
      about: '회사 소개',
    },
    social: {
      title: '팔로우하기',
      twitter: '트위터',
      facebook: '페이스북',
      instagram: 'Instagram',
      youtube: 'YouTube',
    },
    sections: {
      product: '제품',
      support: '지원',
      company: '회사',
      legal: '법적 정보',
    },
    description: '최고의 Instagram 콘텐츠 다운로드 도구로, 사진, 동영상, 스토리, IGTV, 릴스 다운로드를 지원합니다.',
  },

  // Privacy Policy
  privacy: {
    title: '개인정보처리방침',
    subtitle: '저희가 개인정보를 수집, 사용, 보호하는 방법을 알아보세요',
    lastUpdated: '최종 업데이트',
    tableOfContents: '목차',
    sections: {
      overview: {
        title: '개요',
        content: '이 개인정보처리방침은 InstagramDown("저희", "저희 팀")이 Instagram 콘텐츠 다운로드 서비스를 이용할 때 개인정보를 수집, 사용, 보호하는 방법을 설명합니다. 저희는 귀하의 개인정보보호 권리를 보호하고 GDPR(일반 데이터 보호 규정) 및 CCPA(캘리포니아 소비자 개인정보보호법)을 포함한 관련 데이터 보호 법률 및 규정을 준수하기 위해 최선을 다하고 있습니다.'
      },
      dataCollection: {
        title: '데이터 수집',
        content: '저희는 다음과 같은 유형의 정보를 수집합니다:',
        items: [
          '귀하가 제공하는 Instagram 링크 및 URL',
          '브라우저 유형, 버전 및 운영 체제 정보',
          'IP 주소 및 지리적 위치 (분석 목적으로만)',
          '쿠키 및 유사한 기술을 통해 수집된 사용 데이터',
          '기기 식별자 및 네트워크 정보',
          '사용 통계 및 성능 데이터'
        ]
      },
      dataUsage: {
        title: '데이터 사용',
        content: '저희는 수집된 정보를 다음 용도로 사용합니다:',
        items: [
          'Instagram 콘텐츠 다운로드 서비스 제공 및 개선',
          '귀하의 다운로드 요청 처리 및 실행',
          '서비스 사용 분석 및 사용자 경험 최적화',
          '사기 방지 및 서비스 보안 보장',
          '법적 의무 준수 및 법적 절차에 대한 응답',
          '중요한 서비스 알림 및 업데이트 전송'
        ]
      },
      dataSecurity: {
        title: '데이터 보안',
        content: '저희는 귀하의 데이터를 보호하기 위해 다음과 같은 조치를 시행합니다:',
        items: [
          '모든 민감한 데이터 전송에 대한 SSL/TLS 암호화',
          '접근 제어 및 인증 메커니즘',
          '정기적인 보안 감사 및 취약점 평가',
          '데이터 최소화 원칙 - 필요한 정보만 수집',
          '안전한 데이터 저장 및 백업 절차',
          '직원 데이터 보호 교육 및 접근 제한'
        ]
      },
      thirdPartyServices: {
        title: '제3자 서비스',
        content: '저희는 귀하의 정보를 수집할 수 있는 다음과 같은 제3자 서비스를 사용합니다:',
        items: [
          'Google Analytics - 웹사이트 사용 분석',
          'Cloudflare - CDN 및 보안 서비스',
          'Instagram API - 콘텐츠 가져오기 (Instagram 이용약관 준수)',
          'Stripe - 결제 처리 (해당되는 경우)',
          '클라우드 스토리지 제공업체 - 임시 파일 저장'
        ]
      },
      userRights: {
        title: '귀하의 권리',
        content: 'GDPR 및 기타 데이터 보호법에 따라 귀하는 다음과 같은 권리를 가집니다:',
        items: [
          '접근권: 저희가 보유한 개인 데이터의 사본을 얻을 권리',
          '정정권: 부정확하거나 불완전한 개인 데이터의 수정을 요청할 권리',
          '삭제권: 특정 상황에서 개인 데이터의 삭제를 요청할 권리',
          '처리 제한권: 개인 데이터 처리를 제한할 권리',
          '데이터 이식성권: 구조화되고 일반적으로 사용되는 형식으로 데이터를 받을 권리',
          '이의제기권: 정당한 이익을 기반으로 한 처리에 이의를 제기할 권리'
        ]
      },
      dataRetention: {
        title: '데이터 보존',
        content: '저희의 데이터 보존 정책은 다음과 같습니다:',
        items: [
          '다운로드 기록: 30일 후 자동 삭제',
          'IP 주소 및 로그: 보안 분석을 위해 90일 동안 보존',
          '분석 데이터: 익명화되어 2년 동안 보존',
          '쿠키 데이터: 쿠키 유형에 따라 다양한 기간 동안 보존',
          '연락처 정보: 삭제 요청 또는 계정 폐쇄 시까지',
          '법적으로 요구되는 데이터: 관련 법률에서 요구하는 기간 동안 보존'
        ]
      },
      cookies: {
        title: '쿠키 정책',
        content: '저희는 다음과 같은 유형의 쿠키를 사용합니다:',
        items: [
          '필수 쿠키: 웹사이트의 적절한 작동을 보장하는 기본 기능',
          '분석 쿠키: 웹사이트 사용 패턴을 이해하는 데 도움',
          '기능 쿠키: 귀하의 환경설정과 설정을 기억',
          '마케팅 쿠키: 개인화된 광고 및 콘텐츠 추천에 사용',
          '브라우저 설정을 통해 쿠키 환경설정을 관리할 수 있습니다',
          '특정 쿠키를 비활성화하면 웹사이트 기능에 영향을 미칠 수 있습니다'
        ]
      },
      contact: {
        title: '연락하기',
        content: '저희의 개인정보처리방침에 대해 질문이 있거나 권리를 행사하려면 다음으로 연락해 주세요:',
        email: 'privacy@inspopmars.com',
        address: '개인정보보호책임자\nInstagramDown\n[회사 주소]',
        response: '저희는 귀하의 요청에 30일 이내에 응답하겠습니다'
      }
    }
  },
} as const;