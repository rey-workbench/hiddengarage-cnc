import * as THREE from 'three';

export class CustomAxesHelper {
  private group: THREE.Group;

  constructor(axisLength: number = 10000) {
    this.group = new THREE.Group();
    this.group.name = 'CustomAxes';
    
    const arrowSize = 30;
    const labelDistance = arrowSize + 20;
    
    this.createAxis(
      new THREE.Vector3(axisLength, 0, 0),
      0xff0000,
      'X',
      labelDistance
    );
    
    this.createAxis(
      new THREE.Vector3(0, axisLength, 0),
      0x00ff00,
      'Z',
      labelDistance
    );
    
    this.createAxis(
      new THREE.Vector3(0, 0, axisLength),
      0x0000ff,
      'Y',
      labelDistance
    );
  }

  private createAxis(
    direction: THREE.Vector3,
    color: number,
    label: string,
    labelDistance: number
  ): void {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      direction,
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color,
      linewidth: 2,
      opacity: 0.8,
      transparent: true,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    this.group.add(line);
    
    const arrowGeometry = new THREE.ConeGeometry(8, 25, 8);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    
    const arrowPos = direction.clone().normalize().multiplyScalar(direction.length() - 12);
    arrow.position.copy(arrowPos);
    
    if (direction.x > 0) {
      arrow.rotation.z = -Math.PI / 2;
    } else if (direction.y > 0) {
    } else if (direction.z > 0) {
      arrow.rotation.x = Math.PI / 2;
    }
    
    this.group.add(arrow);
    
    const sprite = this.createTextSprite(label, color);
    const labelPos = direction.clone().normalize().multiplyScalar(labelDistance);
    sprite.position.copy(labelPos);
    this.group.add(sprite);
  }

  private createTextSprite(text: string, color: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 128;
    canvas.height = 128;
    
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.font = 'Bold 80px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(20, 20, 1);
    
    return sprite;
  }

  getObject(): THREE.Group {
    return this.group;
  }

  setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  dispose(): void {
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
      if (child instanceof THREE.Sprite) {
        child.material.dispose();
        if (child.material.map) {
          child.material.map.dispose();
        }
      }
    });
  }
}
