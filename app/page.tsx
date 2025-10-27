'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useActiveTab } from '@/hooks/useActiveTab';
import { useUIScale } from '@/hooks/useUIScale';
import PlaybackPanel from '@/components/panels/PlaybackPanel';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import StatusBar from '@/components/ui/StatusBar';
import RibbonNavbar from '@/components/ui/RibbonNavbar';

// Lazy load components
const GCodeTab = dynamic(() => import('@/components/tabs/GCodeTab'), { ssr: false });
const ImageTab = dynamic(() => import('@/components/tabs/ImageTab'), { ssr: false });
const ViewTab = dynamic(() => import('@/components/tabs/ViewTab'), { ssr: false });
const SettingsTab = dynamic(() => import('@/components/tabs/SettingsTab'), { ssr: false });
const StatisticsTab = dynamic(() => import('@/components/tabs/StatisticsTab'), { ssr: false });
const LegendTab = dynamic(() => import('@/components/tabs/LegendTab'), { ssr: false });
const ThreeViewer = dynamic(() => import('@/components/viewer/ThreeViewer'), { ssr: false });

export default function Home() {
  const { sceneManagers, setSceneManagers } = useWorkspace();
  const { activeTab } = useActiveTab();
  
  // Apply UI scaling
  useUIScale();

  const handleInitialized = useCallback((managers: any) => {
    setSceneManagers(managers);
  }, [setSceneManagers]);

  // Render active tab content
  const renderTab = () => {
    if (!sceneManagers) return null;

    const props = {
      gcode: { pathRenderer: sceneManagers.pathRenderer, sceneManager: sceneManagers.sceneManager, toolhead: sceneManagers.toolhead },
      image: { onGCodeGenerated: () => {} },
      view: { sceneManager: sceneManagers.sceneManager },
      settings: { sceneManager: sceneManagers.sceneManager },
      statistics: {},
      legend: {}
    };

    const components = {
      gcode: GCodeTab,
      image: ImageTab,
      view: ViewTab,
      settings: SettingsTab,
      statistics: StatisticsTab,
      legend: LegendTab
    };

    const Component = components[activeTab];
    if (!Component) {
      console.error(`Component not found for tab: ${activeTab}`);
      return <div>Component not found for tab: {activeTab}</div>;
    }
    return <Component {...(props[activeTab] as any)} />;
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Navbar - not affected by zoom */}
      <RibbonNavbar sceneManagers={sceneManagers}>
        {renderTab()}
      </RibbonNavbar>
      
      {/* Main content - affected by zoom */}
      <div className="main-content flex-1 relative" style={{ marginTop: 'var(--ribbon-height, 0px)' }}>
        <ThreeViewer onInitialized={handleInitialized} />
        {sceneManagers && <PlaybackPanel playbackController={sceneManagers.playbackController} />}
        <StatusBar />
        <LoadingOverlay />
      </div>
    </div>
  );
}
