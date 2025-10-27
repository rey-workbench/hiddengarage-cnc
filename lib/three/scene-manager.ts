import * as THREE from 'three';
import type { BoundingBox } from '@/types';
import { CameraView } from '@/types';
import { CNCConstants } from '../constants';
import { CustomAxesHelper } from './helpers/axes-helper';
import { CustomGridHelper } from './helpers/grid-helper';
import { CameraController } from './helpers/camera-controller';
import { LightsHelper } from './helpers/lights-helper';

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cameraController: CameraController;
  private gridHelper: CustomGridHelper;
  private axesHelper: CustomAxesHelper;
  private lightsHelper: LightsHelper;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    
    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1020);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(0, 0, 0);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Initialize helpers
    this.cameraController = new CameraController(this.camera, this.renderer.domElement);
    this.lightsHelper = new LightsHelper(this.scene);
    this.gridHelper = new CustomGridHelper(200, 20, CNCConstants.COLORS.GRID);
    this.axesHelper = new CustomAxesHelper(10000);
    
    // Add helpers to scene
    this.scene.add(this.gridHelper.getObject());
    this.scene.add(this.axesHelper.getObject());

    this.setupWindowResize();
  }



  private setupWindowResize(): void {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    });
  }

  adjustCameraToFitBBox(bbox: BoundingBox): number {
    // Adjust camera using camera controller
    const maxSize = this.cameraController.adjustToFitBBox(bbox);
    
    // Update grid size and position based on bounding box
    const sizeX = bbox.maxX - bbox.minX;
    const sizeY = bbox.maxY - bbox.minY;
    const sizeZ = bbox.maxZ - bbox.minZ;
    
    const centerX = (bbox.maxX + bbox.minX) / 2;
    const centerY = (bbox.maxY + bbox.minY) / 2;
    const centerZ = (bbox.maxZ + bbox.minZ) / 2;
    
    // Convert to Three.js space
    const centerThreeX = centerX;
    const centerThreeY = centerZ;
    const centerThreeZ = centerY;
    
    // Update grid
    const gridSize = Math.ceil(maxSize / 10) * 10;
    const divisions = Math.max(10, Math.ceil(gridSize / 10));
    
    this.scene.remove(this.gridHelper.getObject());
    const newGrid = this.gridHelper.updateSize(gridSize, divisions, CNCConstants.COLORS.GRID);
    newGrid.position.set(centerThreeX, centerThreeY - sizeZ / 2, centerThreeZ);
    this.scene.add(newGrid);

    return maxSize;
  }

  setCameraView(view: CameraView): void {
    this.cameraController.setCameraView(view);
  }

  toggleGrid(visible: boolean): void {
    this.gridHelper.setVisible(visible);
  }

  toggleAxes(visible: boolean): void {
    this.axesHelper.setVisible(visible);
  }

  updateControls(): void {
    this.cameraController.update();
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  dispose(): void {
    window.removeEventListener('resize', () => {});
    
    // Dispose helpers
    this.cameraController.dispose();
    this.gridHelper.dispose();
    this.axesHelper.dispose();
    this.lightsHelper.dispose();
    
    // Dispose renderer
    this.renderer.dispose();
    
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
