// ============================================
// TYPES & INTERFACES
// ============================================

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export enum SegmentType {
  Rapid = 'rapid',
  Linear = 'linear',
  ArcCW = 'arc_cw',
  ArcCCW = 'arc_ccw',
}

export enum ColorMode {
  Default = 'default',
  Axis = 'axis',
  Progressive = 'progressive',
}

export enum CameraView {
  Top = 'top',
  Front = 'front',
  Side = 'side',
  Isometric = 'isometric',
}

export interface GCodeSegment {
  type: SegmentType;
  from: [number, number, number];
  to: [number, number, number];
  feed?: number;
  spindle?: number;
  center?: [number, number, number];
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  clockwise?: boolean;
}

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface PathStatistics {
  totalDistance: number;
  rapidDistance: number;
  cutDistance: number;
  estimatedTime: number;
  lineCount: number;
}

export interface ParseResult {
  segments: GCodeSegment[];
  bbox: BoundingBox;
  stats: PathStatistics;
}

export interface ToolPosition {
  x: number;
  y: number;
  z: number;
  feed: number;
  spindle: 'ON' | 'OFF';
}

export interface SimulationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSegmentIndex: number;
  progress: number;
  speed: number;
}

export interface SVGConversionOptions {
  scale: number;
  feedRate: number;
  cutDepth: number;
  safeZ: number;
}

export interface Settings {
  playbackSpeed: number;
  arcSegments: number;
  colorMode: ColorMode;
  showGrid: boolean;
  showAxes: boolean;
  showToolhead: boolean;
  toolheadSize: number;
  language: 'en' | 'id';
}

export type TabType = 'gcode' | 'image' | 'settings' | 'statistics' | 'legend';

export interface PanelState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
}

export interface UIState {
  activeTab: TabType;
  isPanelMinimized: boolean;
  isPlaybackMinimized: boolean;
  statusMessage: string;
  statusType: 'idle' | 'success' | 'error' | 'warning' | 'info';
  isLoading: boolean;
  loadingMessage: string;
  controlPanelState: PanelState;
  playbackPanelState: PanelState;
}

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

export const CNCConstants = {
  defaults: {
    feedRate: 600,
    spindleSpeed: 12000,
    arcSegments: 60,
    safeZ: 5,
    cutDepth: -2,
    playbackSpeed: 1,
    toolheadSize: 1,
    toolheadAutoHideSize: 500,
    largeFileWarning: 50000,
    veryLargeFileWarning: 100000,
  },
  tabs: [
    { name: 'gcode' as const, icon: 'fas fa-code' },
    { name: 'image' as const, icon: 'fas fa-image' },
    { name: 'settings' as const, icon: 'fas fa-cog' },
    { name: 'statistics' as const, icon: 'fas fa-chart-bar' },
    { name: 'legend' as const, icon: 'fas fa-palette' },
  ],
  colors: {
    rapid: 0xffd166,
    linearCut: 0xff0000,
    arcCut: 0x00ff00,
    toolhead: 0xff3333,
    grid: 0x444444,
    axisX: 0xff0000,
    axisY: 0x00ff00,
    axisZ: 0x0000ff,
    progressiveStart: 0xffffff,
    progressiveX: 0xff0000,
    progressiveY: 0x00ff00,
  },
  regex: {
    gcodeCommand: /([GMXYZIJKFSR])([-+]?[\d.]+)/gi,
    comment: /;.*$/,
    whitespace: /\s+/g,
  },
};
