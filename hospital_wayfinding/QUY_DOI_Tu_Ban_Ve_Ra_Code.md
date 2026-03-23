# CHUYỂN ĐỔI BẢN VẼ GIẤY (BLUEPRINT) THÀNH TỌA ĐỘ UI WEB

### Bước 1: Kẻ Khung Tọa Độ X (Đếm Ngang) và Z (Đếm Dọc)
 Kẻ số thứ tự các ô ly bắt đầu từ góc Trái-Trên-Cùng của bản vẽ.
- **Dọc mép trên cùng (Trục X):** Đánh số từ Trái sang Phải `0, 1, 2, 3... 50, 60`.
- **Dọc mép bên trái (Trục Z):** Đánh số từ Trên xuống Dưới `0, 1, 2, 3... 40, 50`.

### Bước 2: Đo Đạc Chiều Rộng (W) và Độ Sâu (H)
Khi bức tranh đã nằm trọn trên lưới ô ly, bạn đối chiếu xem tòa nhà đó chiếm bao nhiêu ô ly.
- **`w` (Bề Rộng):** Kéo dài ngang bao nhiêu ô ly trục X? (Ví dụ: Nhà Xe Máy kéo dài từ đường kẻ X=12 cho tới đường kẻ X=22 => Vậy `w = 22 - 12 = 10` đơn vị).
- **`h` (Bề Dọc):** Kéo dài thụt xuống bao nhiêu ô ly trục Z? (Ví dụ: Căn Tin kéo từ hàng kẻ Z=2 tới hàng kẻ Z=5 => Vậy `h = 5 - 2 = 3` đơn vị).

### Bước 3: Đóng Đinh TRƯỚC Tọa Độ Tâm Điểm (X và Z)
Hệ thống JSON `MapParser` **chỉ nhận duy nhất Tọa Độ ở chính Giữa Trung Tâm** của phòng!
Rất dễ, bạn cộng chia đôi 2 vạch kẻ biên của tòa nhà đó theo ô ly là ra Tâm!
- **Tìm `x`:** Vị trí giữa của Nhà Xe Máy (Kẹp giữa vạch X=12 và X=22) là bao nhiêu?
  => `x = (12 + 22) / 2 = 17`.
- **Tìm `z`:** Vị trí giữa của Căn Tin (Kẹp giữa hàng thả dọc vạch Z=2 và Z=5) là bao nhiêu?
  => `z = (2 + 4) / 2 = 3.5`.

Xong! Bạn tiến hành bốc bộ số `(w: 10, h: 3, x: 17, z: 3.5)` gõ luôn vào file `L2.json`.

---

## VÍ DỤ

Lấy "Khu Cấp Cứu - Khu Hành Chính" làm bài thực hành:

1. **Gióng Trục Ngang X:** Bạn kẻ vạch từ tường trái của khu Cấp Cứu, ngẫu nhiên đặt nó là vạch mốc số `X = 20`. Bạn kẻ vạch sang tường bên phải của nó, thấy tòa nhà rất dài, ướm chừng vạch nhãn là `X = 40`.
   => **Kết luận Size Ngang:** Rộng `w = 40 - 20 = 20`.
   => **Kết luận Tâm X:** Nằm giữa `(20 + 40) / 2 = 30`. Vậy tham số `x = 30`.

2. **Gióng Trục Dọc Z:** Bạn nhìn khu Cấp Cứu nằm thụt lùi xuống phía dưới 1 chút so với Nhà Xe Ô tô. Phóng đường kẻ ngang nó là `Z = 8`. Tường móng dưới kẻ ra là vạch `Z = 12`.
   => **Kết luận Size Dọc:** Sâu `h = 12 - 8 = 4`.
   => **Kết luận Tâm Z:** Nằm giữa `(8 + 12) / 2 = 10`. Vậy tham số `z = 10`.

3. **Gõ Xuống Code JSON:**
```json
{ "id": "CC", "name": "Cấp Cứu ĐK", "type": "Khu Điều Hành", "x": 30, "z": 10, "w": 20, "h": 4 }
```
