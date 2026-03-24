import * as THREE from 'three';

// Hàm xuất texture in trực tiếp lên mặt đất
export function createGroundTextTexture(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const fontSize = 60;
  ctx.font = `bold ${fontSize}px 'SF Pro Display', system-ui, sans-serif`;
  
  const lines = text.split('\n');
  let maxTextWidth = 0;
  lines.forEach(line => {
    const metrics = ctx.measureText(line);
    if (metrics.width > maxTextWidth) maxTextWidth = metrics.width;
  });

  const lineHeight = fontSize + 8;
  const paddingY = 20;

  canvas.width = maxTextWidth + 40;
  canvas.height = (lines.length * lineHeight) + paddingY * 2;

  const ctxRender = canvas.getContext('2d');
  ctxRender.clearRect(0, 0, canvas.width, canvas.height);
  ctxRender.font = `bold ${fontSize}px 'SF Pro Display', system-ui, sans-serif`;
  ctxRender.textAlign = 'center';
  ctxRender.textBaseline = 'middle';
  
  // Chữ cam giao thông nổi bật trên nền xám bê tông
  ctxRender.fillStyle = '#d35400';
  
  const startY = paddingY + (lineHeight / 2) - 4; 
  lines.forEach((line, i) => {
    ctxRender.fillText(line, canvas.width / 2, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return { texture, aspectRatio: canvas.width / canvas.height };
}

export class GroundLabel {
  // Thay đổi: Thêm tham số customWidth = 3 (mặc định) để tùy biến độ to chữ rót lọt khe hẻm
  constructor(text, x, z, offsetX, offsetZ, customWidth = 3.0) {
    this.group = new THREE.Group();
    
    const textData = createGroundTextTexture(text);
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const planeMat = new THREE.MeshBasicMaterial({
      map: textData.texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide  // Hiện chữ từ cả 2 phía khi xoay camera
    });
    
    const plane = new THREE.Mesh(planeGeo, planeMat);
    
    // Tự động neo bề rộng (Width) theo tham số yêu cầu
    const physicalWidth = customWidth; 
    const physicalDepth = physicalWidth / textData.aspectRatio; 
    
    plane.scale.set(physicalWidth, physicalDepth, 1);
    
    const px = x - offsetX;
    const pz = z - offsetZ;
    plane.position.set(px, 0.05, pz);

    // Dùng thứ tự YXZ: xoay ngang (Y) trước, rồi nằm phẳng (X) sau
    // → tránh bị xoay dọc do Euler order mặc định XYZ
    plane.rotation.order = 'YXZ';
    plane.rotation.x = -Math.PI / 2;

    // Chỉ xoay quanh trục Y thế giới → chữ luôn hướng về phía camera trên mặt phẳng nằm ngang
    plane.onBeforeRender = (renderer, scene, camera) => {
      const dx = camera.position.x - plane.position.x;
      const dz = camera.position.z - plane.position.z;
      plane.rotation.y = Math.atan2(dx, dz);
    };
    
    this.group.add(plane);
  }
}
