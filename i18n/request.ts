import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { loadLocaleMessages } from '@/lib/messages';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'ne')) {
    locale = routing.defaultLocale;
  }

  const messages = await loadLocaleMessages(locale);

  return {
    locale,
    messages,
  };
});