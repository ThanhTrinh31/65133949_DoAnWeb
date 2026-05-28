import React, { useState, useEffect } from 'react';

function App() {
  // Tạo một cái rỏ rỗng để chứa hải sản mang về
  const [danhSachHaiSan, setDanhSachHaiSan] = useState([]);

  // Dùng useEffect để tự động chạy đi lấy hàng ngay khi mở web
  useEffect(() => {
    fetch('http://localhost:8080/api/haisan')
      .then(response => response.json()) // Lấy dữ liệu dạng JSON
      .then(data => setDanhSachHaiSan(data)) // Đổ dữ liệu vào rỏ
      .catch(error => console.error('Lỗi rồi ông ơi:', error));
  }, []);

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', marginTop: '50px' }}>
      <h1 style={{ color: '#d35400' }}>🦐 DANH SÁCH HẢI SẢN 🦀</h1>
      
      <table border="1" cellPadding="15" style={{ margin: '0 auto', borderCollapse: 'collapse', width: '60%' }}>
        <thead style={{ backgroundColor: '#2980b9', color: 'white' }}>
          <tr>
            <th>Tên Sản Phẩm</th>
            <th>Giá Bán (VNĐ)</th>
            <th>Số Lượng Còn</th>
          </tr>
        </thead>
        <tbody>
          {/* Vòng lặp lấy từng món trong rỏ ra in lên bảng */}
          {danhSachHaiSan.map((haisan, index) => (
            <tr key={index}>
              <td style={{ fontWeight: 'bold' }}>{haisan.ten}</td>
              <td style={{ color: 'red' }}>{haisan.giaBan.toLocaleString('vi-VN')} đ</td>
              <td>{haisan.soLuong}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;