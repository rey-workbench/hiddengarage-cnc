'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSettings } from '@/contexts/SettingsContext';
import { TRANSLATIONS } from '@/lib/Constants';

interface RibbonNavbarProps {
  children: ReactNode;
  sceneManagers?: any;
}

type TabRoute = '/gcode' | '/image' | '/settings' | '/statistics' | '/legend';

export default function RibbonNavbar({ children, sceneManagers }: RibbonNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();
  const [showContent, setShowContent] = useState(false);
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const navbarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto show content when on any tab route
  useEffect(() => {
    if (pathname && pathname !== '/') {
      setShowContent(true);
    }
  }, [pathname]);

  const t = TRANSLATIONS[settings.language];

  const tabs: { route: TabRoute; label: string; icon: string }[] = [
    { route: '/gcode', label: t.tab.gcode, icon: 'fas fa-code' },
    { route: '/image', label: t.tab.image, icon: 'fas fa-image' },
    { route: '/settings', label: t.tab.settings, icon: 'fas fa-cog' },
    { route: '/statistics', label: t.tab.statistics, icon: 'fas fa-chart-bar' },
    { route: '/legend', label: t.tab.legend, icon: 'fas fa-palette' },
  ];

  useEffect(() => {
    if (pathname && tabRefs.current[pathname]) {
      const tabElement = tabRefs.current[pathname];
      if (tabElement) {
        const rect = tabElement.getBoundingClientRect();
        setTabPosition({ left: rect.left, width: rect.width });
      }
    }
  }, [pathname]);

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
          <Link
            key={tab.route}
            href={tab.route}
            prefetch={true}
            onClick={(e) => {
              e.preventDefault();
              if (pathname === tab.route) {
                setShowContent(!showContent);
              } else {
                setShowContent(true);
                router.push(tab.route);
              }
            }}
            ref={(el) => { tabRefs.current[tab.route] = el as any; }}
            className={`ribbon-tab ${pathname === tab.route ? 'active' : ''}`}
          >
            <i className={`${tab.icon} text-sm`} />
            <span>{mounted ? tab.label : ''}</span>
          </Link>
        ))}
      </div>

      {/* Ribbon Content Dropdown */}
      {showContent && pathname && pathname !== '/' && (
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
