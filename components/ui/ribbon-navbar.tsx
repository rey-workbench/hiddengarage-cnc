'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useUI } from '@/contexts/ui-context';
import { useSettings } from '@/contexts/settings-context';
import { TRANSLATIONS } from '@/lib/constants';
import type { TabType } from '@/types';

interface RibbonNavbarProps {
  children: ReactNode;
}

export default function RibbonNavbar({ children }: RibbonNavbarProps) {
  const { uiState, setActiveTab } = useUI();
  const { settings } = useSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const t = TRANSLATIONS[settings.language];

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'gcode', label: t.tab.gcode, icon: 'fas fa-code' },
    { id: 'svg', label: t.tab.svg, icon: 'fas fa-vector-square' },
    { id: 'settings', label: t.tab.settings, icon: 'fas fa-cog' },
    { id: 'statistics', label: t.tab.statistics, icon: 'fas fa-chart-bar' },
    { id: 'legend', label: t.tab.legend, icon: 'fas fa-palette' },
  ];

  useEffect(() => {
    if (uiState.activeTab && tabRefs.current[uiState.activeTab]) {
      const tabElement = tabRefs.current[uiState.activeTab];
      if (tabElement) {
        const rect = tabElement.getBoundingClientRect();
        setTabPosition({ left: rect.left, width: rect.width });
      }
    }
  }, [uiState.activeTab]);

  return (
    <div className="ribbon-navbar">
      {/* Title Bar */}
      <div className="ribbon-titlebar">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <i className="fas fa-cube text-primary-400 text-lg" />
            <h1 className="text-sm font-semibold text-gray-100">CNC Simulator</h1>
          </div>
          <div className="text-xs text-dark-400">|</div>
          <div className="text-xs text-dark-400">G-Code Visualizer & SVG Converter</div>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ribbon-collapse-btn"
          title={isCollapsed ? 'Expand Ribbon' : 'Collapse Ribbon'}
        >
          <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'} text-xs`} />
        </button>
      </div>

      {/* Ribbon Tabs */}
      <div className="ribbon-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            onClick={() => {
              setActiveTab(tab.id);
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`ribbon-tab ${uiState.activeTab === tab.id ? 'active' : ''}`}
          >
            <i className={`${tab.icon} text-sm`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Ribbon Content Dropdown */}
      {!isCollapsed && uiState.activeTab && (
        <div 
          className="ribbon-content-dropdown"
          style={{
            left: `${tabPosition.left}px`,
          }}
        >
          <div className="ribbon-content-dropdown-inner">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
