'use client';

import { useSettings } from '@/contexts/settings-context';
import { useUI } from '@/contexts/ui-context';
import { useSceneControls } from '@/hooks/use-three-scene';
import { TRANSLATIONS } from '@/lib/constants';
import { ColorMode, CameraView } from '@/types';

interface SettingsTabProps {
  sceneManager: any;
}

export default function SettingsTab({ sceneManager }: SettingsTabProps) {
  const { settings, updateSettings } = useSettings();
  const { resetPanelPositions } = useUI();
  const { setCameraView, toggleGrid, toggleAxes } = useSceneControls(sceneManager);
  const t = TRANSLATIONS[settings.language];

  return (
    <div className="space-y-4">
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {t.settings.simulation}
        </h3>
        <div className="flex items-center justify-between">
          <label className="text-sm text-dark-300">{t.gcode.arcSegments}</label>
          <input type="number" value={settings.arcSegments}
            onChange={(e) => updateSettings({ arcSegments: parseInt(e.target.value) })}
            min="4" max="256" className="input-base w-20" />
        </div>
      </div>
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">{t.settings.colorMode}</h3>
        <select value={settings.colorMode}
          onChange={(e) => updateSettings({ colorMode: e.target.value as ColorMode })} className="input-base w-full">
          <option value={ColorMode.DEFAULT}>{t.settings.colorDefault}</option>
          <option value={ColorMode.AXIS}>{t.settings.colorAxis}</option>
          <option value={ColorMode.PROGRESSIVE}>{t.settings.colorProgressive}</option>
        </select>
      </div>
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">{t.settings.displayOptions}</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.showGrid}
              onChange={(e) => { updateSettings({ showGrid: e.target.checked }); toggleGrid(e.target.checked); }}
              className="w-4 h-4 accent-primary-500" />
            <span className="text-sm text-dark-300">{t.settings.showGrid}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.showAxes}
              onChange={(e) => { updateSettings({ showAxes: e.target.checked }); toggleAxes(e.target.checked); }}
              className="w-4 h-4 accent-primary-500" />
            <span className="text-sm text-dark-300">{t.settings.showAxes}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.showToolhead}
              onChange={(e) => updateSettings({ showToolhead: e.target.checked })}
              className="w-4 h-4 accent-primary-500" />
            <span className="text-sm text-dark-300">{t.settings.showToolhead}</span>
          </label>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">{t.settings.toolheadSize}</label>
            <span className="text-xs text-primary-400 font-mono font-semibold">{settings.toolheadSize.toFixed(1)}x</span>
          </div>
          <input type="range" min="0.1" max="5" step="0.1" value={settings.toolheadSize}
            onChange={(e) => updateSettings({ toolheadSize: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500" />
        </div>
      </div>
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">{t.settings.cameraPresets}</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setCameraView(CameraView.TOP)} className="btn text-xs">{t.settings.viewTop}</button>
          <button onClick={() => setCameraView(CameraView.FRONT)} className="btn text-xs">{t.settings.viewFront}</button>
          <button onClick={() => setCameraView(CameraView.SIDE)} className="btn text-xs">{t.settings.viewSide}</button>
          <button onClick={() => setCameraView(CameraView.ISOMETRIC)} className="btn text-xs">{t.settings.viewIso}</button>
        </div>
      </div>
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Bahasa / Language</h3>
        <select value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'id' })} className="input-base w-full">
          <option value="id">🇮🇩 Bahasa Indonesia</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Panel Layout</h3>
        <button 
          onClick={() => {
            if (confirm(settings.language === 'id' 
              ? 'Reset posisi dan ukuran semua panel ke default?' 
              : 'Reset all panel positions and sizes to default?')) {
              resetPanelPositions();
            }
          }}
          className="btn w-full flex items-center justify-center gap-2"
        >
          <i className="fas fa-undo text-xs" />
          <span className="text-xs">{settings.language === 'id' ? 'Reset Posisi Panel' : 'Reset Panel Positions'}</span>
        </button>
      </div>
    </div>
  );
}
