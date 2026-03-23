import * as THREE from 'three';
import { createTextTexture } from '../../utils/TextHelper';

export class Bus {
  constructor(x, z, offsetX, offsetZ) {
    this.group = new THREE.Group();
    
    const busGeo = new THREE.BoxGeometry(10, 2.0, 3);
    const busMat = new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.4 });
    const bus = new THREE.Mesh(busGeo, busMat);
    const px = x - offsetX;
    const pz = z - offsetZ;
    bus.position.set(px, 2.0 / 2, pz);
    bus.castShadow = true;
    bus.receiveShadow = true;
    this.group.add(bus);

    const eLabelData = createTextTexture(`LỐI VÀO CHÍNH (C1)`);
    const eLabelMat = new THREE.SpriteMaterial({
      map: eLabelData.texture,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    });
    const eLabel = new THREE.Sprite(eLabelMat);
    const baseH = 2.0; 
    eLabel.scale.set(baseH * eLabelData.aspectRatio, baseH, 1);
    eLabel.position.set(px - 2, 0.4, pz - 4);
    this.group.add(eLabel);
  }
}
