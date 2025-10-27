import type { GCodeSegment, ToolPosition, SimulationState } from '@/lib/Constants';
import { Toolhead } from './Toolhead';
import { PathRenderer } from './PathRenderer';

export class PlaybackController {
  private segments: GCodeSegment[] = [];
  private currentSegmentIndex: number = 0;
  private isPlaying: boolean = false;
  private speed: number = 1;
  private toolhead: Toolhead;
  private pathRenderer: PathRenderer;
  private lastUpdateTime: number = 0;
  private segmentProgress: number = 0;

  public onPositionUpdate?: (position: ToolPosition) => void;
  public onPlaybackComplete?: () => void;
  public onStateChange?: (state: SimulationState) => void;

  constructor(toolhead: Toolhead, pathRenderer: PathRenderer) {
    this.toolhead = toolhead;
    this.pathRenderer = pathRenderer;
  }

  setSegments(segments: GCodeSegment[]): void {
    this.segments = segments;
    this.reset();
  }

  play(): void {
    if (this.segments.length === 0) return;
    
    this.isPlaying = true;
    this.lastUpdateTime = performance.now();
    this.emitStateChange();
  }

  pause(): void {
    this.isPlaying = false;
    this.emitStateChange();
  }

  reset(): void {
    this.isPlaying = false;
    this.currentSegmentIndex = 0;
    this.segmentProgress = 0;
    
    if (this.segments.length > 0) {
      const firstSegment = this.segments[0];
      this.toolhead.setPositionXYZ(
        firstSegment.from[0],
        firstSegment.from[1],
        firstSegment.from[2]
      );
      
      this.emitPositionUpdate(firstSegment.from, firstSegment.feed);
    } else {
      this.toolhead.setPositionXYZ(0, 0, 0);
      this.emitPositionUpdate([0, 0, 0], 0);
    }
    
    // Reset progressive trailing colors
    this.pathRenderer.resetProgressiveTrailing();
    
    this.emitStateChange();
  }

  setSpeed(multiplier: number): void {
    this.speed = multiplier;
  }

  update(): void {
    if (!this.isPlaying || this.segments.length === 0) return;

    if (this.currentSegmentIndex >= this.segments.length) {
      this.isPlaying = false;
      if (this.onPlaybackComplete) {
        this.onPlaybackComplete();
      }
      this.emitStateChange();
      return;
    }

    const segment = this.segments[this.currentSegmentIndex];
    const from = segment.from;
    const to = segment.to;
    
    // Calculate distance
    const dist = Math.hypot(
      to[0] - from[0],
      to[1] - from[1],
      to[2] - from[2]
    );
    
    // Calculate speed (same as original)
    const feedRate = segment.feed || 600;
    const mmPerSec = (feedRate / 60.0) * this.speed;
    const step = mmPerSec * (1 / 60); // 60 FPS
    
    const progressIncrement = step / Math.max(dist, 1e-6);
    this.segmentProgress += progressIncrement;
    
    // Clamp progress
    this.segmentProgress = Math.min(1, Math.max(0, this.segmentProgress));
    
    if (this.segmentProgress >= 1) {
      // Segment complete
      this.toolhead.setPositionXYZ(to[0], to[1], to[2]);
      
      this.currentSegmentIndex++;
      this.segmentProgress = 0;
      
      // Update progressive trailing colors when segment changes
      this.pathRenderer.updateProgressiveTrailing(this.currentSegmentIndex);
      
      if (this.currentSegmentIndex >= this.segments.length) {
        this.isPlaying = false;
        if (this.onPlaybackComplete) {
          this.onPlaybackComplete();
        }
      }
    } else {
      // Interpolate position
      const nx = from[0] + (to[0] - from[0]) * this.segmentProgress;
      const ny = from[1] + (to[1] - from[1]) * this.segmentProgress;
      const nz = from[2] + (to[2] - from[2]) * this.segmentProgress;
      this.toolhead.setPositionXYZ(nx, ny, nz);
    }
    
    // Update position callback
    if (this.onPositionUpdate) {
      const pos = this.toolhead.getPosition();
      this.onPositionUpdate({
        x: pos[0],
        y: pos[1],
        z: pos[2],
        feed: feedRate,
        spindle: segment.spindle ? 'ON' : 'OFF',
      });
    }

    this.emitStateChange();
  }

  private calculateSegmentLength(segment: GCodeSegment): number {
    const dx = segment.to[0] - segment.from[0];
    const dy = segment.to[1] - segment.from[1];
    const dz = segment.to[2] - segment.from[2];
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
  }

  private interpolatePosition(segment: GCodeSegment, progress: number): [number, number, number] {
    const x = segment.from[0] + (segment.to[0] - segment.from[0]) * progress;
    const y = segment.from[1] + (segment.to[1] - segment.from[1]) * progress;
    const z = segment.from[2] + (segment.to[2] - segment.from[2]) * progress;
    
    return [x, y, z];
  }

  private updateToolheadPosition(position: [number, number, number]): void {
    this.toolhead.setPositionXYZ(position[0], position[1], position[2]);
  }

  private emitPositionUpdate(position: [number, number, number], feed?: number): void {
    if (this.onPositionUpdate) {
      const currentSegment = this.segments[this.currentSegmentIndex];
      
      this.onPositionUpdate({
        x: position[0],
        y: position[1],
        z: position[2],
        feed: feed || 0,
        spindle: currentSegment?.spindle ? 'ON' : 'OFF',
      });
    }
  }

  private emitStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        isPaused: !this.isPlaying && this.currentSegmentIndex > 0,
        currentSegmentIndex: this.currentSegmentIndex,
        progress: this.segments.length > 0 ? this.currentSegmentIndex / this.segments.length : 0,
        speed: this.speed,
      });
    }
  }

  getState(): SimulationState {
    return {
      isPlaying: this.isPlaying,
      isPaused: !this.isPlaying && this.currentSegmentIndex > 0,
      currentSegmentIndex: this.currentSegmentIndex,
      progress: this.segments.length > 0 ? this.currentSegmentIndex / this.segments.length : 0,
      speed: this.speed,
    };
  }
}
