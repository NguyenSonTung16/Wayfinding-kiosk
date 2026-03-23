import * as THREE from 'three';
import { createTextTexture } from '../../utils/TextHelper';

export class Kiosk {
  constructor(x, z, offsetX, offsetZ) {
    this.group = new THREE.Group();
    
    // Kiosk Body
    const kioskGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.8, 32);
    const kioskMat = new THREE.MeshStandardMaterial({ color: 0xff4757, roughness: 0.3 });
    const kiosk = new THREE.Mesh(kioskGeo, kioskMat);
    
    const px = x - offsetX;
    const pz = z - offsetZ;
    kiosk.position.set(px, 1.8 / 2, pz);
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
    const baseH = 2.5; // Chiều cao cơ sở
    kLabel.scale.set(baseH * kLabelData.aspectRatio, baseH, 1);
    kLabel.position.set(px, 1.3, pz - 3);
    this.group.add(kLabel);
  }
}
