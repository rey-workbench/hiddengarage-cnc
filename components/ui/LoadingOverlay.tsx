'use client';

import { useUI } from '@/contexts/UiContext';

export default function LoadingOverlay() {
  const { uiState } = useUI();

  if (!uiState.isLoading) return null;

  return (
    <div className="fixed inset-0 bg-dark-950/95 backdrop-blur-sm z-[9999] flex items-center justify-center fade-in">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <div className="text-gray-100 text-lg font-semibold mb-2">
          {uiState.loadingMessage || 'Processing...'}
        </div>
        <div className="text-dark-400 text-sm">Please wait</div>
      </div>
    </div>
  );
}
