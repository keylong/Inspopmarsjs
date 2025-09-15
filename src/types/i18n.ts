// i18n类型定义
export type I18nFunction = (key: string) => string | Record<string, any>;

export interface DownloadCenterTranslations {
  title: string;
  subtitle: string;
  breadcrumb: {
    home: string;
    center: string;
  };
  badges: {
    freeUse: string;
    hdNoWatermark: string;
  };
  options: {
    post: {
      title: string;
      description: string;
      features: string[] | Record<string, string>;
    };
    stories: {
      title: string;
      description: string;
      features: string[] | Record<string, string>;
    };
    reels: {
      title: string;
      description: string;
      features: string[] | Record<string, string>;
    };
    igtv: {
      title: string;
      description: string;
      features: string[] | Record<string, string>;
    };
    highlights: {
      title: string;
      description: string;
      features: string[] | Record<string, string>;
    };
    profile: {
      title: string;
      description: string;
      features: string[] | Record<string, string>;
    };
  };
  button: {
    useNow: string;
  };
  howToUse: {
    title: string;
    steps: {
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
    };
  };
}

export interface TranslationData {
  downloadCenter: DownloadCenterTranslations;
  downloadPages: {
    post: {
      title: string;
      heading: string;
      subheading: string;
      inputPlaceholder: string;
      howToUse: string;
    };
  };
  nav: {
    home: string;
  };
  common: {
    back: string;
    cancel: string;
    download: string;
    copy: string;
  };
  download: {
    form: {
      urlLabel: string;
      urlRequired: string;
      downloading: string;
      startDownload: string;
      downloadFailed: string;
      supportedTypes: string;
    };
    result: {
      completed: string;
      downloadFailed: string;
      selectResolution: string;
      original: string;
      mediaDownload: string;
      mediaFiles: string;
      image: string;
      video: string;
      totalSize: string;
      preview: string;
    };
    features: {
      title: string;
      highQuality: string;
      highQualityDesc: string;
      noWatermark: string;
      noWatermarkDesc: string;
      fastSpeed: string;
      fastSpeedDesc: string;
    };
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  errors: {
    networkError: string;
  };
}

// 辅助类型，用于类型安全的翻译函数返回值
export type TranslationValue = string | string[] | Record<string, string>;