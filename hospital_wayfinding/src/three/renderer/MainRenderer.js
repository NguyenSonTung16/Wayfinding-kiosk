import * as THREE from 'three';

export class MainRenderer {
  constructor(canvas) {
    this.instance = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Bật Shadow Map tạo hiệu ứng bóng đổ
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  resize() {
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  render(scene, camera) {
    this.instance.render(scene, camera);
  }
  
  dispose() {
    this.instance.dispose();
  }
}
