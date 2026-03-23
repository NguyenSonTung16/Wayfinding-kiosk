import * as THREE from 'three';

export class Stairs {
  constructor(x, z, offsetX, offsetZ) {
    this.group = new THREE.Group();
    const stairsCount = 6;
    const stepWidth = 2.5;
    const stepDepth = 0.3; // Theo yêu cầu tinh chỉnh của người dùng
    const blockHeight = 1.0;
    const stairsMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, roughness: 0.9 });
    
    for (let i = 0; i < stairsCount; i++) {
      const stepH = (blockHeight / stairsCount) * (i + 1);
      const stepGeo = new THREE.BoxGeometry(stepWidth, stepH, stepDepth);
      const step = new THREE.Mesh(stepGeo, stairsMat);
      
      step.position.set(0, stepH / 2, -i * stepDepth);
      
      const edgeGeo = new THREE.EdgesGeometry(stepGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x8ca3b8, transparent: true, opacity: 0.5 });
      const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);
      step.add(edgeMesh);
      
      step.castShadow = true;
      step.receiveShadow = true;
      this.group.add(step);
    }
    
    const px = x - offsetX;
    const pz = z - offsetZ;
    this.group.position.set(px, 0, pz);
    
    // Giữ nguyên góc xoay chuẩn theo user
    this.group.rotation.y = Math.PI / -2; 
  }
}
