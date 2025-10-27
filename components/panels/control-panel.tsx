'use client';

import { useState } from 'react';
import { useUI } from '@/contexts/ui-context';
import { useSettings } from '@/contexts/settings-context';
import { TRANSLATIONS } from '@/lib/constants';
import type { TabType } from '@/types';
import GCodeTab from '../tabs/gcode-tab';
import SVGTab from '../tabs/svg-tab';
import SettingsTab from '../tabs/settings-tab';
import StatisticsTab from '../tabs/statistics-tab';
import LegendTab from '../tabs/legend-tab';
import StatusBar from '../ui/status-bar';

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
  const { uiState, setActiveTab, togglePanelMinimized } = useUI();
  const { settings } = useSettings();
  const t = TRANSLATIONS[settings.language];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'gcode', label: t.tab.gcode },
    { id: 'svg', label: t.tab.svg },
    { id: 'settings', label: t.tab.settings },
    { id: 'statistics', label: t.tab.statistics },
    { id: 'legend', label: t.tab.legend },
  ];

  const handleSpeedChange = (speed: number) => {
    if (sceneManagers?.playbackController) {
      sceneManagers.playbackController.setSpeed(speed);
    }
  };

  return (
    <div className="fixed left-5 top-5 w-[360px] max-h-[calc(100vh-40px)] panel z-10 transition-all duration-300">
      <div className="flex items-center justify-between p-3 bg-dark-800/70 border-b border-dark-700 rounded-t-xl">
        <div className="flex items-center gap-2">
          <i className="fas fa-cog text-dark-500 text-xs" />
          <h2 className="text-sm font-semibold text-gray-100">CNC Simulator</h2>
        </div>
        <button
          onClick={togglePanelMinimized}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-dark-700/30 hover:bg-dark-600/50 border border-dark-600 transition-all"
        >
          <i className={`fas fa-chevron-${uiState.isPanelMinimized ? 'down' : 'up'} text-xs text-dark-400`} />
        </button>
      </div>

      {!uiState.isPanelMinimized && (
        <>
          <div className="flex gap-1 p-2 bg-dark-900/60 border-b border-dark-700 overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all
                  ${uiState.activeTab === tab.id
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'bg-transparent text-dark-400 hover:text-dark-300 hover:bg-dark-800/50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin">
            {uiState.activeTab === 'gcode' && sceneManagers && (
              <GCodeTab
                pathRenderer={sceneManagers.pathRenderer}
                sceneManager={sceneManagers.sceneManager}
                toolhead={sceneManagers.toolhead}
              />
            )}
            {uiState.activeTab === 'svg' && (
              <SVGTab onGCodeGenerated={onGCodeGenerated || (() => {})} />
            )}
            {uiState.activeTab === 'settings' && sceneManagers && (
              <SettingsTab
                sceneManager={sceneManagers.sceneManager}
                onSpeedChange={handleSpeedChange}
              />
            )}
            {uiState.activeTab === 'statistics' && <StatisticsTab />}
            {uiState.activeTab === 'legend' && <LegendTab />}
            
            <StatusBar />
          </div>
        </>
      )}
    </div>
  );
}
