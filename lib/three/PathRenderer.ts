import * as THREE from 'three';
import type { GCodeSegment } from '@/types';
import { SegmentType, ColorMode } from '@/types';
import { CNCConstants } from '../Constants';

export class PathRenderer {
  private scene: THREE.Scene;
  private segments: GCodeSegment[] = [];
  private pathGroup: THREE.Group;
  private colorMode: ColorMode = ColorMode.DEFAULT;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.pathGroup = new THREE.Group();
    scene.add(this.pathGroup);
  }

  setSegments(segments: GCodeSegment[]): void {
    this.segments = segments;
  }

  setColorMode(mode: ColorMode): void {
    this.colorMode = mode;
    this.rebuild();
  }

  buildVisuals(): void {
    this.clearPaths();

    if (this.segments.length === 0) return;

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      
      // Convert G-code coordinates (X, Y, Z) to Three.js coordinates (X, Z, Y)
      // This swaps Y and Z because Three.js uses Y-up while G-code uses Z-up
      positions.push(segment.from[0], segment.from[2], segment.from[1]);
      positions.push(segment.to[0], segment.to[2], segment.to[1]);

      const color = this.getSegmentColor(segment, i);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 2,
    });

    const lines = new THREE.LineSegments(geometry, material);
    this.pathGroup.add(lines);
  }

  private getSegmentColor(segment: GCodeSegment, index: number): THREE.Color {
    if (this.colorMode === ColorMode.DEFAULT) {
      return this.getDefaultColor(segment);
    } else if (this.colorMode === ColorMode.AXIS) {
      return this.getAxisColor(segment);
    } else if (this.colorMode === ColorMode.PROGRESSIVE) {
      return this.getProgressiveColor(segment, index);
    }
    
    return new THREE.Color(CNCConstants.COLORS.LINEAR_CUT);
  }

  private getDefaultColor(segment: GCodeSegment): THREE.Color {
    switch (segment.type) {
      case SegmentType.RAPID:
        return new THREE.Color(CNCConstants.COLORS.RAPID);
      case SegmentType.LINEAR:
        return new THREE.Color(CNCConstants.COLORS.LINEAR_CUT);
      case SegmentType.ARC_CW:
      case SegmentType.ARC_CCW:
        return new THREE.Color(CNCConstants.COLORS.ARC_CUT);
      default:
        return new THREE.Color(CNCConstants.COLORS.LINEAR_CUT);
    }
  }

  private getAxisColor(segment: GCodeSegment): THREE.Color {
    const dx = Math.abs(segment.to[0] - segment.from[0]);
    const dy = Math.abs(segment.to[1] - segment.from[1]);
    const dz = Math.abs(segment.to[2] - segment.from[2]);

    if (segment.type === SegmentType.RAPID) {
      return new THREE.Color(CNCConstants.COLORS.RAPID);
    }

    if (dx > dy && dx > dz) {
      return new THREE.Color(CNCConstants.COLORS.PROGRESSIVE_X);
    } else if (dy > dx && dy > dz) {
      return new THREE.Color(CNCConstants.COLORS.PROGRESSIVE_Y);
    } else if (dz > dx && dz > dy) {
      return new THREE.Color(CNCConstants.COLORS.AXIS_Z);
    }

    return new THREE.Color(0xffffff);
  }

  private getProgressiveColor(segment: GCodeSegment, index: number): THREE.Color {
    if (segment.type === SegmentType.RAPID) {
      return new THREE.Color(CNCConstants.COLORS.RAPID);
    }

    const progress = index / this.segments.length;
    
    const dx = Math.abs(segment.to[0] - segment.from[0]);
    const dy = Math.abs(segment.to[1] - segment.from[1]);

    const baseColor = new THREE.Color(CNCConstants.COLORS.PROGRESSIVE_START);
    
    let targetColor: THREE.Color;
    if (dx > dy) {
      targetColor = new THREE.Color(CNCConstants.COLORS.PROGRESSIVE_X);
    } else {
      targetColor = new THREE.Color(CNCConstants.COLORS.PROGRESSIVE_Y);
    }

    return baseColor.lerp(targetColor, progress);
  }

  clearPaths(): void {
    while (this.pathGroup.children.length > 0) {
      const child = this.pathGroup.children[0];
      this.pathGroup.remove(child);
      
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  }

  private rebuild(): void {
    if (this.segments.length > 0) {
      this.buildVisuals();
    }
  }

  dispose(): void {
    this.clearPaths();
    this.scene.remove(this.pathGroup);
  }
}
