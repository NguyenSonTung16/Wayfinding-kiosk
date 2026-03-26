import * as THREE from 'three';
import { createTextTexture } from '../../utils/TextHelper';

export class Elevator {
  constructor(x, z, offsetX, offsetZ, rotationY = 0) {
    this.group = new THREE.Group();
    
    const elevatorWidth = 2.0;
    const elevatorHeight = 2.5;
    const elevatorDepth = 2.0;
    
    // Main Body (Black Metallic Box)
    const bodyGeo = new THREE.BoxGeometry(elevatorWidth, elevatorHeight, elevatorDepth);
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a, // Màu đen đậm
      metalness: 0.5, 
      roughness: 0.5 
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = elevatorHeight / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);
    
    // Edges
    const edgesGeo = new THREE.EdgesGeometry(bodyGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x333333 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    body.add(edges);
    
    // Door (Grey Metallic for contrast)
    // We place it at +Z direction (front)
    const doorGeo = new THREE.PlaneGeometry(elevatorWidth * 0.7, elevatorHeight * 0.82);
    const doorMat = new THREE.MeshStandardMaterial({ 
      color: 0xecf0f1, // Màu xám sáng để phân biệt
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.DoubleSide 
    });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, elevatorHeight * 0.41, elevatorDepth / 2 + 0.02);
    this.group.add(door);

    // Label
    const eLabelData = createTextTexture(`Thang\nmáy`);
    const eLabelMat = new THREE.SpriteMaterial({
      map: eLabelData.texture,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    });
    const eLabel = new THREE.Sprite(eLabelMat);
    const baseH = 2.0;
    eLabel.scale.set(baseH * eLabelData.aspectRatio, baseH, 1);
    eLabel.position.set(0, elevatorHeight + 0.5, 0); 
    this.group.add(eLabel);

    // Global position and rotation
    const px = x - offsetX;
    const pz = z - offsetZ;
    this.group.position.set(px, 0, pz);
    this.group.rotation.y = rotationY;
  }
}
