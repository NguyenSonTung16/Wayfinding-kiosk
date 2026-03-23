import { useEffect, useRef, useState } from 'react';
import './App.css';
import { WebGLApp } from './three/WebGLApp';

// Nạp dữ liệu cấu trúc Json của các tầng
import mapDataL1 from './data/L1.json'; 
import mapDataL2 from './data/L2.json'; 

// Quản lý Dữ liệu các Tầng
const MAP_DATA = {
  'Tầng 1': mapDataL1,
  'Tầng trệt': mapDataL2,
};
// Danh sách tầng (Xếp từ cao xuống thấp cho đúng UX thực tế)
const FLOORS = ['L6', 'L5', 'L4', 'L3', 'Tầng trệt', 'Tầng 1', 'B1', 'B2', 'B3'];

function App() {
  const canvasRef = useRef(null);
  const webGLAppRef = useRef(null); // Giữ Reference tới bộ máy 3D
  const [activeFloor, setActiveFloor] = useState('Tầng trệt'); // Trạng thái mặc định khớp với MAP_DATA

  // Vòng đời kích hoạt bản đồ 3D lần đầu
  useEffect(() => {
    // Khởi tạo lõi 3D WebGL (Chỉ chạy 1 lần duy nhất)
    webGLAppRef.current = new WebGLApp(canvasRef.current);

    // Mới vào trang web, nạp thẳng tầng mặc định (L1)
    webGLAppRef.current.loadMap(MAP_DATA[activeFloor]);

    return () => {
      // Dọn dẹp bộ nhớ đồ họa khi đóng tab
      if (webGLAppRef.current) webGLAppRef.current.destroy();
    };
  }, []);

  // Vòng đời Lắng nghe sự kiện chuyển tầng từ React UI
  useEffect(() => {
    // Nếu lõi 3D đang sống, và Data của tầng đang chọn là có thực
    // -> Bắn lệnh đập bản đồ cũ xây lại bản đồ mới trong vũ trụ 3D (0.01 giây)
    if (webGLAppRef.current && MAP_DATA[activeFloor]) {
      webGLAppRef.current.loadMap(MAP_DATA[activeFloor]);
    }
  }, [activeFloor]);

  // Lấy ra danh sách phòng của tầng hiện tại cung cấp cho thanh Card bên dưới
  const currentFloorData = MAP_DATA[activeFloor];
  const currentRooms = (currentFloorData && currentFloorData.rooms) ? currentFloorData.rooms : [];

  return (
    <div className="container">
      {/* Lớp nền Bản đồ 3D */}
      <canvas ref={canvasRef} id="threeCanvas" />

      {/* Lớp Overlay Giao diện Kiosk Nổi (UI Glassmorphism) */}
      <div className="kiosk-ui-layer">
        
        {/* Indicator định vị mộc mạc */}
        <div className="ui-location-indicator">
          📍 Vị trí hiện tại của bạn: <b>Tầng {activeFloor}</b>
        </div>

        {/* 1. Thanh chọn Tầng (Horizontal list) */}
        <div className="floors-selection-bar">
          {FLOORS.map(floor => (
            <button 
              key={floor} 
              className={`floor-btn ${activeFloor === floor ? 'active-floor' : ''}`}
              onClick={() => setActiveFloor(floor)}
              disabled={!MAP_DATA[floor]} // Nút sẽ bị xám mờ nếu bạn chưa đổ data Json cho tầng đó
              style={{ opacity: MAP_DATA[floor] ? 1 : 0.3 }}
            >
              {floor}
            </button>
          ))}
        </div>

        {/* Căn lề Header cho Danh sách phòng */}
        <div className="ui-section-title">
          Danh sách phòng ban nổi bật ({activeFloor})
        </div>

        {/* 2. Danh sách các phòng ban (Nằm ngay bên dưới thanh chọn tầng) */}
        <div className="rooms-horizontal-list">
          {currentRooms.length === 0 ? (
            <p style={{ padding: '10px 20px', color: '#94a3b8' }}>Dữ liệu tầng này đang được quy hoạch...</p>
          ) : (
            currentRooms.map(room => (
              <div key={room.id} className="room-kiosk-card">
                <div className="room-card-icon">{room.id}</div>
                <div className="room-card-info">
                  <h4>{room.name}</h4>
                  <p>{room.type || 'Chưa thiết lập'}</p>
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
