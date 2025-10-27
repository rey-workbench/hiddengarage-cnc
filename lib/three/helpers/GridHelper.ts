import * as THREE from 'three';

export class CustomGridHelper {
  private grid: THREE.GridHelper;

  constructor(size: number = 200, divisions: number = 20, color: number = 0x444444) {
    this.grid = new THREE.GridHelper(size, divisions, color, color);
    this.grid.position.y = -0.5;
  }

  getObject(): THREE.GridHelper {
    return this.grid;
  }

  setVisible(visible: boolean): void {
    this.grid.visible = visible;
  }

  updateSize(size: number, divisions: number, color: number = 0x444444): THREE.GridHelper {
    const newGrid = new THREE.GridHelper(size, divisions, color, color);
    
    newGrid.position.copy(this.grid.position);
    newGrid.visible = this.grid.visible;
    
    this.grid = newGrid;
    return newGrid;
  }

  setPosition(x: number, y: number, z: number): void {
    this.grid.position.set(x, y, z);
  }

  dispose(): void {
    this.grid.geometry.dispose();
    if (Array.isArray(this.grid.material)) {
      this.grid.material.forEach(mat => mat.dispose());
    } else {
      this.grid.material.dispose();
    }
  }
}
