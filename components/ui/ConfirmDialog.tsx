'use client';

import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: 'warning' | 'info' | 'danger' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const iconConfig = {
    warning: {
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-amber-600/20',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      iconClass: 'fas fa-exclamation-triangle',
      pulseColor: 'bg-amber-500/20',
    },
    info: {
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      iconClass: 'fas fa-info-circle',
      pulseColor: 'bg-blue-500/20',
    },
    danger: {
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      iconClass: 'fas fa-times-circle',
      pulseColor: 'bg-red-500/20',
    },
    success: {
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      iconClass: 'fas fa-check-circle',
      pulseColor: 'bg-green-500/20',
    },
  };

  const config = iconConfig[icon];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-sm mx-4 animate-[dialogSlideIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
        <div className="relative bg-gradient-to-br from-dark-800/98 to-dark-900/98 backdrop-blur-xl rounded-xl border border-dark-600/50 shadow-2xl overflow-hidden">
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 rounded-xl opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 animate-pulse" />
          </div>

          <div className="relative p-4 space-y-3">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Pulse animation background */}
                <div className={`absolute inset-0 ${config.pulseColor} rounded-full animate-ping opacity-75`} />
                <div className={`relative w-16 h-16 ${config.bgColor} ${config.borderColor} border-2 rounded-full flex items-center justify-center`}>
                  <i className={`${config.iconClass} ${config.iconColor} text-3xl`} />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-100 mb-1.5">
                {title}
              </h3>
              <p className="text-xs text-dark-300 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={onCancel}
                className="flex-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200
                  bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600
                  hover:from-dark-600 hover:to-dark-700 hover:border-dark-500
                  hover:-translate-y-0.5 hover:shadow-lg
                  active:translate-y-0 text-dark-200"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200
                  bg-gradient-to-br from-primary-500 to-primary-600 border border-primary-700
                  hover:from-primary-400 hover:to-primary-500 hover:border-primary-600
                  hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/30
                  active:translate-y-0 text-white"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
