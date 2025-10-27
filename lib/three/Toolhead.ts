import * as THREE from 'three';
import { CNCConstants } from '../Constants';
import type { ToolPosition } from '@/lib/Constants';

export class Toolhead {
  private group: THREE.Group;
  private scene: THREE.Scene;
  private currentPosition: [number, number, number] = [0, 0, 0];
  private sizeMultiplier: number = 1;
  private autoScale: number = 1.0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'Toolhead';
    
    this.create();
  }

  private create(): void {
    // Cone geometry - tip pointing down
    const coneGeo = new THREE.ConeGeometry(0.5, 2, 16, 1);
    const coneMat = new THREE.MeshStandardMaterial({
      color: CNCConstants.colors.toolhead,
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    
    // Rotate 180° so tip points down, position at y=1
    cone.rotation.x = Math.PI;
    cone.position.y = 1;
    
    // Wireframe outline
    const wireframeGeo = new THREE.WireframeGeometry(coneGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: CNCConstants.colors.toolhead,
      linewidth: 1,
      transparent: true,
      opacity: 0.5,
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    wireframe.rotation.x = Math.PI;
    wireframe.position.y = 1;
    
    this.group.add(cone);
    this.group.add(wireframe);
    this.group.visible = true;
    this.scene.add(this.group);
  }

  scale(objectSize: number): void {
    let autoScale: number;
    
    if (objectSize < 100) {
      autoScale = objectSize * 0.1;
    } else if (objectSize < 500) {
      autoScale = objectSize * 0.03;
    } else if (objectSize < 5000) {
      autoScale = objectSize * 0.01;
    } else {
      autoScale = Math.log10(objectSize) * 5;
    }
    
    // Clamp scale to min/max values
    autoScale = Math.max(autoScale, 0.5);
    autoScale = Math.min(autoScale, 100);
    
    this.autoScale = autoScale;
    this.applyScale();
    
    console.log('  Toolhead auto-scaled to:', autoScale.toFixed(2) + 'x (object size: ' + objectSize.toFixed(1) + 'mm)');
  }

  setSizeMultiplier(multiplier: number): void {
    this.sizeMultiplier = multiplier;
    this.applyScale();
  }

  private applyScale(): void {
    const finalScale = this.autoScale * this.sizeMultiplier;
    this.group.scale.set(finalScale, finalScale, finalScale);
  }

  autoHideForLargeObject(objectSize: number): boolean {
    if (objectSize > CNCConstants.defaults.toolheadAutoHideSize && this.group.visible) {
      this.group.visible = false;
      console.log('  ⚠️ Toolhead auto-hidden (object too large). Enable in Settings tab if needed.');
      return true;
    }
    return false;
  }

  setPosition(position: ToolPosition): void {
    // Convert G-code coordinates (X, Y, Z) to Three.js coordinates (X, Z, Y)
    // Original: group.position.set(pos[0], pos[2], pos[1])
    this.group.position.set(position.x, position.z, position.y);
    this.currentPosition = [position.x, position.y, position.z];
  }

  setPositionXYZ(x: number, y: number, z: number): void {
    // Convert G-code coordinates (X, Y, Z) to Three.js coordinates (X, Z, Y)
    this.group.position.set(x, z, y);
    this.currentPosition = [x, y, z];
  }

  getPosition(): [number, number, number] {
    return this.currentPosition;
  }

  setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  isVisible(): boolean {
    return this.group.visible;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  dispose(): void {
    this.scene.remove(this.group);
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
