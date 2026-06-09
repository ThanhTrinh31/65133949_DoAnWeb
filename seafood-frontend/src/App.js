import React, { useState, useEffect } from 'react';

function App() {
  const [danhSachHaiSan, setDanhSachHaiSan] = useState([]);
  
  // Các trạng thái của Form
  const [ten, setTen] = useState('');
  const [giaBan, setGiaBan] = useState('');
  const [soLuong, setSoLuong] = useState('');
  const [idDangSua, setIdDangSua] = useState(null); 

  // Hàm lấy dữ liệu chuẩn theo cấu hình phân trang mới
  const layDuLieu = () => {
    fetch('http://localhost:8080/api/haisan')
      .then(response => response.json())
      .then(data => {
        // Đọc đúng vào mảng 'haisans' của Object phân trang
        if (data && Array.isArray(data.haisans)) {
          setDanhSachHaiSan(data.haisans);
        } else if (Array.isArray(data)) {
          setDanhSachHaiSan(data); 
        } else {
          setDanhSachHaiSan([]);
        }
      })
      .catch(error => {
        console.error('Lỗi kết nối API:', error);
        setDanhSachHaiSan([]);
      });
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  // Hàm xử lý Thêm mới hoặc Cập nhật
  const luuDuLieu = (e) => {
    e.preventDefault();
    const haisanData = { ten, giaBan: Number(giaBan), soLuong: Number(soLuong) };

    if (idDangSua) {
      // API SỬA (PUT)
      fetch(`http://localhost:8080/api/haisan/${idDangSua}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(haisanData)
      }).then(() => {
        layDuLieu(); 
        huySua(); 
      });
    } else {
      // API THÊM MỚI (POST)
      fetch('http://localhost:8080/api/haisan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(haisanData)
      }).then(() => {
        layDuLieu();
        huySua();
      });
    }
  };

  // Hàm Xóa
  const xoaHaiSan = (id) => {
    if (window.confirm("Ông có chắc muốn xóa món này không?")) {
      fetch(`http://localhost:8080/api/haisan/${id}`, {
        method: 'DELETE'
      }).then(() => layDuLieu());
    }
  };

  // Hàm bấm nút Sửa
  const batDauSua = (haisan) => {
    setIdDangSua(haisan.id); 
    setTen(haisan.ten);
    setGiaBan(haisan.giaBan);
    setSoLuong(haisan.soLuong);
  };

  const huySua = () => {
    setIdDangSua(null);
    setTen(''); setGiaBan(''); setSoLuong('');
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', marginTop: '50px' }}>
      <h1 style={{ color: '#d35400' }}>🦐 QUẢN LÝ HẢI SẢN FULL-STACK 🦀</h1>
      
      {/* FORM NHẬP LIỆU */}
      <form onSubmit={luuDuLieu} style={{ marginBottom: '30px', backgroundColor: '#f2f2f2', padding: '20px', display: 'inline-block', borderRadius: '8px' }}>
        <input type="text" placeholder="Tên hải sản" value={ten} onChange={(e) => setTen(e.target.value)} required style={{ margin: '5px', padding: '8px' }} />
        <input type="number" placeholder="Giá bán" value={giaBan} onChange={(e) => setGiaBan(e.target.value)} required style={{ margin: '5px', padding: '8px' }} />
        <input type="number" placeholder="Số lượng" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} required style={{ margin: '5px', padding: '8px' }} />
        
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: idDangSua ? '#f39c12' : '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {idDangSua ? '🔄 Cập Nhật' : '➕ Thêm Mới'}
        </button>
        
        {/* Nút hủy sửa */}
        {idDangSua && (
          <button type="button" onClick={huySua} style={{ padding: '8px 15px', marginLeft: '5px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Hủy
          </button>
        )}
      </form>

      {/* BẢNG HIỂN THỊ */}
      <table border="1" cellPadding="15" style={{ margin: '0 auto', borderCollapse: 'collapse', width: '70%' }}>
        <thead style={{ backgroundColor: '#2980b9', color: 'white' }}>
          <tr>
            <th>Tên Sản Phẩm</th>
            <th>Giá Bán (VNĐ)</th>
            <th>Số Lượng Còn</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {danhSachHaiSan && danhSachHaiSan.length > 0 ? (
            danhSachHaiSan.map((haisan, index) => (
              <tr key={haisan.id || index}>
                <td style={{ fontWeight: 'bold' }}>{haisan.ten}</td>
                <td style={{ color: 'red' }}>
                  {haisan.giaBan ? haisan.giaBan.toLocaleString('vi-VN') : 0} đ
                </td>
                <td>{haisan.soLuong}</td>
                <td>
                  <button onClick={() => batDauSua(haisan)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#f1c40f', border: 'none', cursor: 'pointer' }}>✏️ Sửa</button>
                  <button onClick={() => xoaHaiSan(haisan.id)} style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>🗑️ Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Kho đang trống hoặc chưa kết nối được dữ liệu ông ơi...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;