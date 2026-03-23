import * as THREE from 'three';

export class BoxObject {
  constructor() {
    const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
    const boxMaterial = new THREE.MeshNormalMaterial();
    this.instance = new THREE.Mesh(boxGeometry, boxMaterial);
  }

  update() {
    // Uncomment to enable animation
    // this.instance.rotation.x += 0.002;
    // this.instance.rotation.y += 0.002;
  }
}
