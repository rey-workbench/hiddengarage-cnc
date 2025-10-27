'use client';

import { useSettings } from '@/contexts/settings-context';
import { TRANSLATIONS } from '@/lib/constants';

export default function LegendTab() {
  const { settings } = useSettings();
  const t = TRANSLATIONS[settings.language];

  return (
    <div className="space-y-4">
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">{t.legend.defaultMode}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#ffd166] shadow" />
            <span className="text-sm text-dark-300">{t.legend.rapid}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#ff0000] shadow" />
            <span className="text-sm text-dark-300">{t.legend.linearCut}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#00ff00] shadow" />
            <span className="text-sm text-dark-300">{t.legend.arcCut}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">{t.legend.progressiveMode}</h3>
        <p className="text-xs text-dark-400 mb-3">{t.legend.progressiveDesc}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#ff0000] shadow" />
            <span className="text-sm text-dark-300">{t.legend.xAxis}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#00ff00] shadow" />
            <span className="text-sm text-dark-300">{t.legend.yAxis}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
