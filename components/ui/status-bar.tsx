'use client';

import { useUI } from '@/contexts/ui-context';

export default function StatusBar() {
  const { uiState } = useUI();

  const statusColors = {
    idle: 'border-l-dark-500 text-dark-300',
    success: 'border-l-green-500 text-green-400',
    error: 'border-l-red-500 text-red-400',
    warning: 'border-l-amber-500 text-amber-400',
    info: 'border-l-primary-500 text-primary-400',
  };

  return (
    <div
      className={`
        mt-3 px-3 py-2 text-xs rounded-lg
        bg-dark-900/60 border-l-4
        ${statusColors[uiState.statusType]}
        transition-all duration-200
      `}
    >
      {uiState.statusMessage}
    </div>
  );
}
