import * as THREE from 'three';
import { createTextTexture } from '../utils/TextHelper';
import { Kiosk } from './objects/Kiosk';
import { Bus } from './objects/Bus';
import { Stairs } from './objects/Stairs';
import { DashedPath } from './objects/DashedPath';
import { GroundLabel } from './objects/GroundLabel';
import { Elevator } from './objects/Elevator';

export class MapParser {
  constructor(floorData) {
//...
// skipping full rewrite, need to be careful with replace chunks
// let's do a targeted replace for imports and loop

    this.group = new THREE.Group();

    // Sử dụng cấu trúc phong đã chuẩn hóa
    this.roomsData = floorData.phong || [];
    this.featuresData = floorData.features || [];

    // Tự động phân tích cực Boundaries Sơ đồ để định tuyến (Auto-Center)
    let minX = Infinity, maxX = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    if (this.roomsData.length > 0) {
      this.roomsData.forEach(room => {
        const left = room.x - room.w / 2;
        const right = room.x + room.w / 2;
        const top = room.z - room.h / 2;
        const bottom = room.z + room.h / 2;

        if (left < minX) minX = left;
        if (right > maxX) maxX = right;
        if (top < minZ) minZ = top;
        if (bottom > maxZ) maxZ = bottom;
      });

      this.OFFSET_X = (minX + maxX) / 2;
      this.OFFSET_Z = (minZ + maxZ) / 2;

      // Xóa bỏ hoàn toàn lớp viền lề (padding = 0). Nền xám sẽ chỉ lọt thỏm vào những khoảng hở đường đi bên trong.
      this.floorW = maxX - minX;
      this.floorH = maxZ - minZ;
    } else {
      this.OFFSET_X = 0;
      this.OFFSET_Z = 0;
      this.floorW = 60;
      this.floorH = 40;
    }
  }

  build() {
    // 1. Mặt bằng thềm đi bộ linh động kích thước (Dưới lót Floor)
    const floorGeo = new THREE.PlaneGeometry(this.floorW, this.floorH);
    // Tái kích hoạt lại màu xám cứng bê tông (Concrete Gray) cho riêng mặt đường
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xdce2e8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0); // Vị trí tự căn hoàn hảo do Offset
    floor.receiveShadow = true;
    this.group.add(floor);

    const blockHeight = 1.0; // Cao độ của tường phòng 2.5D

    // 2. Dựng lên toàn bộ các dãy phòng (Dựa trên File Json của Tầng)
    this.roomsData.forEach(room => {
      const bGeo = new THREE.BoxGeometry(room.w, blockHeight, room.h);

      const roomColor = new THREE.Color(room.color || 0xcdebff);
      const bMat = new THREE.MeshStandardMaterial({ color: roomColor, roughness: 0.8 });
      const block = new THREE.Mesh(bGeo, bMat);

      // Bo viền (Border Edge) hiển thị khối nhà sắc nét độc lập
      const edgesGeo = new THREE.EdgesGeometry(bGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0x8ca3b8,
        transparent: true,
        opacity: 0.35 // Vừa đủ thanh mảnh
      });
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      block.add(edgesMesh);

      // Lấy theo tiêu chuẩn bản đồ để thả phòng chính xác
      const px = room.x - this.OFFSET_X;
      const pz = room.z - this.OFFSET_Z;
      block.position.set(px, blockHeight / 2, pz);
      block.castShadow = true;
      block.receiveShadow = true;
      this.group.add(block);

      // 3. Sprite Nhãn phòng xoay theo màn hình - Sử dụng Hệ thống tính Tỉ lệ Tự động
      const roomId = room.idPhong;
      const roomName = room.tenPhong;
      const textData = createTextTexture(`${roomId}\n${roomName}`);
      const spriteMat = new THREE.SpriteMaterial({
        map: textData.texture,
        transparent: true,
        opacity: 0.9,
        depthTest: false // Đè xuyên suốt mái
      });
      const textSprite = new THREE.Sprite(spriteMat);
      
      // Xóa bỏ scale cứng ngắc theo room.w và room.h.
      // Sử dụng baseHeight cố định (khoảng 3 đơn vị), và tính Width dựa vào tỉ lệ thật của dòng chữ!
      const baseHeight = 3.2;
      textSprite.scale.set(baseHeight * textData.aspectRatio, baseHeight, 1);
      
      textSprite.position.set(px, blockHeight + 0.1, pz); 
      this.group.add(textSprite);
    });


    // 4. Giải thuật Động Xây Dựng Đặc Tuyến Kiosk - Điểm Nhấn Tầng (Features)
    // Bóc tách sự ràng buộc của Mã Dữ Liệu ở Tầng L1. Tầng nào có khai báo Feature thì mới Render!
    this.featuresData.forEach(feature => {
      switch (feature.type) {
        case 'kiosk':
          const kiosk = new Kiosk(feature.x, feature.z, this.OFFSET_X, this.OFFSET_Z);
          this.group.add(kiosk.group);
          break;
        case 'bus':
          const bus = new Bus(feature.x, feature.z, this.OFFSET_X, this.OFFSET_Z);
          this.group.add(bus.group);
          break;
        case 'stairs':
          const stairs = new Stairs(feature.x, feature.z, this.OFFSET_X, this.OFFSET_Z);
          if (feature.rotationY !== undefined) {
            stairs.group.rotation.y = feature.rotationY;
          }
          this.group.add(stairs.group);
          break;
        case 'path':
          const path = new DashedPath(feature.points, this.OFFSET_X, this.OFFSET_Z);
          this.group.add(path.group);
          break;
        case 'ground_label':
          const gLabel = new GroundLabel(feature.text, feature.x, feature.z, this.OFFSET_X, this.OFFSET_Z, feature.width);
          this.group.add(gLabel.group);
          break;
        case 'elevator':
          const elevator = new Elevator(feature.x, feature.z, this.OFFSET_X, this.OFFSET_Z, feature.rotationY || 0);
          this.group.add(elevator.group);
          break;
        default:
          break;
      }
    });

    return this.group;
  }
}
