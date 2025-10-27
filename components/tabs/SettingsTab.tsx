'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useUI } from '@/contexts/UiContext';
import { useSceneControls } from '@/hooks/useThreeScene';
import { CameraView } from '@/lib/Constants';
import { useTranslation } from '@/hooks/useTranslation';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface SettingsTabProps {
  sceneManager: any;
}

export default function SettingsTab({ sceneManager }: SettingsTabProps) {
  const { settings, updateSettings } = useSettings();
  const { resetPanelPositions } = useUI();
  const { setCameraView } = useSceneControls(sceneManager);
  const { common, settings: settingsTranslations } = useTranslation();
  const { dialogState, showConfirm, handleCancel, handleConfirm } = useConfirmDialog();

  return (
    <div className="space-y-4">
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {settingsTranslations('simulation')}
        </h3>
        <div className="flex items-center justify-between">
          <label className="text-sm text-dark-300">{settingsTranslations('arcSegments')}</label>
          <input type="number" value={settings.arcSegments}
            onChange={(e) => updateSettings({ arcSegments: parseInt(e.target.value) })}
            min="4" max="256" className="input-base w-20" />
        </div>
      </div>
      <div className="border-b border-dark-700 pb-4">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">{settingsTranslations('cameraPresets')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setCameraView(CameraView.Top)} className="btn text-xs">{settingsTranslations('viewTop')}</button>
          <button onClick={() => setCameraView(CameraView.Front)} className="btn text-xs">{settingsTranslations('viewFront')}</button>
          <button onClick={() => setCameraView(CameraView.Side)} className="btn text-xs">{settingsTranslations('viewSide')}</button>
          <button onClick={() => setCameraView(CameraView.Isometric)} className="btn text-xs">{settingsTranslations('viewIso')}</button>
        </div>
      </div>
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">{settingsTranslations('language')}</h3>
        <select value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'id' })} className="input-base w-full">
          <option value="id">🇮🇩 Bahasa Indonesia</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">{settingsTranslations('panelLayout')}</h3>
        <button 
          onClick={async () => {
            const confirmed = await showConfirm({
              title: settingsTranslations('resetPanelPositions'),
              message: settingsTranslations('resetPanelPositionsConfirm'),
              confirmText: common('reset'),
              cancelText: common('cancel'),
              icon: 'warning',
            });
            if (confirmed) {
              resetPanelPositions();
            }
          }}
          className="btn w-full flex items-center justify-center gap-2"
        >
          <i className="fas fa-undo text-xs" />
          <span className="text-xs">{settingsTranslations('resetPanelPositions')}</span>
        </button>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        icon={dialogState.icon}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
