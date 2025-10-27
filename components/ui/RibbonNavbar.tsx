'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useActiveTab } from '@/hooks/useActiveTab';
import { CNCConstants, type TabType } from '@/lib/Constants';

type TabName = TabType;

interface RibbonNavbarProps {
  children: ReactNode;
  sceneManagers?: any;
}

export default function RibbonNavbar({ children }: RibbonNavbarProps) {
  const { activeTab, setActiveTab } = useActiveTab();
  const { tab } = useTranslation();
  const [showContent, setShowContent] = useState(false);
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const navbarRef = useRef<HTMLDivElement>(null);

  // Get tabs from constants and add translations
  const tabs = CNCConstants.tabs.map(t => ({
    ...t,
    label: tab(t.name)
  }));

  // Initialize & show content when tab changes
  useEffect(() => {
    setMounted(true);
    if (activeTab) setShowContent(true);
  }, [activeTab]);

  // Update tab indicator position
  useEffect(() => {
    const tabElement = tabRefs.current[activeTab];
    if (tabElement && mounted) {
      const rect = tabElement.getBoundingClientRect();
      setTabPosition({ left: rect.left, width: rect.width });
    }
  }, [activeTab, mounted]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showContent) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setShowContent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContent]);

  return (
    <div className="ribbon-navbar" ref={navbarRef}>
      {/* Title */}
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

      {/* Tabs */}
      <div className="ribbon-tabs">
        {tabs.map((t) => (
          <button
            key={t.name}
            ref={(el) => { tabRefs.current[t.name] = el; }}
            className={`ribbon-tab ${activeTab === t.name ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(t.name);
              setShowContent(true);
            }}
          >
            <i className={`${t.icon} text-sm`} />
            <span>{mounted ? t.label : ''}</span>
          </button>
        ))}
      </div>

      {/* Content Dropdown */}
      {showContent && (
        <div className="ribbon-content-dropdown" style={{ left: `${tabPosition.left}px` }}>
          <div className="ribbon-content-dropdown-inner">{children}</div>
        </div>
      )}
    </div>
  );
}
