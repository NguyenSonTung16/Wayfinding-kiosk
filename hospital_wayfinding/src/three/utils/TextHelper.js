import * as THREE from 'three';

// Hàm tạo biển báo (Text) siêu tốc dán lên các cục 3D
// Tuân thủ KISS: Không dùng thư viện Text3D nặng nề, chỉ dùng CanvasTexture
// Hàm tạo biển báo (Text) siêu biến đổi hình học
// Tự động đo đạc độ dài chữ và cấp phát diện tích Canvas rộng vừa khít để chặn tình trạng bị Crop (cắt chữ)
export function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const fontSize = 48; // Độ phân giải 48px cực sắc nét
  ctx.font = `bold ${fontSize}px 'SF Pro Display', system-ui, sans-serif`;

  // Đo đạc dòng chữ dài nhất để làm chiều ngang Canvas
  const lines = text.split('\n');
  let maxTextWidth = 0;
  lines.forEach(line => {
    const metrics = ctx.measureText(line);
    if (metrics.width > maxTextWidth) maxTextWidth = metrics.width;
  });

  // Cộng bồi thêm padding lề an toàn
  const paddingX = 40; 
  const paddingY = 20;
  const lineHeight = fontSize + 8;

  canvas.width = maxTextWidth + paddingX * 2;
  canvas.height = (lines.length * lineHeight) + paddingY * 2;

  // Context bị reset khi đổi width Canvas, nên Cần set lại Setting chữ
  const ctxRender = canvas.getContext('2d');
  ctxRender.clearRect(0, 0, canvas.width, canvas.height);
  ctxRender.font = `bold ${fontSize}px 'SF Pro Display', system-ui, sans-serif`;
  ctxRender.textAlign = 'center';
  ctxRender.textBaseline = 'middle';
  
  // Màu chữ Xanh Navy sang trọng để làm biển báo
  ctxRender.fillStyle = '#1e293b'; 

  const startY = paddingY + (lineHeight / 2) - 4; // Bù trừ line height
  lines.forEach((line, i) => {
    ctxRender.fillText(line, canvas.width / 2, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4; // Khử răng cưa
  
  // Trả về cả Texture và Tỉ lệ Aspect Ratio (Width:Height) để 3D Scale hình học vuông vức
  return { 
    texture: texture, 
    aspectRatio: canvas.width / canvas.height 
  };
}
