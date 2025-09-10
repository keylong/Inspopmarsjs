export const defaultLocale = 'zh-CN' as const;
export const locales = ['zh-CN', 'zh-TW', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
};

export const localeFlags: Record<Locale, string> = {
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  'en': '🇺🇸',
};

// Geo-routing configuration
export const geoLocaleMapping: Record<string, Locale> = {
  // 中国大陆
  'CN': 'zh-CN',
  // 台湾地区
  'TW': 'zh-TW',
  // 香港
  'HK': 'zh-TW',
  // 澳门
  'MO': 'zh-TW',
  // 新加坡（华人较多）
  'SG': 'zh-CN',
  // 马来西亚（华人较多）
  'MY': 'zh-CN',
  // 默认使用英文
  'default': 'en',
};

export function getLocaleFromCountryCode(countryCode: string): Locale {
  return (geoLocaleMapping[countryCode] || geoLocaleMapping.default) as Locale;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}