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
    
    // Notify UI to show loading overlay via global state
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui-loading', { 
        detail: { isLoading: true, message: 'Loading language...' } 
      }));
    }
    
    try {
      // Dynamically import the new locale messages
      const newMessages = (await import(`../locales/${newLocale}.json`)).default;
      
      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLocale(newLocale);
      setMessages(newMessages);
    } catch (error) {
    } finally {
      setIsLoading(false);
      
      // Notify UI to hide loading overlay
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ui-loading', { 
          detail: { isLoading: false } 
        }));
      }
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    (window as any).__loadLocale = loadLocale;
    return () => {
      delete (window as any).__loadLocale;
    };
  }, [loadLocale]);

  return (
    <LocaleContext.Provider value={{ locale, messages, isLoading, loadLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Jakarta">
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
