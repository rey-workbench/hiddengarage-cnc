'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { UIState, TabType } from '@/types';

interface UIContextType {
  uiState: UIState;
  setActiveTab: (tab: TabType) => void;
  togglePanelMinimized: () => void;
  togglePlaybackMinimized: () => void;
  setStatus: (message: string, type?: UIState['statusType']) => void;
  setLoading: (loading: boolean, message?: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const defaultUIState: UIState = {
  activeTab: 'gcode',
  isPanelMinimized: false,
  isPlaybackMinimized: false,
  statusMessage: 'Ready',
  statusType: 'idle',
  isLoading: false,
  loadingMessage: '',
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiState, setUIState] = useState<UIState>(defaultUIState);

  const setActiveTab = useCallback((tab: TabType) => {
    setUIState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const togglePanelMinimized = useCallback(() => {
    setUIState((prev) => ({ ...prev, isPanelMinimized: !prev.isPanelMinimized }));
  }, []);

  const togglePlaybackMinimized = useCallback(() => {
    setUIState((prev) => ({ ...prev, isPlaybackMinimized: !prev.isPlaybackMinimized }));
  }, []);

  const setStatus = useCallback((message: string, type: UIState['statusType'] = 'idle') => {
    setUIState((prev) => ({
      ...prev,
      statusMessage: message,
      statusType: type,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean, message: string = '') => {
    setUIState((prev) => ({
      ...prev,
      isLoading: loading,
      loadingMessage: message,
    }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    setStatus(message, 'success');
  }, [setStatus]);

  const showError = useCallback((message: string) => {
    setStatus(message, 'error');
  }, [setStatus]);

  const showWarning = useCallback((message: string) => {
    setStatus(message, 'warning');
  }, [setStatus]);

  const showInfo = useCallback((message: string) => {
    setStatus(message, 'info');
  }, [setStatus]);

  return (
    <UIContext.Provider
      value={{
        uiState,
        setActiveTab,
        togglePanelMinimized,
        togglePlaybackMinimized,
        setStatus,
        setLoading,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
}
