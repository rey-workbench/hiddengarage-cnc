'use client';

import { useUI } from '@/contexts/UiContext';
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const { uiState } = useUI();
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (uiState.statusType !== 'idle' && uiState.statusMessage) {
      setCurrentMessage(uiState.statusMessage);
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [uiState.statusMessage, uiState.statusType]);

  const getStatusStyles = () => {
    switch (uiState.statusType) {
      case 'success': 
        return {
          bg: 'bg-gradient-to-br from-green-500/20 to-green-600/15',
          border: 'border-green-500/40',
          text: 'text-green-300',
          shadow: 'shadow-[0_8px_32px_rgba(34,197,94,0.2)]',
          glow: 'bg-green-500/10',
        };
      case 'error': 
        return {
          bg: 'bg-gradient-to-br from-red-500/20 to-red-600/15',
          border: 'border-red-500/40',
          text: 'text-red-300',
          shadow: 'shadow-[0_8px_32px_rgba(239,68,68,0.2)]',
          glow: 'bg-red-500/10',
        };
      case 'warning': 
        return {
          bg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/15',
          border: 'border-amber-500/40',
          text: 'text-amber-300',
          shadow: 'shadow-[0_8px_32px_rgba(245,158,11,0.2)]',
          glow: 'bg-amber-500/10',
        };
      case 'info': 
        return {
          bg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/15',
          border: 'border-blue-500/40',
          text: 'text-blue-300',
          shadow: 'shadow-[0_8px_32px_rgba(59,130,246,0.2)]',
          glow: 'bg-blue-500/10',
        };
      default: 
        return {
          bg: 'bg-gradient-to-br from-dark-800/60 to-dark-900/60',
          border: 'border-dark-700/50',
          text: 'text-dark-300',
          shadow: 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
          glow: 'bg-dark-700/10',
        };
    }
  };

  const getStatusIcon = () => {
    switch (uiState.statusType) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-circle';
    }
  };

  if (!isVisible) return null;

  const styles = getStatusStyles();

  return (
    <div 
      className={`fixed top-16 right-4 z-[100] ${styles.bg} ${styles.border} ${styles.shadow} backdrop-blur-xl border rounded-lg px-3 py-2 animate-[slideInRight_0.3s_cubic-bezier(0.34,1.56,0.64,1)]`}
      style={{ maxWidth: '320px' }}
    >
      <div className={`absolute inset-0 ${styles.glow} rounded-lg opacity-50 blur-lg`} />
      
      <div className="relative flex items-start gap-2">
        <div className="relative">
          <div className={`absolute inset-0 ${styles.glow} rounded-full animate-ping opacity-75`} />
          <i className={`fas ${getStatusIcon()} ${styles.text} text-sm relative`} />
        </div>
        <div className="flex-1 pt-0">
          <span className={`text-xs font-medium block ${styles.text}`}>
            {currentMessage}
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className={`${styles.text} opacity-60 hover:opacity-100 transition-all duration-200 hover:scale-110 p-0.5`}
          title="Close"
        >
          <i className="fas fa-times text-[10px]" />
        </button>
      </div>
    </div>
  );
}
