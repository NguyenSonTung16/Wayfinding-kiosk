import * as THREE from 'three';

export class DashedPath {
  constructor(pointsData, offsetX, offsetZ) {
    this.group = new THREE.Group();
    
    const points = pointsData.map(p => new THREE.Vector3(p[0] - offsetX, 0.1, p[1] - offsetZ));

    const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
    const pathMat = new THREE.LineDashedMaterial({
      color: 0x192a56,
      linewidth: 4,
      scale: 1,
      dashSize: 0.8,
      gapSize: 0.5,
    });
    const pathLine = new THREE.Line(pathGeo, pathMat);
    pathLine.computeLineDistances();
    this.group.add(pathLine);
  }
}
