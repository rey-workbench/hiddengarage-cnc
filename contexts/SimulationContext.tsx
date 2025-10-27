'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import type {
  GCodeSegment,
  BoundingBox,
  PathStatistics,
  ParseResult,
  ToolPosition,
  SimulationState,
} from '@/lib/Constants';
import { GCodeParser } from '@/lib/GcodeParser';

interface SimulationContextType {
  segments: GCodeSegment[];
  bbox: BoundingBox | null;
  stats: PathStatistics | null;
  toolPosition: ToolPosition;
  simulationState: SimulationState;
  parseGCode: (gcodeText: string, options?: { arcSegments?: number }) => ParseResult;
  updateToolPosition: (position: ToolPosition) => void;
  updateSimulationState: (state: SimulationState) => void;
  reset: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [segments, setSegments] = useState<GCodeSegment[]>([]);
  const [bbox, setBBox] = useState<BoundingBox | null>(null);
  const [stats, setStats] = useState<PathStatistics | null>(null);
  const [toolPosition, setToolPosition] = useState<ToolPosition>({
    x: 0,
    y: 0,
    z: 0,
    feed: 0,
    spindle: 'OFF',
  });
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isPlaying: false,
    isPaused: false,
    currentSegmentIndex: 0,
    progress: 0,
    speed: 1,
  });

  const parserRef = useRef<GCodeParser>(new GCodeParser());

  const parseGCode = useCallback((gcodeText: string, options?: { arcSegments?: number }): ParseResult => {
    const result = parserRef.current.parse(gcodeText, options);
    
    setSegments(result.segments);
    setBBox(result.bbox);
    setStats(result.stats);
    
    return result;
  }, []);


  const updateToolPosition = useCallback((position: ToolPosition) => {
    setToolPosition(position);
  }, []);

  const updateSimulationState = useCallback((state: SimulationState) => {
    setSimulationState(state);
  }, []);

  const reset = useCallback(() => {
    setSegments([]);
    setBBox(null);
    setStats(null);
    setToolPosition({
      x: 0,
      y: 0,
      z: 0,
      feed: 0,
      spindle: 'OFF',
    });
    setSimulationState({
      isPlaying: false,
      isPaused: false,
      currentSegmentIndex: 0,
      progress: 0,
      speed: 1,
    });
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        segments,
        bbox,
        stats,
        toolPosition,
        simulationState,
        parseGCode,
        updateToolPosition,
        updateSimulationState,
        reset,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
}