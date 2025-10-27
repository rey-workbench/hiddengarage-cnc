'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
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

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('cnc-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      
      try {
        localStorage.setItem('cnc-settings', JSON.stringify(newSettings));
        
        // If language is being updated, trigger locale change
        if (updates.language && updates.language !== prev.language) {
          loadLocale(updates.language);
        }
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      
      return newSettings;
    });
  }, [loadLocale]);

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