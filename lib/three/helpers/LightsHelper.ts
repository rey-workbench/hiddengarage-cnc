import * as THREE from 'three';

export class LightsHelper {
  private lights: THREE.Light[] = [];

  constructor(scene: THREE.Scene) {
    this.setupLights(scene);
  }

  private setupLights(scene: THREE.Scene): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.lights.push(ambientLight);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(1, 1, 1);
    this.lights.push(directionalLight1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-1, -1, -1);
    this.lights.push(directionalLight2);
    scene.add(directionalLight2);
  }

  getLights(): THREE.Light[] {
    return this.lights;
  }

  dispose(): void {
    this.lights.forEach(light => {
      if (light.parent) {
        light.parent.remove(light);
      }
    });
    this.lights = [];
  }
}
