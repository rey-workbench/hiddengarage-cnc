'use client';

import { useUI } from '@/contexts/UiContext';

export default function LoadingOverlay() {
  const { uiState } = useUI();

  if (!uiState.isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
      {/* Enhanced backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950/98 via-dark-900/96 to-dark-950/98 backdrop-blur-xl" />
      
      {/* Content */}
      <div className="relative text-center">
        {/* Spinner container with glow */}
        <div className="relative inline-block mb-4">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse" />
          
          {/* Spinner */}
          <div className="relative w-16 h-16 rounded-full">
            {/* Background ring */}
            <div className="absolute inset-0 rounded-full border-3 border-primary-500/10" />
            
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary-400 border-r-primary-500 animate-spin" 
              style={{ animationDuration: '0.8s' }} 
            />
            
            {/* Inner glow */}
            <div className="absolute inset-2 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-full blur-sm" />
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-1.5">
          <div className="text-gray-100 text-base font-bold tracking-tight">
            {uiState.loadingMessage || 'Processing...'}
          </div>
          <div className="text-dark-400 text-xs font-medium">
            Please wait
          </div>
        </div>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-1 mt-3">
          <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}
