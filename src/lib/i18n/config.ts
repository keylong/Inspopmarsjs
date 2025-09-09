export const defaultLocale = 'zh-CN' as const;
export const locales = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'es'] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'es': 'Español',
};

export const localeFlags: Record<Locale, string> = {
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  'en': '🇺🇸',
  'ja': '🇯🇵',
  'ko': '🇰🇷',
  'es': '🇪🇸',
};

// Geo-routing configuration
export const geoLocaleMapping: Record<string, Locale> = {
  // China
  'CN': 'zh-CN',
  // Taiwan
  'TW': 'zh-TW',
  // Hong Kong
  'HK': 'zh-TW',
  // Macau
  'MO': 'zh-TW',
  // Singapore (Chinese preference)
  'SG': 'zh-CN',
  // Malaysia (Chinese preference)
  'MY': 'zh-CN',
  // Japan
  'JP': 'ja',
  // South Korea
  'KR': 'ko',
  // Spain
  'ES': 'es',
  // Spanish-speaking countries
  'MX': 'es',
  'AR': 'es',
  'CO': 'es',
  'VE': 'es',
  'PE': 'es',
  'CL': 'es',
  'EC': 'es',
  'BO': 'es',
  'UY': 'es',
  'PY': 'es',
  'CR': 'es',
  'PA': 'es',
  'DO': 'es',
  'CU': 'es',
  'GT': 'es',
  'HN': 'es',
  'SV': 'es',
  'NI': 'es',
  'PR': 'es',
  // Default for other countries
  'default': 'en',
};

export function getLocaleFromCountryCode(countryCode: string): Locale {
  return (geoLocaleMapping[countryCode] || geoLocaleMapping.default) as Locale;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}