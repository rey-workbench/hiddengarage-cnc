'use client';

import { useUI } from '@/contexts/ui-context';
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

  const getStatusColor = () => {
    switch (uiState.statusType) {
      case 'success': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning': return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      case 'info': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-dark-800/40 border-dark-700/50 text-dark-400';
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

  return (
    <div 
      className={`fixed top-20 right-5 z-[100] notification-toast ${getStatusColor()}`}
      style={{ 
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '350px'
      }}
    >
      <div className="flex items-start gap-3">
        <i className={`fas ${getStatusIcon()} text-sm mt-0.5`} />
        <div className="flex-1">
          <span className="text-sm font-medium block">
            {currentMessage}
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <i className="fas fa-times text-xs" />
        </button>
      </div>
    </div>
  );
}
