'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useUI } from '@/contexts/ui-context';
import ControlPanel from '@/components/panels/control-panel';
import PlaybackPanel from '@/components/panels/playback-panel';
import LoadingOverlay from '@/components/ui/loading-overlay';
import StatusBar from '@/components/ui/status-bar';

const ThreeViewer = dynamic(() => import('@/components/viewer/three-viewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-dark-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <div className="text-gray-100 text-lg font-semibold">Initializing 3D Scene...</div>
      </div>
    </div>
  ),
});

export default function Home() {
  const { setActiveTab } = useUI();
  const [sceneManagers, setSceneManagers] = useState<any>(null);
  const [gcodeForParsing, setGCodeForParsing] = useState<string>('');

  const handleInitialized = useCallback((managers: any) => {
    setSceneManagers(managers);
    console.log('✓ 3D scene initialized and ready');
  }, []);

  const handleSVGGCodeGenerated = useCallback((gcode: string) => {
    setGCodeForParsing(gcode);
    setActiveTab('gcode');
    setTimeout(() => {
      if (sceneManagers) {
        const gcodeArea = document.querySelector('textarea');
        if (gcodeArea) {
          const event = new Event('input', { bubbles: true });
          gcodeArea.dispatchEvent(event);
        }
      }
    }, 100);
  }, [sceneManagers, setActiveTab]);

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col">
      <ControlPanel
        sceneManagers={sceneManagers}
        onGCodeGenerated={handleSVGGCodeGenerated}
      />
      
      <div className="flex-1 relative" style={{ marginTop: 'var(--ribbon-height, 0px)' }}>
        <ThreeViewer onInitialized={handleInitialized} />
        
        {sceneManagers && (
          <PlaybackPanel playbackController={sceneManagers.playbackController} />
        )}

        <StatusBar />
        <LoadingOverlay />

        <div className="fixed bottom-5 left-5 text-xs text-dark-500 font-mono pointer-events-none z-10">
          v1.1.0 | CNC Simulator Next.js
        </div>
      </div>
    </div>
  );
}
