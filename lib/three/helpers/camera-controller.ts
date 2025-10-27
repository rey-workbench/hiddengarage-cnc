import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { BoundingBox } from '@/types';
import { CameraView } from '@/types';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  constructor(
    camera: THREE.PerspectiveCamera,
    domElement: HTMLElement
  ) {
    this.camera = camera;
    
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false; // Keep panning on XZ plane (grid plane)
    this.controls.minDistance = 1;
    this.controls.maxDistance = 5000;
  }

  adjustToFitBBox(bbox: BoundingBox): number {
    // Remember: G-code coordinates are (X, Y, Z) but stored in Three.js as (X, Z, Y)
    const sizeX = bbox.maxX - bbox.minX;
    const sizeY = bbox.maxY - bbox.minY;
    const sizeZ = bbox.maxZ - bbox.minZ;
    
    // Calculate center in G-code space
    const centerX = (bbox.maxX + bbox.minX) / 2;
    const centerY = (bbox.maxY + bbox.minY) / 2;  // G-code Y
    const centerZ = (bbox.maxZ + bbox.minZ) / 2;  // G-code Z
    
    // Convert to Three.js space: (X, Z, Y) where Three Y is G-code Z
    const centerThreeX = centerX;
    const centerThreeY = centerZ;  // Three.js Y = G-code Z
    const centerThreeZ = centerY;  // Three.js Z = G-code Y

    const maxSize = Math.max(sizeX, sizeY, sizeZ);
    const fitHeightDistance = maxSize / (2 * Math.tan((this.camera.fov * Math.PI) / 360));
    const fitWidthDistance = fitHeightDistance / this.camera.aspect;
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.5;

    this.camera.position.set(
      centerThreeX + distance * 0.7,
      centerThreeY + distance * 0.7,
      centerThreeZ + distance * 0.7
    );

    this.controls.target.set(centerThreeX, centerThreeY, centerThreeZ);
    this.controls.update();

    return maxSize;
  }

  setCameraView(view: CameraView): void {
    const target = this.controls.target.clone();
    const distance = this.camera.position.distanceTo(target);

    let newPosition: THREE.Vector3;

    switch (view) {
      case CameraView.TOP:
        newPosition = new THREE.Vector3(target.x, target.y + distance, target.z);
        break;
      case CameraView.FRONT:
        newPosition = new THREE.Vector3(target.x, target.y, target.z + distance);
        break;
      case CameraView.SIDE:
        newPosition = new THREE.Vector3(target.x + distance, target.y, target.z);
        break;
      case CameraView.ISOMETRIC:
      default:
        newPosition = new THREE.Vector3(
          target.x + distance * 0.7,
          target.y + distance * 0.7,
          target.z + distance * 0.7
        );
        break;
    }

    this.camera.position.copy(newPosition);
    this.camera.lookAt(target);
    this.controls.update();
  }

  getTarget(): THREE.Vector3 {
    return this.controls.target;
  }

  update(): void {
    this.controls.update();
  }

  dispose(): void {
    this.controls.dispose();
  }
}
