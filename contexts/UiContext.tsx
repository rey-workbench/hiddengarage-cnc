'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { UIState, TabType, PanelState } from '@/types';

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
  updateControlPanelState: (state: Partial<PanelState>) => void;
  updatePlaybackPanelState: (state: Partial<PanelState>) => void;
  resetPanelPositions: () => void;
}

const getDefaultPanelStates = () => ({
  controlPanelState: {
    position: { x: 20, y: 20 },
    size: { width: 380, height: 600 },
    isMinimized: false,
  },
  playbackPanelState: {
    position: { x: window.innerWidth - 340, y: window.innerHeight - 280 },
    size: { width: 320, height: 260 },
    isMinimized: false,
  },
});

const defaultUIState: UIState = {
  activeTab: 'gcode',
  isPanelMinimized: false,
  isPlaybackMinimized: false,
  statusMessage: 'Ready',
  statusType: 'idle',
  isLoading: false,
  loadingMessage: '',
  controlPanelState: {
    position: { x: 20, y: 20 },
    size: { width: 380, height: 600 },
    isMinimized: false,
  },
  playbackPanelState: {
    position: { x: 0, y: 0 },
    size: { width: 320, height: 260 },
    isMinimized: false,
  },
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiState, setUIState] = useState<UIState>(defaultUIState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cnc-panel-states');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUIState((prev) => ({
            ...prev,
            controlPanelState: parsed.controlPanelState || prev.controlPanelState,
            playbackPanelState: parsed.playbackPanelState || prev.playbackPanelState,
          }));
        } catch (e) {
          console.error('Failed to load panel states:', e);
        }
      } else {
        const defaults = getDefaultPanelStates();
        setUIState((prev) => ({
          ...prev,
          ...defaults,
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const toSave = {
        controlPanelState: uiState.controlPanelState,
        playbackPanelState: uiState.playbackPanelState,
      };
      localStorage.setItem('cnc-panel-states', JSON.stringify(toSave));
    }
  }, [uiState.controlPanelState, uiState.playbackPanelState]);

  const setActiveTab = useCallback((tab: TabType) => {
    setUIState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const togglePanelMinimized = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isPanelMinimized: !prev.isPanelMinimized,
      controlPanelState: {
        ...prev.controlPanelState,
        isMinimized: !prev.isPanelMinimized,
      },
    }));
  }, []);

  const togglePlaybackMinimized = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isPlaybackMinimized: !prev.isPlaybackMinimized,
      playbackPanelState: {
        ...prev.playbackPanelState,
        isMinimized: !prev.isPlaybackMinimized,
      },
    }));
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

  const updateControlPanelState = useCallback((state: Partial<PanelState>) => {
    setUIState((prev) => ({
      ...prev,
      controlPanelState: {
        ...prev.controlPanelState,
        ...state,
      },
    }));
  }, []);

  const updatePlaybackPanelState = useCallback((state: Partial<PanelState>) => {
    setUIState((prev) => ({
      ...prev,
      playbackPanelState: {
        ...prev.playbackPanelState,
        ...state,
      },
    }));
  }, []);

  const resetPanelPositions = useCallback(() => {
    const defaults = getDefaultPanelStates();
    setUIState((prev) => ({
      ...prev,
      ...defaults,
    }));
  }, []);

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
        updateControlPanelState,
        updatePlaybackPanelState,
        resetPanelPositions,
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
