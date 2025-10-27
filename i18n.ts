import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Default to Indonesian
  let locale = 'id';

  // Try to detect from browser Accept-Language header as fallback
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    
    // Parse Accept-Language header (e.g., "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7")
    if (acceptLanguage.includes('en') && !acceptLanguage.includes('id')) {
      locale = 'en';
    }
  } catch (error) {
    // Fallback to default if headers are not available
    console.log('Headers not available, using default locale');
  }

  // Validate locale
  const validLocales = ['en', 'id'];
  if (!validLocales.includes(locale)) {
    locale = 'id';
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
    timeZone: 'Asia/Jakarta'
  };
});
