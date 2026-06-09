import React, { useState, useEffect } from 'react';

function App() {
  const [danhSachHaiSan, setDanhSachHaiSan] = useState([]);
  
  // Trạng thái form
  const [ten, setTen] = useState('');
  const [giaBan, setGiaBan] = useState('');
  const [soLuong, setSoLuong] = useState('');
  
  // Cái này để hệ thống biết ông đang SỬA hay là THÊM MỚI
  const [idDangSua, setIdDangSua] = useState(null); 

  const layDuLieu = () => {
    fetch('http://localhost:8080/api/haisan')
      .then(response => response.json())
      .then(data => {
        // KIỂM TRA: Nếu đúng là mảng [] thì mới nhận, không thì gắn mảng rỗng để chống sập
        if (Array.isArray(data)) {
          setDanhSachHaiSan(data);
        } else {
          console.error("Backend trả về lỗi hoặc sai cấu trúc mảng rồi ông ơi:", data);
          setDanhSachHaiSan([]); // Gắn mảng rỗng để giao diện không bị trắng tinh
        }
      })
      .catch(error => {
        console.error('Lỗi kết nối rồi:', error);
        setDanhSachHaiSan([]);
      });
  };
  // Hàm xử lý chung cho cả THÊM và SỬA
  const luuDuLieu = (e) => {
    e.preventDefault();
    const haisanData = { ten, giaBan: Number(giaBan), soLuong: Number(soLuong) };

    if (idDangSua) {
      // NẾU CÓ ID -> GỌI API SỬA (PUT)
      fetch(`http://localhost:8080/api/haisan/${idDangSua}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(haisanData)
      }).then(() => {
        layDuLieu(); 
        huySua(); // Xóa trắng form
      });
    } else {
      // NẾU KHÔNG CÓ ID -> GỌI API THÊM (POST)
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

  // Hàm khi bấm nút "Xóa"
  const xoaHaiSan = (id) => {
    if (window.confirm("Ông có chắc muốn xóa món này khỏi kho không?")) {
      fetch(`http://localhost:8080/api/haisan/${id}`, {
        method: 'DELETE'
      }).then(() => layDuLieu()); // Xóa xong lấy lại danh sách mới
    }
  };

  // Hàm khi bấm nút "Sửa" (Đưa dữ liệu từ bảng lên Form)
  const batDauSua = (haisan) => {
    setIdDangSua(haisan.id); // Lưu lại ID để biết đang sửa con nào
    setTen(haisan.ten);
    setGiaBan(haisan.giaBan);
    setSoLuong(haisan.soLuong);
  };

  // Hàm xóa trắng form
  const huySua = () => {
    setIdDangSua(null);
    setTen(''); setGiaBan(''); setSoLuong('');
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', marginTop: '50px' }}>
      <h1 style={{ color: '#d35400' }}>🦐 QUẢN LÝ HẢI SẢN FULL-STACK 🦀</h1>
      
      {/* FORM NHẬP/SỬA LIỆU */}
      <form onSubmit={luuDuLieu} style={{ marginBottom: '30px', backgroundColor: '#f2f2f2', padding: '20px', display: 'inline-block', borderRadius: '8px' }}>
        <input type="text" placeholder="Tên hải sản" value={ten} onChange={(e) => setTen(e.target.value)} required style={{ margin: '5px', padding: '8px' }} />
        <input type="number" placeholder="Giá bán" value={giaBan} onChange={(e) => setGiaBan(e.target.value)} required style={{ margin: '5px', padding: '8px' }} />
        <input type="number" placeholder="Số lượng" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} required style={{ margin: '5px', padding: '8px' }} />
        
        {/* Nút này sẽ đổi màu và chữ tùy theo việc ông đang Thêm hay Sửa */}
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: idDangSua ? '#f39c12' : '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {idDangSua ? '🔄 Cập Nhật' : '➕ Thêm Mới'}
        </button>
        
        {/* Nếu đang sửa thì hiện thêm nút Hủy */}
        {idDangSua && (
          <button type="button" onClick={huySua} style={{ padding: '8px 15px', marginLeft: '5px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Hủy
          </button>
        )}
      </form>

      {/* BẢNG HIỂN THỊ CÓ NÚT THAO TÁC */}
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
          {danhSachHaiSan.map((haisan) => (
            <tr key={haisan.id}>
              <td style={{ fontWeight: 'bold' }}>{haisan.ten}</td>
              <td style={{ color: 'red' }}>{haisan.giaBan.toLocaleString('vi-VN')} đ</td>
              <td>{haisan.soLuong}</td>
              <td>
                <button onClick={() => batDauSua(haisan)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#f1c40f', border: 'none', cursor: 'pointer' }}>✏️ Sửa</button>
                <button onClick={() => xoaHaiSan(haisan.id)} style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>🗑️ Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;