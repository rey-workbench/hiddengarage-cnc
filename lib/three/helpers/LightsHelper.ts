import * as THREE from 'three';

export class LightsHelper {
  private lights: THREE.Light[] = [];

  constructor(scene: THREE.Scene) {
    this.setupLights(scene);
  }

  private setupLights(scene: THREE.Scene): void {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.lights.push(ambientLight);
    scene.add(ambientLight);

    // Directional light from top-right
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(1, 1, 1);
    this.lights.push(directionalLight1);
    scene.add(directionalLight1);

    // Directional light from bottom-left for fill
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
