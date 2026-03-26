import { useEffect, useRef, useState } from 'react';
import './App.css';
import { WebGLApp } from './three/WebGLApp';

// Nạp dữ liệu cấu trúc Json của bệnh viện (Tất cả trong 1)
import hospitalData from './data/hospital.json';

// Quản lý Dữ liệu các Tầng động từ Hospital JSON
const benhvien = hospitalData.benhvien;
const MAP_DATA = benhvien.tang.reduce((acc, t) => {
  acc[t.idTang] = t;
  return acc;
}, {});

// Danh sách tầng (Lấy động từ JSON)
const FLOORS = benhvien.tang.map(t => ({ id: t.idTang, name: t.tenTang }));

function App() {
  const canvasRef = useRef(null);
  const webGLAppRef = useRef(null); // Giữ Reference tới bộ máy 3D
  
  // Trạng thái tầng mặc định (Lấy ID tầng đầu tiên trong danh sách)
  const [activeFloorId, setActiveFloorId] = useState(FLOORS[0]?.id || 'L1');

  // Vòng đời kích hoạt bản đồ 3D lần đầu
  useEffect(() => {
    // Khởi tạo lõi 3D WebGL (Chỉ chạy 1 lần duy nhất)
    webGLAppRef.current = new WebGLApp(canvasRef.current);

    // Mới vào trang web, nạp thẳng tầng mặc định
    const floorData = MAP_DATA[activeFloorId];
    if (floorData) {
      webGLAppRef.current.loadMap(floorData);
    }

    return () => {
      // Dọn dẹp bộ nhớ đồ họa khi đóng tab
      if (webGLAppRef.current) webGLAppRef.current.destroy();
    };
  }, []);

  // Vòng đời Lắng nghe sự kiện chuyển tầng từ React UI
  useEffect(() => {
    if (webGLAppRef.current && MAP_DATA[activeFloorId]) {
      webGLAppRef.current.loadMap(MAP_DATA[activeFloorId]);
    }
  }, [activeFloorId]);

  // Lấy ra danh sách phòng của tầng hiện tại cung cấp cho thanh Card bên dưới
  const currentFloorData = MAP_DATA[activeFloorId];
  const currentRooms = currentFloorData?.phong || [];
  const currentFloorName = currentFloorData?.tenTang || 'Không xác định';

  return (
    <div className="container">
      {/* Lớp nền Bản đồ 3D */}
      <canvas ref={canvasRef} id="threeCanvas" />

      {/* Lớp Overlay Giao diện Kiosk Nổi (UI Glassmorphism) */}
      <div className="kiosk-ui-layer">
        
        {/* Tiêu đề Bệnh viện động */}
        <div className="ui-hospital-header" style={{ pointerEvents: 'auto' }}>
           <h2>{benhvien.tenBV}</h2>
        </div>

        {/* Indicator định vị mộc mạc */}
        <div className="ui-location-indicator">
          📍 Vị trí hiện tại của bạn: <b>{currentFloorName}</b>
        </div>

        {/* 1. Thanh chọn Tầng (Horizontal list) */}
        <div className="floors-selection-bar">
          {FLOORS.map(floor => (
            <button 
              key={floor.id} 
              className={`floor-btn ${activeFloorId === floor.id ? 'active-floor' : ''}`}
              onClick={() => setActiveFloorId(floor.id)}
            >
              {floor.name}
            </button>
          ))}
        </div>

        {/* Căn lề Header cho Danh sách phòng */}
        <div className="ui-section-title">
          Danh sách phòng ({currentFloorName})
        </div>

        {/* 2. Danh sách các phòng ban (Nằm ngay bên dưới thanh chọn tầng) */}
        <div className="rooms-horizontal-list">
          {currentRooms.length === 0 ? (
            <p style={{ padding: '10px 20px', color: '#94a3b8' }}>Dữ liệu tầng này đang được quy hoạch...</p>
          ) : (
            currentRooms.map(room => (
              <div key={room.idPhong} className="room-kiosk-card">
                <div className="room-card-icon">{room.idPhong}</div>
                <div className="room-card-info">
                  <h4>{room.tenPhong}</h4>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}


export default App;

