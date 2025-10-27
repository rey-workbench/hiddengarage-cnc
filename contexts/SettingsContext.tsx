'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import type { Settings } from '@/lib/Constants';
import { ColorMode } from '@/lib/Constants';
import { CNCConstants } from '@/lib/Constants';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  playbackSpeed: CNCConstants.defaults.playbackSpeed,
  arcSegments: CNCConstants.defaults.arcSegments,
  colorMode: ColorMode.Default,
  showGrid: true,
  showAxes: true,
  showToolhead: true,
  toolheadSize: CNCConstants.defaults.toolheadSize,
  uiSize: 'medium',
  language: 'id',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { loadLocale } = useLocale();
  const previousLanguage = useRef<string>(defaultSettings.language);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('cnc-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
        previousLanguage.current = parsed.language || defaultSettings.language;
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    // Mark that initial mount is complete
    isInitialMount.current = false;
  }, []);

  // Watch for language changes and trigger locale loading (skip initial mount)
  useEffect(() => {
    // Skip on initial mount to avoid render-phase updates
    if (isInitialMount.current) {
      return;
    }
    
    if (settings.language !== previousLanguage.current) {
      loadLocale(settings.language);
      previousLanguage.current = settings.language;
    }
  }, [settings.language, loadLocale]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      
      try {
        localStorage.setItem('cnc-settings', JSON.stringify(newSettings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('cnc-settings');
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}