'use client';

import { useUI } from '@/contexts/UiContext';
import RibbonNavbar from '../ui/RibbonNavbar';
import GCodeTab from '../tabs/GCodeTab';
import ImageTab from '../tabs/ImageTab';
import SettingsTab from '../tabs/SettingsTab';
import StatisticsTab from '../tabs/StatisticsTab';
import LegendTab from '../tabs/LegendTab';

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
