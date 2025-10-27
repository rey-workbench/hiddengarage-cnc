'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useSceneControls } from '@/hooks/useThreeScene';
import { ColorMode } from '@/lib/Constants';
import { useTranslation } from '@/hooks/useTranslation';
import Select from '@/components/ui/Select';

interface ViewTabProps {
  sceneManager: any;
}

export default function ViewTab({ sceneManager }: ViewTabProps) {
  const { settings, updateSettings } = useSettings();
  const { toggleGrid, toggleAxes } = useSceneControls(sceneManager);
  const { view } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="border-b border-dark-700 pb-3">
        <h3 className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-2">
          {view('uiSize')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateSettings({ uiSize: 'small' })}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
              ${settings.uiSize === 'small'
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 border-2 border-primary-400 text-white shadow-lg shadow-primary-500/30'
                : 'bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-600 text-dark-300 hover:from-dark-700 hover:to-dark-800 hover:border-dark-500'
              }`}
          >
            <div className="flex flex-col items-center gap-0.5">
              <i className="fas fa-compress-alt text-xs" />
              <span>{view('sizeSmall')}</span>
            </div>
          </button>
          <button
            onClick={() => updateSettings({ uiSize: 'medium' })}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
              ${settings.uiSize === 'medium'
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 border-2 border-primary-400 text-white shadow-lg shadow-primary-500/30'
                : 'bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-600 text-dark-300 hover:from-dark-700 hover:to-dark-800 hover:border-dark-500'
              }`}
          >
            <div className="flex flex-col items-center gap-0.5">
              <i className="fas fa-equals text-xs" />
              <span>{view('sizeMedium')}</span>
            </div>
          </button>
          <button
            onClick={() => updateSettings({ uiSize: 'large' })}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
              ${settings.uiSize === 'large'
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 border-2 border-primary-400 text-white shadow-lg shadow-primary-500/30'
                : 'bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-600 text-dark-300 hover:from-dark-700 hover:to-dark-800 hover:border-dark-500'
              }`}
          >
            <div className="flex flex-col items-center gap-0.5">
              <i className="fas fa-expand-alt text-xs" />
              <span>{view('sizeLarge')}</span>
            </div>
          </button>
        </div>
      </div>

      <div className="border-b border-dark-700 pb-3">
        <Select
          label={view('colorMode')}
          value={settings.colorMode}
          onChange={(e) => updateSettings({ colorMode: e.target.value as ColorMode })}
          options={[
            { value: ColorMode.Default, label: view('colorDefault') },
            { value: ColorMode.Axis, label: view('colorAxis') },
            { value: ColorMode.Progressive, label: view('colorProgressive') },
          ]}
        />
        {settings.colorMode === ColorMode.Progressive && (
          <p className="text-[10px] text-dark-400 mt-1.5 leading-relaxed">
            {view('progressiveModeDesc')}
          </p>
        )}
      </div>

      <div className="border-b border-dark-700 pb-3">
        <h3 className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-2">
          {view('displayOptions')}
        </h3>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={settings.showGrid}
              onChange={(e) => {
                updateSettings({ showGrid: e.target.checked });
                toggleGrid(e.target.checked);
              }}
              className="w-3.5 h-3.5 accent-primary-500 rounded transition-transform group-hover:scale-110"
            />
            <span className="text-xs text-dark-300 group-hover:text-gray-200 transition-colors">
              {view('showGrid')}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={settings.showAxes}
              onChange={(e) => {
                updateSettings({ showAxes: e.target.checked });
                toggleAxes(e.target.checked);
              }}
              className="w-3.5 h-3.5 accent-primary-500 rounded transition-transform group-hover:scale-110"
            />
            <span className="text-xs text-dark-300 group-hover:text-gray-200 transition-colors">
              {view('showAxes')}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={settings.showToolhead}
              onChange={(e) => updateSettings({ showToolhead: e.target.checked })}
              className="w-3.5 h-3.5 accent-primary-500 rounded transition-transform group-hover:scale-110"
            />
            <span className="text-xs text-dark-300 group-hover:text-gray-200 transition-colors">
              {view('showToolhead')}
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-2">
          {view('toolheadSize')}
        </h3>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-300">{view('toolheadScale')}</span>
            <span className="text-[10px] text-primary-400 font-mono font-semibold">
              {settings.toolheadSize.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={settings.toolheadSize}
            onChange={(e) => updateSettings({ toolheadSize: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <p className="text-[10px] text-dark-400 leading-relaxed">
            {view('toolheadDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
