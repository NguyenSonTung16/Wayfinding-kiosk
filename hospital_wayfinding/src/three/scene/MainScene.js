import * as THREE from 'three';
import { AmbientLight } from './lights/AmbientLight';
import { DirectionalLight } from './lights/DirectionalLight';
import { MapParser } from './MapParser';

export class MainScene {
  constructor() {
    this.instance = new THREE.Scene();
    
    // Đổi màu vũ trụ bao quanh toàn bộ mô hình thành màu trắng Tinh tế
    this.instance.background = new THREE.Color(0xf5f6fa);

    this.ambientLight = new AmbientLight();
    this.instance.add(this.ambientLight.instance);

    this.dirLight = new DirectionalLight();
    this.instance.add(this.dirLight.instance);
    
    // MapGroup rỗng chờ React bơm Data tầng vào
    this.mapGroup = null;
  }

  // Chức năng nạp bản đồ động (Multi-floor swapping)
  loadMap(roomsData) {
    // Nếu đang có bản đồ cũ, thì gỡ bỏ khỏi Scene
    if (this.mapGroup) {
      this.instance.remove(this.mapGroup);
    }
    
    // Dựng bản đồ mới từ JSON vừa chọn
    const mapParser = new MapParser(roomsData);
    this.mapGroup = mapParser.build();
    this.instance.add(this.mapGroup);
  }

  update() {
    // Để trống: Các tính năng tương tác của Kiosk sẽ bỏ vào đây
  }
}
