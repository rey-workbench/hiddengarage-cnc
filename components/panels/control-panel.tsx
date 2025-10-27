'use client';

import { useUI } from '@/contexts/ui-context';
import RibbonNavbar from '../ui/ribbon-navbar';
import GCodeTab from '../tabs/gcode-tab';
import ImageTab from '../tabs/image-tab';
import SettingsTab from '../tabs/settings-tab';
import StatisticsTab from '../tabs/statistics-tab';
import LegendTab from '../tabs/legend-tab';

interface ControlPanelProps {
  sceneManagers: {
    sceneManager: any;
    toolhead: any;
    pathRenderer: any;
    playbackController: any;
  } | null;
  onGCodeGenerated?: (gcode: string) => void;
}

export default function ControlPanel({ sceneManagers, onGCodeGenerated }: ControlPanelProps) {
  const { uiState } = useUI();

  return (
    <RibbonNavbar>
      <div className="ribbon-tab-content">
        {uiState.activeTab === 'gcode' && sceneManagers && (
          <GCodeTab
            pathRenderer={sceneManagers.pathRenderer}
            sceneManager={sceneManagers.sceneManager}
            toolhead={sceneManagers.toolhead}
          />
        )}
        {uiState.activeTab === 'image' && (
          <ImageTab onGCodeGenerated={onGCodeGenerated || (() => {})} />
        )}
        {uiState.activeTab === 'settings' && sceneManagers && (
          <SettingsTab
            sceneManager={sceneManagers.sceneManager}
          />
        )}
        {uiState.activeTab === 'statistics' && <StatisticsTab />}
        {uiState.activeTab === 'legend' && <LegendTab />}
      </div>
    </RibbonNavbar>
  );
}
