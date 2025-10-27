'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import PlaybackPanel from '@/components/panels/PlaybackPanel';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import StatusBar from '@/components/ui/StatusBar';
import RibbonNavbar from '@/components/ui/RibbonNavbar';

const ThreeViewer = dynamic(() => import('@/components/viewer/ThreeViewer'), {
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

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sceneManagers, setSceneManagers } = useWorkspace();

  const handleInitialized = useCallback((managers: any) => {
    setSceneManagers(managers);
    console.log('✓ 3D scene initialized and ready');
  }, [setSceneManagers]);

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col">
      <RibbonNavbar sceneManagers={sceneManagers}>
        {children}
      </RibbonNavbar>
      
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
