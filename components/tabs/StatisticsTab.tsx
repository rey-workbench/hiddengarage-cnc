'use client';

import { useSimulation } from '@/contexts/SimulationContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function StatisticsTab() {
  const { stats } = useSimulation();
  const { stats: statsTranslations } = useTranslation();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">{statsTranslations('title')}</h3>
      <div className="bg-dark-800/60 rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-dark-400">{statsTranslations('totalDistance')}</span>
          <span className="text-sm font-mono font-semibold text-gray-100">
            {stats ? stats.totalDistance.toFixed(2) : '0.00'} mm
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-dark-400">{statsTranslations('rapidDistance')}</span>
          <span className="text-sm font-mono font-semibold text-gray-100">
            {stats ? stats.rapidDistance.toFixed(2) : '0.00'} mm
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-dark-400">{statsTranslations('cutDistance')}</span>
          <span className="text-sm font-mono font-semibold text-gray-100">
            {stats ? stats.cutDistance.toFixed(2) : '0.00'} mm
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
            <span className="text-sm text-dark-400">{statsTranslations('estimatedTime')}</span>
          <span className="text-sm font-mono font-semibold text-gray-100">
            {stats ? formatTime(stats.estimatedTime) : '0:00:00'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-dark-400">{statsTranslations('lines')}</span>
          <span className="text-sm font-mono font-semibold text-gray-100">
            {stats ? stats.lineCount.toLocaleString() : '0'}
          </span>
        </div>
      </div>
    </div>
  );
}
