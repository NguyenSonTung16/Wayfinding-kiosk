import * as THREE from 'three';
import { createTextTexture } from '../../utils/TextHelper';

export class Kiosk {
  constructor(x, z, offsetX, offsetZ) {
    this.group = new THREE.Group();
    
    // Kiosk Body
    const kioskHeight = 1.0;
    const kioskRadius = 0.6;
    const kioskGeo = new THREE.CylinderGeometry(kioskRadius, kioskRadius, kioskHeight, 32);
    const kioskMat = new THREE.MeshStandardMaterial({ color: 0xff4757, roughness: 0.3 });
    const kiosk = new THREE.Mesh(kioskGeo, kioskMat);
    
    const px = x - offsetX;
    const pz = z - offsetZ;
    kiosk.position.set(px, kioskHeight / 2, pz);
    kiosk.castShadow = true;
    kiosk.receiveShadow = true;
    this.group.add(kiosk);

    // Kiosk Label
    const kLabelData = createTextTexture(`Máy\nKiosk`);
    const kLabelMat = new THREE.SpriteMaterial({
      map: kLabelData.texture,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    });
    const kLabel = new THREE.Sprite(kLabelMat);
    const baseH = 2.0; // Giảm nhẹ chiều cao nhãn
    kLabel.scale.set(baseH * kLabelData.aspectRatio, baseH, 1);
    kLabel.position.set(px, kioskHeight + 0.5, pz); // Đặt nhãn ngay trên máy
    this.group.add(kLabel);
  }
}
