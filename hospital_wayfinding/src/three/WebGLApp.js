import * as THREE from 'three';
import { MainRenderer } from './renderer/MainRenderer';
import { MainCamera } from './camera/MainCamera';
import { MainScene } from './scene/MainScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class WebGLApp {
  constructor(canvas) {
    if (!canvas) throw new Error('Canvas element is required for WebGLApp');

    this.canvas = canvas;

    // Instantiate Core Modules
    this.camera = new MainCamera();
    this.scene = new MainScene();
    this.renderer = new MainRenderer(this.canvas);

    this.reqId = null;

    this.setupControls();

    // Resize handler
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.animate = this.animate.bind(this);
    this.animate();
  }

  // Chức năng nạp bản đồ động nhận lệnh từ React UI (Hoán đổi 3D realtime)
  loadMap(roomsData) {
    if (this.scene && typeof this.scene.loadMap === 'function') {
      this.scene.loadMap(roomsData);
    }
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera.instance, this.renderer.instance.domElement);

    // Mở xoay camera: chuột trái = pan, chuột phải = xoay
    this.controls.enableRotate = true;

    // Chuột trái = Pan (di chuyển camera theo phương ngang/dọc), chuột phải = Xoay (Rotate), giữa = Zoom (DOLLY)
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.DOLLY_ROTATE,
      TWO: THREE.TOUCH.PAN  // 2 ngón → Pinch zoom + xoay camera
    };

    // Smooth scroll / damping
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Zoom limits (Cho orthographic thì dùng minZoom/maxZoom thay vì distance)
    this.controls.minZoom = 0.5;
    this.controls.maxZoom = 3;

    // Giới hạn góc nhìn dọc (polar angle tính từ đỉnh trời xuống)
    // minPolarAngle: góc nhìn tối thiểu từ trên xuống (PI/6 ≈ 30° → ko nhìn thẳng lên đỉnh)
    // maxPolarAngle: tối đa PI/2 = 90° → nằm ngang chân trời, ko lật xuống đáy map
    this.controls.minPolarAngle = Math.PI / 6;
    this.controls.maxPolarAngle = Math.PI / 2;

    // Bật Pan
    this.controls.enablePan = true;

    // Look at center
    this.controls.target.set(0, 0, 0);

    // --- TÍNH NĂNG KHÓA VÙNG PAN (PAN LIMITS) ---
    // Ngăn người dùng kéo vuốt camera bay ra ngoài vũ trụ hoặc khoảng trắng
    this.controls.addEventListener('change', () => {
      // Giới hạn biên độ kéo (chỉ cho phép camera di chuyển cách tâm 15 đơn vị)
      // Khi Zoom Out toàn cảnh, khung hình rộng, giới hạn nhỏ này khiến bản đồ luôn nằm ngay giữa màn hình
      const minPan = new THREE.Vector3(-15, -5, -15);
      const maxPan = new THREE.Vector3(15, 5, 15);

      // Lưu lại target hiện tại
      const targetOffset = new THREE.Vector3().copy(this.controls.target);

      // Ép target phải nằm gọn trong hộp giới hạn
      this.controls.target.clamp(minPan, maxPan);

      // Tính lượng chênh lệch (Lượng kéo bị lố ra ngoài biên)
      targetOffset.sub(this.controls.target);

      // Nếu có sự lố biên, ta bắt buộc phải đẩy lùi Camera về đúng vị trí hợp lệ tương ứng
      if (targetOffset.lengthSq() > 0.00001) {
        this.camera.instance.position.sub(targetOffset);
      }
    });

  }

  onResize() {
    this.camera.resize();
    this.renderer.resize();
  }

  animate() {
    this.controls.update();

    // Delegate updates to scene module
    this.scene.update();

    // Render loop
    this.renderer.render(this.scene.instance, this.camera.instance);

    this.reqId = window.requestAnimationFrame(this.animate);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);

    if (this.reqId !== null) {
      window.cancelAnimationFrame(this.reqId);
    }

    this.renderer.dispose();
    this.controls.dispose();

  }
}
