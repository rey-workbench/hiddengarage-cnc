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
  const [showContent, setShowContent] = useState(false);
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const navbarRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setShowContent(false);
      }
    };

    if (showContent) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContent]);

  return (
    <div className="ribbon-navbar" ref={navbarRef}>
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
      </div>

      {/* Ribbon Tabs */}
      <div className="ribbon-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            onClick={() => {
              if (uiState.activeTab === tab.id) {
                setShowContent(!showContent);
              } else {
                setActiveTab(tab.id);
                setShowContent(true);
              }
            }}
            className={`ribbon-tab ${uiState.activeTab === tab.id ? 'active' : ''}`}
          >
            <i className={`${tab.icon} text-sm`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Ribbon Content Dropdown */}
      {showContent && uiState.activeTab && (
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
