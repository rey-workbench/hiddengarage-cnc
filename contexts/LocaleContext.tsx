'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';

interface LocaleContextType {
  locale: string;
  messages: any;
  isLoading: boolean;
  loadLocale: (newLocale: string) => Promise<void>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale: string;
  initialMessages: any;
}

export function LocaleProvider({ children, initialLocale, initialMessages }: LocaleProviderProps) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const loadLocale = async (newLocale: string) => {
    if (newLocale === locale) return;
    
    setIsLoading(true);
    try {
      // Dynamically import the new locale messages
      const newMessages = (await import(`../locales/${newLocale}.json`)).default;
      setLocale(newLocale);
      setMessages(newMessages);
    } catch (error) {
      console.error('Failed to load locale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check localStorage for saved language
    const savedSettings = localStorage.getItem('cnc-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.language && parsed.language !== locale) {
          loadLocale(parsed.language);
        }
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }

    // Listen for storage changes (when language is changed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cnc-settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.language && parsed.language !== locale) {
            loadLocale(parsed.language);
          }
        } catch (error) {
          console.error('Failed to parse storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [locale]);

  // Expose loadLocale function globally so SettingsContext can use it
  useEffect(() => {
    (window as any).__loadLocale = loadLocale;
    return () => {
      delete (window as any).__loadLocale;
    };
  }, [loadLocale]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
          <p className="text-dark-300 text-sm">Loading language...</p>
        </div>
      </div>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, messages, isLoading, loadLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
