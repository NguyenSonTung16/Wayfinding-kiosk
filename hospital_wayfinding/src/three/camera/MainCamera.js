import * as THREE from 'three';

export class MainCamera {
  constructor() {
    // Chuyển sang OrthographicCamera để có góc chiếu trục đo (Isometric) hoàn hảo
    const frustumSize = 40;
    const aspect = window.innerWidth / window.innerHeight;
    this.instance = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    // Vị trí: Đặt x, y, z tỉ lệ chéo nhau để tạo góc nhìn 45 độ xuống
    this.instance.position.set(-30, 40, 30);
    this.instance.lookAt(0, 0, 0);
  }
  
  resize() {
    const frustumSize = 40;
    const aspect = window.innerWidth / window.innerHeight;
    this.instance.left = frustumSize * aspect / -2;
    this.instance.right = frustumSize * aspect / 2;
    this.instance.top = frustumSize / 2;
    this.instance.bottom = frustumSize / -2;
    this.instance.updateProjectionMatrix();
  }
}
