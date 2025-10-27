'use client';

import { useRef, useEffect } from 'react';
import { useThreeScene } from '@/hooks/useThreeScene';
import { useSimulation } from '@/contexts/SimulationContext';
import { useSettings } from '@/contexts/SettingsContext';
import { usePlayback } from '@/hooks/usePlayback';

interface ThreeViewerProps {
  onInitialized?: (managers: {
    sceneManager: any;
    toolhead: any;
    pathRenderer: any;
    playbackController: any;
  }) => void;
}

export default function ThreeViewer({ onInitialized }: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { segments } = useSimulation();
  const { settings } = useSettings();
  
  const { isInitialized, sceneManager, toolhead, pathRenderer, playbackController } =
    useThreeScene(containerRef);

  usePlayback(playbackController, segments);

  useEffect(() => {
    if (isInitialized && sceneManager && toolhead && pathRenderer && playbackController) {
      onInitialized?.({
        sceneManager,
        toolhead,
        pathRenderer,
        playbackController,
      });
    }
  }, [isInitialized, sceneManager, toolhead, pathRenderer, playbackController, onInitialized]);

  useEffect(() => {
    if (toolhead) {
      toolhead.setVisible(settings.showToolhead);
      toolhead.setSizeMultiplier(settings.toolheadSize);
    }
  }, [toolhead, settings.showToolhead, settings.toolheadSize]);

  useEffect(() => {
    if (sceneManager) {
      sceneManager.toggleGrid(settings.showGrid);
      sceneManager.toggleAxes(settings.showAxes);
    }
  }, [sceneManager, settings.showGrid, settings.showAxes]);

  useEffect(() => {
    if (pathRenderer) {
      pathRenderer.setColorMode(settings.colorMode);
    }
  }, [pathRenderer, settings.colorMode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}
