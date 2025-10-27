import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
  // 1. Try to get locale from cookie
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value;

  // 2. If no cookie, detect from browser Accept-Language header
  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    
    // Parse Accept-Language header (e.g., "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7")
    if (acceptLanguage.includes('id')) {
      locale = 'id';
    } else {
      locale = 'en';
    }
  }

  // 3. Validate locale
  const validLocales = ['en', 'id'];
  if (!validLocales.includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  };
});
