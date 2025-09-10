import { createI18nServer } from 'next-international/server';

export const {
  getI18n,
  getScopedI18n,
  getStaticParams,
  getCurrentLocale,
} = createI18nServer({
  'zh-CN': () => import('./locales/zh-CN'),
  'zh-TW': () => import('./locales/zh-TW'),
  'en': () => import('./locales/en'),
});