import { Vector3 } from 'three';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export enum SegmentType {
  RAPID = 'rapid',
  LINEAR = 'linear',
  ARC_CW = 'arc_cw',
  ARC_CCW = 'arc_ccw',
}

export enum ColorMode {
  DEFAULT = 'default',
  AXIS = 'axis',
  PROGRESSIVE = 'progressive',
}

export enum CameraView {
  TOP = 'top',
  FRONT = 'front',
  SIDE = 'side',
  ISOMETRIC = 'isometric',
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

export type TabType = 'gcode' | 'svg' | 'settings' | 'statistics' | 'legend';

export interface UIState {
  activeTab: TabType;
  isPanelMinimized: boolean;
  isPlaybackMinimized: boolean;
  statusMessage: string;
  statusType: 'idle' | 'success' | 'error' | 'warning' | 'info';
  isLoading: boolean;
  loadingMessage: string;
}
