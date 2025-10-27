'use client';

import { useEffect, useRef, useState } from 'react';
import { SceneManager } from '@/lib/three/SceneManager';
import { Toolhead } from '@/lib/three/Toolhead';
import { PathRenderer } from '@/lib/three/PathRenderer';
import { PlaybackController } from '@/lib/three/PlaybackController';
import type { CameraView } from '@/types';

export function useThreeScene(containerRef: React.RefObject<HTMLDivElement>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const toolheadRef = useRef<Toolhead | null>(null);
  const pathRendererRef = useRef<PathRenderer | null>(null);
  const playbackControllerRef = useRef<PlaybackController | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    const sceneManager = new SceneManager(container);
    const toolhead = new Toolhead(sceneManager.getScene());
    const pathRenderer = new PathRenderer(sceneManager.getScene());
    const playbackController = new PlaybackController(toolhead, pathRenderer);

    sceneManagerRef.current = sceneManager;
    toolheadRef.current = toolhead;
    pathRendererRef.current = pathRenderer;
    playbackControllerRef.current = playbackController;

    const animate = () => {
      sceneManager.updateControls();
      playbackController.update();
      sceneManager.render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    setIsInitialized(true);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      playbackController.pause();
      toolhead.dispose();
      pathRenderer.dispose();
      sceneManager.dispose();
      
      sceneManagerRef.current = null;
      toolheadRef.current = null;
      pathRendererRef.current = null;
      playbackControllerRef.current = null;
    };
  }, [containerRef]);

  return {
    isInitialized,
    sceneManager: sceneManagerRef.current,
    toolhead: toolheadRef.current,
    pathRenderer: pathRendererRef.current,
    playbackController: playbackControllerRef.current,
  };
}

export function useSceneControls(sceneManager: SceneManager | null) {
  const setCameraView = (view: CameraView) => {
    if (sceneManager) {
      sceneManager.setCameraView(view);
    }
  };

  const toggleGrid = (visible: boolean) => {
    if (sceneManager) {
      sceneManager.toggleGrid(visible);
    }
  };

  const toggleAxes = (visible: boolean) => {
    if (sceneManager) {
      sceneManager.toggleAxes(visible);
    }
  };

  return {
    setCameraView,
    toggleGrid,
    toggleAxes,
  };
}
