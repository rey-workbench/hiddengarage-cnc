'use client';

import { useEffect, useCallback } from 'react';
import type { PlaybackController } from '@/lib/three/playback-controller';
import { useSimulation } from '@/contexts/simulation-context';
import type { GCodeSegment } from '@/types';

export function usePlayback(
  playbackController: PlaybackController | null,
  segments: GCodeSegment[]
) {
  const { updateToolPosition, updateSimulationState } = useSimulation();

  useEffect(() => {
    if (!playbackController) return;

    playbackController.onPositionUpdate = (position) => {
      updateToolPosition(position);
    };

    playbackController.onStateChange = (state) => {
      updateSimulationState(state);
    };

    playbackController.onPlaybackComplete = () => {
      console.log('Playback completed');
    };

    return () => {
      playbackController.onPositionUpdate = undefined;
      playbackController.onStateChange = undefined;
      playbackController.onPlaybackComplete = undefined;
    };
  }, [playbackController, updateToolPosition, updateSimulationState]);

  useEffect(() => {
    if (playbackController && segments.length > 0) {
      playbackController.setSegments(segments);
    }
  }, [playbackController, segments]);

  const play = useCallback(() => {
    if (playbackController) {
      playbackController.play();
    }
  }, [playbackController]);

  const pause = useCallback(() => {
    if (playbackController) {
      playbackController.pause();
    }
  }, [playbackController]);

  const reset = useCallback(() => {
    if (playbackController) {
      playbackController.reset();
    }
  }, [playbackController]);

  const setSpeed = useCallback((speed: number) => {
    if (playbackController) {
      playbackController.setSpeed(speed);
    }
  }, [playbackController]);

  return {
    play,
    pause,
    reset,
    setSpeed,
  };
}
