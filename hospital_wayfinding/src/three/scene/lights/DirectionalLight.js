import * as THREE from 'three';

export class DirectionalLight {
  constructor() {
    this.instance = new THREE.DirectionalLight(0xffffff, 1.5); // Tăng sáng nhồi thêm cho bừng sáng mô hình
    this.instance.position.set(20, 50, 30);
    this.instance.castShadow = true;

    // Cấu hình chất lượng bóng đổ (Shadow)
    this.instance.shadow.mapSize.width = 2048;
    this.instance.shadow.mapSize.height = 2048;
    this.instance.shadow.camera.near = 0.5;
    this.instance.shadow.camera.far = 150;
    
    const d = 50; // Quãng bao phủ của shadow camera
    this.instance.shadow.camera.left = -d;
    this.instance.shadow.camera.right = d;
    this.instance.shadow.camera.top = d;
    this.instance.shadow.camera.bottom = -d;
  }
}
