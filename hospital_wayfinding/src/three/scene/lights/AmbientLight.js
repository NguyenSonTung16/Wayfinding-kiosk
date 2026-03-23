import * as THREE from 'three';

export class AmbientLight {
  constructor() {
    this.instance = new THREE.AmbientLight(0xffffff, 1.2); 
  }
}
