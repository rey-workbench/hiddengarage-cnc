import { CNCConstants } from './Constants';
import type { 
  GCodeSegment, 
  BoundingBox, 
  PathStatistics, 
  ParseResult,
  Point3D 
} from '@/lib/Constants';
import { SegmentType } from '@/lib/Constants';

interface ParserState {
  x: number;
  y: number;
  z: number;
  feedRate: number;
  spindleSpeed: number;
  isAbsolute: boolean;
  isMetric: boolean;
  spindleOn: boolean;
}

export class GCodeParser {
  private state: ParserState;
  private segments: GCodeSegment[];
  private bbox: BoundingBox;
  private stats: PathStatistics;

  constructor() {
    this.state = {
      x: 0,
      y: 0,
      z: 0,
      feedRate: CNCConstants.defaults.feedRate,
      spindleSpeed: CNCConstants.defaults.spindleSpeed,
      isAbsolute: true,
      isMetric: true,
      spindleOn: false,
    };

    this.segments = [];
    this.bbox = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
      minZ: Infinity,
      maxZ: -Infinity,
    };

    this.stats = {
      totalDistance: 0,
      rapidDistance: 0,
      cutDistance: 0,
      estimatedTime: 0,
      lineCount: 0,
    };
  }

  parse(gcodeText: string, options: { arcSegments?: number } = {}): ParseResult {
    const arcSegments = options.arcSegments || CNCConstants.defaults.arcSegments;
    
    this.resetState();
    
    const lines = gcodeText.split('\n');
    
    for (const line of lines) {
      this.stats.lineCount++;
      this.parseLine(line.trim(), arcSegments);
    }

    this.calculateStatistics();

    return {
      segments: this.segments,
      bbox: this.bbox,
      stats: this.stats,
    };
  }

  private resetState(): void {
    this.state = {
      x: 0,
      y: 0,
      z: 0,
      feedRate: CNCConstants.defaults.feedRate,
      spindleSpeed: CNCConstants.defaults.spindleSpeed,
      isAbsolute: true,
      isMetric: true,
      spindleOn: false,
    };

    this.segments = [];
    this.bbox = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
      minZ: Infinity,
      maxZ: -Infinity,
    };

    this.stats = {
      totalDistance: 0,
      rapidDistance: 0,
      cutDistance: 0,
      estimatedTime: 0,
      lineCount: 0,
    };
  }

  private parseLine(line: string, arcSegments: number): void {
    if (!line || line.startsWith(';') || line.startsWith('(')) return;

    const cleanLine = line.replace(CNCConstants.regex.comment, '').trim();
    if (!cleanLine) return;

    const commands = this.extractCommands(cleanLine);
    this.executeCommands(commands, arcSegments);
  }

  private extractCommands(line: string): Map<string, number> {
    const commands = new Map<string, number>();
    const matches = line.matchAll(CNCConstants.regex.gcodeCommand);

    for (const match of matches) {
      const letter = match[1].toUpperCase();
      const value = parseFloat(match[2]);
      commands.set(letter, value);
    }

    return commands;
  }

  private executeCommands(commands: Map<string, number>, arcSegments: number): void {
    const gCode = commands.get('G');
    const mCode = commands.get('M');

    if (gCode !== undefined) {
      this.handleGCode(gCode, commands, arcSegments);
    }

    if (mCode !== undefined) {
      this.handleMCode(mCode, commands);
    }

    if (commands.has('F')) {
      this.state.feedRate = commands.get('F')!;
    }

    if (commands.has('S')) {
      this.state.spindleSpeed = commands.get('S')!;
    }
  }

  private handleGCode(code: number, commands: Map<string, number>, arcSegments: number): void {
    switch (code) {
      case 0:
        this.handleRapid(commands);
        break;
      case 1:
        this.handleLinearMove(commands);
        break;
      case 2:
        this.handleArc(commands, true, arcSegments);
        break;
      case 3:
        this.handleArc(commands, false, arcSegments);
        break;
      case 17:
      case 18:
      case 19:
        break;
      case 20:
        this.state.isMetric = false;
        break;
      case 21:
        this.state.isMetric = true;
        break;
      case 90:
        this.state.isAbsolute = true;
        break;
      case 91:
        this.state.isAbsolute = false;
        break;
    }
  }

  private handleMCode(code: number, commands: Map<string, number>): void {
    switch (code) {
      case 3:
      case 4:
        this.state.spindleOn = true;
        break;
      case 5:
        this.state.spindleOn = false;
        break;
      case 30:
      case 2:
        break;
    }
  }

  private handleRapid(commands: Map<string, number>): void {
    const newPos = this.getNewPosition(commands);
    
    this.segments.push({
      type: SegmentType.Rapid,
      from: [this.state.x, this.state.y, this.state.z],
      to: [newPos.x, newPos.y, newPos.z],
    });

    this.updateBBox(newPos);
    this.updatePosition(newPos);
  }

  private handleLinearMove(commands: Map<string, number>): void {
    const newPos = this.getNewPosition(commands);

    this.segments.push({
      type: SegmentType.Linear,
      from: [this.state.x, this.state.y, this.state.z],
      to: [newPos.x, newPos.y, newPos.z],
      feed: this.state.feedRate,
      spindle: this.state.spindleOn ? this.state.spindleSpeed : 0,
    });

    this.updateBBox(newPos);
    this.updatePosition(newPos);
  }

  private handleArc(commands: Map<string, number>, clockwise: boolean, arcSegments: number): void {
    const newPos = this.getNewPosition(commands);
    const i = commands.get('I') || 0;
    const j = commands.get('J') || 0;

    const centerX = this.state.x + i;
    const centerY = this.state.y + j;

    const startAngle = Math.atan2(this.state.y - centerY, this.state.x - centerX);
    const endAngle = Math.atan2(newPos.y - centerY, newPos.x - centerX);
    const radius = Math.sqrt(i * i + j * j);

    const arcPoints = this.generateArcPoints(
      { x: centerX, y: centerY, z: this.state.z },
      radius,
      startAngle,
      endAngle,
      clockwise,
      arcSegments,
      newPos.z
    );

    for (let k = 0; k < arcPoints.length - 1; k++) {
      this.segments.push({
        type: clockwise ? SegmentType.ArcCW : SegmentType.ArcCCW,
        from: [arcPoints[k].x, arcPoints[k].y, arcPoints[k].z],
        to: [arcPoints[k + 1].x, arcPoints[k + 1].y, arcPoints[k + 1].z],
        feed: this.state.feedRate,
        spindle: this.state.spindleOn ? this.state.spindleSpeed : 0,
        center: [centerX, centerY, this.state.z],
        radius,
      });

      this.updateBBox(arcPoints[k + 1]);
    }

    this.updatePosition(newPos);
  }

  private generateArcPoints(
    center: Point3D,
    radius: number,
    startAngle: number,
    endAngle: number,
    clockwise: boolean,
    segments: number,
    endZ: number
  ): Point3D[] {
    const points: Point3D[] = [];
    let angle = endAngle - startAngle;

    if (clockwise) {
      if (angle > 0) angle -= 2 * Math.PI;
    } else {
      if (angle < 0) angle += 2 * Math.PI;
    }

    const angleStep = angle / segments;
    const zStep = (endZ - center.z) / segments;

    for (let i = 0; i <= segments; i++) {
      const currentAngle = startAngle + angleStep * i;
      const z = center.z + zStep * i;
      
      points.push({
        x: center.x + radius * Math.cos(currentAngle),
        y: center.y + radius * Math.sin(currentAngle),
        z,
      });
    }

    return points;
  }

  private getNewPosition(commands: Map<string, number>): Point3D {
    let x = this.state.x;
    let y = this.state.y;
    let z = this.state.z;

    if (this.state.isAbsolute) {
      if (commands.has('X')) x = commands.get('X')!;
      if (commands.has('Y')) y = commands.get('Y')!;
      if (commands.has('Z')) z = commands.get('Z')!;
    } else {
      if (commands.has('X')) x += commands.get('X')!;
      if (commands.has('Y')) y += commands.get('Y')!;
      if (commands.has('Z')) z += commands.get('Z')!;
    }

    if (!this.state.isMetric) {
      x *= 25.4;
      y *= 25.4;
      z *= 25.4;
    }

    return { x, y, z };
  }

  private updatePosition(pos: Point3D): void {
    this.state.x = pos.x;
    this.state.y = pos.y;
    this.state.z = pos.z;
  }

  private updateBBox(pos: Point3D): void {
    this.bbox.minX = Math.min(this.bbox.minX, pos.x);
    this.bbox.maxX = Math.max(this.bbox.maxX, pos.x);
    this.bbox.minY = Math.min(this.bbox.minY, pos.y);
    this.bbox.maxY = Math.max(this.bbox.maxY, pos.y);
    this.bbox.minZ = Math.min(this.bbox.minZ, pos.z);
    this.bbox.maxZ = Math.max(this.bbox.maxZ, pos.z);
  }

  private calculateStatistics(): void {
    let totalDistance = 0;
    let rapidDistance = 0;
    let cutDistance = 0;
    let totalTime = 0;

    for (const segment of this.segments) {
      const distance = Math.sqrt(
        Math.pow(segment.to[0] - segment.from[0], 2) +
        Math.pow(segment.to[1] - segment.from[1], 2) +
        Math.pow(segment.to[2] - segment.from[2], 2)
      );

      totalDistance += distance;

      if (segment.type === SegmentType.Rapid) {
        rapidDistance += distance;
        totalTime += distance / 6000;
      } else {
        cutDistance += distance;
        const feed = segment.feed || CNCConstants.defaults.feedRate;
        totalTime += distance / feed;
      }
    }

    this.stats.totalDistance = totalDistance;
    this.stats.rapidDistance = rapidDistance;
    this.stats.cutDistance = cutDistance;
    this.stats.estimatedTime = totalTime * 60;
  }
}
