import * as THREE from 'three';
import type { GCodeSegment } from '@/lib/Constants';
import { SegmentType, ColorMode } from '@/lib/Constants';
import { CNCConstants } from '../Constants';

export class PathRenderer {
  private scene: THREE.Scene;
  private segments: GCodeSegment[] = [];
  private pathGroup: THREE.Group;
  private colorMode: ColorMode = ColorMode.Default;

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
    if (this.colorMode === ColorMode.Default) {
      return this.getDefaultColor(segment);
    } else if (this.colorMode === ColorMode.Axis) {
      return this.getAxisColor(segment);
    } else if (this.colorMode === ColorMode.Progressive) {
      return this.getProgressiveColor(segment, index);
    }
    
    return new THREE.Color(CNCConstants.colors.linearCut);
  }

  private getDefaultColor(segment: GCodeSegment): THREE.Color {
    switch (segment.type) {
      case SegmentType.Rapid:
        return new THREE.Color(CNCConstants.colors.rapid);
      case SegmentType.Linear:
        return new THREE.Color(CNCConstants.colors.linearCut);
      case SegmentType.ArcCW:
      case SegmentType.ArcCCW:
        return new THREE.Color(CNCConstants.colors.arcCut);
      default:
        return new THREE.Color(CNCConstants.colors.linearCut);
    }
  }

  private getAxisColor(segment: GCodeSegment): THREE.Color {
    const dx = Math.abs(segment.to[0] - segment.from[0]);
    const dy = Math.abs(segment.to[1] - segment.from[1]);
    const dz = Math.abs(segment.to[2] - segment.from[2]);

    if (segment.type === SegmentType.Rapid) {
      return new THREE.Color(CNCConstants.colors.rapid);
    }

    if (dx > dy && dx > dz) {
      return new THREE.Color(CNCConstants.colors.progressiveX);
    } else if (dy > dx && dy > dz) {
      return new THREE.Color(CNCConstants.colors.progressiveY);
    } else if (dz > dx && dz > dy) {
      return new THREE.Color(CNCConstants.colors.axisZ);
    }

    return new THREE.Color(0xffffff);
  }

  private getProgressiveColor(segment: GCodeSegment, index: number): THREE.Color {
    if (segment.type === SegmentType.Rapid) {
      return new THREE.Color(CNCConstants.colors.rapid);
    }

    const progress = index / this.segments.length;
    
    const dx = Math.abs(segment.to[0] - segment.from[0]);
    const dy = Math.abs(segment.to[1] - segment.from[1]);

    const baseColor = new THREE.Color(CNCConstants.colors.progressiveStart);
    
    let targetColor: THREE.Color;
    if (dx > dy) {
      targetColor = new THREE.Color(CNCConstants.colors.progressiveX);
    } else {
      targetColor = new THREE.Color(CNCConstants.colors.progressiveY);
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
