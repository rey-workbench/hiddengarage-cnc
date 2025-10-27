'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import SettingsTab from '@/components/tabs/SettingsTab';

export default function SettingsPage() {
  const { sceneManagers } = useWorkspace();

  return (
    <div className="ribbon-tab-content">
      {sceneManagers ? (
        <SettingsTab sceneManager={sceneManagers.sceneManager} />
      ) : (
        <div className="text-center text-dark-400 py-8">
          Initializing 3D scene...
        </div>
      )}
    </div>
  );
}
