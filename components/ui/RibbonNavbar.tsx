'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useActiveTab } from '@/hooks/useActiveTab';
import { useSettings } from '@/contexts/SettingsContext';
import { CNCConstants, type TabType } from '@/lib/Constants';

type TabName = TabType;

interface RibbonNavbarProps {
  children: ReactNode;
  sceneManagers?: any;
}

export default function RibbonNavbar({ children }: RibbonNavbarProps) {
  const { activeTab, setActiveTab } = useActiveTab();
  const { tab } = useTranslation();
  const { settings } = useSettings();
  const [showContent, setShowContent] = useState(false);
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const navbarRef = useRef<HTMLDivElement>(null);

  const tabs = CNCConstants.tabs.map(t => ({
    ...t,
    label: tab(t.name)
  }));

  useEffect(() => {
    setMounted(true);
    if (activeTab) setShowContent(true);
  }, [activeTab]);

  useEffect(() => {
    const tabElement = tabRefs.current[activeTab];
    const navbarElement = navbarRef.current;
    
    if (tabElement && navbarElement && mounted) {
      const zoom = parseFloat(document.body.style.zoom || '1');
      
      const navbarRect = navbarElement.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();
      
      const relativeLeft = (tabRect.left - navbarRect.left) / zoom;
      const width = tabRect.width / zoom;
      
      setTabPosition({ left: relativeLeft, width });
    }
  }, [activeTab, mounted, settings.uiSize]);

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
      <div className="ribbon-titlebar">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded blur-sm group-hover:bg-primary-500/30 transition-all duration-300" />
              <i className="fas fa-cube text-primary-400 text-base relative transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h1 className="text-xs font-bold text-gray-100 tracking-tight">CNC Simulator</h1>
          </div>
          <div className="h-3 w-px bg-gradient-to-b from-transparent via-dark-500 to-transparent" />
          <div className="flex items-center gap-1.5 text-[11px] text-dark-400">
            <i className="fas fa-code text-primary-500/60 text-[9px]" />
            <span>G-Code Visualizer</span>
          </div>
        </div>
        <button
          className="ribbon-collapse-btn"
          onClick={() => setShowContent(!showContent)}
          title={showContent ? 'Hide Panel' : 'Show Panel'}
        >
          <i className={`fas fa-chevron-${showContent ? 'up' : 'down'} text-[10px] transition-transform duration-200`} />
        </button>
      </div>

      <div className="ribbon-tabs relative">
        {mounted && activeTab && (
          <div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            style={{
              left: `${tabPosition.left}px`,
              width: `${tabPosition.width}px`,
            }}
          />
        )}

        {tabs.map((t) => (
          <button
            key={t.name}
            ref={(el) => { tabRefs.current[t.name] = el; }}
            className={`ribbon-tab ${activeTab === t.name ? 'active' : ''} ${hoveredTab === t.name ? 'hovered' : ''}`}
            onClick={() => {
              setActiveTab(t.name);
              setShowContent(true);
            }}
            onMouseEnter={() => setHoveredTab(t.name)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <div className="relative flex items-center gap-2">
              <i className={`${t.icon} text-sm transition-all duration-200 ${activeTab === t.name ? 'scale-110' : ''}`} />
              <span className="font-medium">{mounted ? t.label : ''}</span>
              {activeTab === t.name && (
                <div className="absolute -inset-1 bg-primary-500/5 rounded-md -z-10" />
              )}
            </div>
          </button>
        ))}
      </div>

      {showContent && (
        <div className="ribbon-content-dropdown" style={{ left: `${tabPosition.left}px` }}>
          <div className="ribbon-content-dropdown-inner">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
