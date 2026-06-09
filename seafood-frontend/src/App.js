import React, { useState, useEffect } from 'react';

// Khai báo danh sách các Danh Mục giống trang mẫu Đảo Hải Sản
const DANH_MUC_LIST = [
  { ma: 'TAT_CA', ten: '✨ Tất Cả' },
  { ma: 'Tom', ten: '🦐 Tôm Các Loại' },
  { ma: 'Cua', ten: '🦀 Cua - Ghẹ' },
  { ma: 'Muc', ten: '🦑 Mực Tươi' },
  { ma: 'Ca', ten: '🐟 Cá Hồi & Cá Tươi' },
];

function App() {
  const [danhSachHaiSan, setDanhSachHaiSan] = useState([]);
  const [danhMucChon, setDanhMucChon] = useState('TAT_CA'); // Lưu danh mục đang lọc
  const [gioHang, setGioHang] = useState([]); // Trạng thái giỏ hàng

  // Các trạng thái phục vụ Form Admin
  const [ten, setTen] = useState('');
  const [giaBan, setGiaBan] = useState('');
  const [soLuong, setSoLuong] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [danhMuc, setDanhMuc] = useState('Tom');
  const [idDangSua, setIdDangSua] = useState(null);

  // 1. LẤY DỮ LIỆU TỪ BACKEND
  const layDuLieu = () => {
    fetch('http://localhost:8080/api/haisan')
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.haisans)) {
          setDanhSachHaiSan(data.haisans);
        } else if (Array.isArray(data)) {
          setDanhSachHaiSan(data);
        } else {
          setDanhSachHaiSan([]);
        }
      })
      .catch(error => console.error('Lỗi kết nối API:', error));
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  // 2. LOGIC GIỎ HÀNG (MUA HÀNG)
  const themVaoGio = (haisan) => {
    const itemDaCo = gioHang.find(item => item.id === haisan.id);
    if (itemDaCo) {
      setGioHang(gioHang.map(item => item.id === haisan.id ? { ...item, soLuongMua: item.soLuongMua + 1 } : item));
    } else {
      setGioHang([...gioHang, { ...haisan, soLuongMua: 1 }]);
    }
  };

  const xoaKhoiGio = (id) => {
    setGioHang(gioHang.filter(item => item.id !== id));
  };

  const tongTienGioHang = gioHang.reduce((tong, item) => tong + (item.giaBan * item.soLuongMua), 0);

  // 3. LOGIC ADMIN (THÊM, SỬA, XÓA KHO)
  const luuDuLieu = (e) => {
    e.preventDefault();
    const haisanData = { ten, giaBan: Number(giaBan), soLuong: Number(soLuong), hinhAnh, danhMuc };

    if (idDangSua) {
      fetch(`http://localhost:8080/api/haisan/${idDangSua}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(haisanData)
      }).then(() => { layDuLieu(); huySua(); });
    } else {
      fetch('http://localhost:8080/api/haisan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(haisanData)
      }).then(() => { layDuLieu(); huySua(); });
    }
  };

  const xoaHaiSan = (id) => {
    if (window.confirm("Xóa món này khỏi kho nha ông?")) {
      fetch(`http://localhost:8080/api/haisan/${id}`, { method: 'DELETE' }).then(() => layDuLieu());
    }
  };

  const batDauSua = (haisan) => {
    setIdDangSua(haisan.id); setTen(haisan.ten); setGiaBan(haisan.giaBan);
    setSoLuong(haisan.soLuong); setHinhAnh(haisan.hinhAnh || ''); setDanhMuc(haisan.danhMuc || 'Tom');
  };

  const huySua = () => {
    setIdDangSua(null); setTen(''); setGiaBan(''); setSoLuong(''); setHinhAnh(''); setDanhMuc('Tom');
  };

  // Lọc danh sách hải sản hiển thị theo Tab được chọn
  const haiSanHienThi = danhMucChon === 'TAT_CA' 
    ? danhSachHaiSan 
    : danhSachHaiSan.filter(h => h.danhMuc === danhMucChon);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* 🌟 HEADER CHUYÊN NGHIỆP GIỐNG ĐẢO HẢI SẢN */}
      <header style={{ backgroundColor: '#007bff', color: 'white', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>🌊 ĐẢO HẢI SẢN - ĐỒ ÁN MẪU</h1>
        <div style={{ fontSize: '18px', fontWeight: 'bold', backgroundColor: '#ff9800', padding: '8px 15px', borderRadius: '20px' }}>
          🛒 Giỏ Hàng: {gioHang.length} món ({tongTienGioHang.toLocaleString('vi-VN')} đ)
        </div>
      </header>

      <div style={{ display: 'flex', padding: '30px 50px', gap: '30px' }}>
        
        {/* 🧭 THANH MENU DANH MỤC BÊN TRÁI (SIDEBAR) */}
        <aside style={{ width: '20%', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginTop: 0 }}>DANH MỤC</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {DANH_MUC_LIST.map(dm => (
              <li key={dm.ma} onClick={() => setDanhMucChon(dm.ma)} style={{ padding: '12px 15px', margin: '5px 0', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', backgroundColor: danhMucChon === dm.ma ? '#007bff' : 'transparent', color: danhMucChon === dm.ma ? 'white' : '#333' }}>
                {dm.ten}
              </li>
            ))}
          </ul>
        </aside>

        {/* 🏪 KHU VỰC HIỂN THỊ SẢN PHẨM DẠNG LƯỚI (CARD) CHO KHÁCH HÀNG */}
        <main style={{ width: '55%' }}>
          <h2 style={{ color: '#333', marginTop: 0 }}>🔥 Sản Phẩm Đang Bán</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {haiSanHienThi.length > 0 ? (
              haiSanHienThi.map(haisan => (
                <div key={haisan.id} style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: '0.3s' }}>
                  <img src={haisan.hinhAnh || 'https://via.placeholder.com/200x150?text=No+Image'} alt={haisan.ten} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>{haisan.ten}</h4>
                      <p style={{ color: 'red', fontWeight: 'bold', fontSize: '16px', margin: '0 0 5px 0' }}>{haisan.giaBan?.toLocaleString('vi-VN')} đ</p>
                      <p style={{ color: '#777', fontSize: '12px', margin: '0 0 15px 0' }}>Kho còn: {haisan.soLuong} phần</p>
                    </div>
                    <button onClick={() => themVaoGio(haisan)} style={{ width: '100%', padding: '10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                      🛒 Chọn Mua
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Mục này chưa nhập hàng ông ơi...</p>
            )}
          </div>
        </main>

        {/* 🧾 KHU VỰC CHI TIẾT GIỎ HÀNG BÊN PHẢI */}
        <aside style={{ width: '25%', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, borderBottom: '2px solid #ff9800', paddingBottom: '10px' }}>Chi Tiết Đơn Hàng</h3>
          {gioHang.length === 0 ? (
            <p style={{ color: '#aaa', fontStyle: 'italic' }}>Giỏ hàng trống trơn...</p>
          ) : (
            <div>
              {gioHang.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.ten}</span>
                    <br />
                    <span style={{ fontSize: '12px', color: '#777' }}>{item.soLuongMua} x {item.giaBan.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <button onClick={() => xoaKhoiGio(item.id)} style={{ backgroundColor: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>❌</button>
                </div>
              ))}
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Tổng: <span style={{ color: 'red', fontSize: '20px' }}>{tongTienGioHang.toLocaleString('vi-VN')} đ</span></h4>
                <button onClick={() => { alert('Chốt Đơn Thành Công! Hệ thống đã ghi nhận.'); setGioHang([]); }} style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                  ⚡ THANH TOÁN NGAY
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      <hr style={{ margin: '40px 50px 20px 50px', border: '1px solid #ddd' }} />

      {/* 🛠️ BẢNG ĐIỀU KHIỂN ADMIN QUẢN LÝ KHO */}
      <section style={{ padding: '0 50px' }}>
        <h2 style={{ color: '#555' }}>🛠️ Hệ Thống Nhập Kho (Admin)</h2>
        <form onSubmit={luuDuLieu} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'inline-block', width: '100%', boxSizing: 'border-box', textAlign: 'left' }}>
          <input type="text" placeholder="Tên hải sản" value={ten} onChange={(e) => setTen(e.target.value)} required style={{ margin: '5px', padding: '10px', width: '18%' }} />
          <input type="number" placeholder="Giá bán" value={giaBan} onChange={(e) => setGiaBan(e.target.value)} required style={{ margin: '5px', padding: '10px', width: '12%' }} />
          <input type="number" placeholder="Số lượng" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} required style={{ margin: '5px', padding: '10px', width: '10%' }} />
          <input type="text" placeholder="Link hình ảnh" value={hinhAnh} onChange={(e) => setHinhAnh(e.target.value)} style={{ margin: '5px', padding: '10px', width: '25%' }} />
          
          <select value={danhMuc} onChange={(e) => setDanhMuc(e.target.value)} style={{ margin: '5px', padding: '10px', width: '15%' }}>
            <option value="Tom">静态 🦐 Tôm</option>
            <option value="Cua">🦀 Cua</option>
            <option value="Muc">🦑 Mực</option>
            <option value="Ca">🐟 Cá</option>
          </select>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: idDangSua ? '#f39c12' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {idDangSua ? '🔄 Cập Nhật' : '➕ Thêm Vào Kho'}
          </button>
          {idDangSua && <button type="button" onClick={huySua} style={{ padding: '10px 15px', marginLeft: '5px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px' }}>Hủy</button>}
        </form>

        {/* BẢNG KHO HÀNG */}
        <table border="1" cellPadding="10" style={{ margin: '20px 0 50px 0', borderCollapse: 'collapse', width: '100%', backgroundColor: 'white' }}>
          <thead style={{ backgroundColor: '#343a40', color: 'white' }}>
            <tr>
              <th>Hình Ảnh</th>
              <th>Tên</th>
              <th>Danh Mục</th>
              <th>Giá Cả</th>
              <th>Kho Còn</th>
              <th>Quản Lý</th>
            </tr>
          </thead>
          <tbody>
            {danhSachHaiSan.map((haisan) => (
              <tr key={haisan.id}>
                <td><img src={haisan.hinhAnh || 'https://via.placeholder.com/50'} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover' }} /></td>
                <td style={{ fontWeight: 'bold' }}>{haisan.ten}</td>
                <td>{haisan.danhMuc}</td>
                <td style={{ color: 'red' }}>{haisan.giaBan?.toLocaleString('vi-VN')} đ</td>
                <td>{haisan.soLuong}</td>
                <td>
                  <button onClick={() => batDauSua(haisan)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer' }}>✏️ Sửa</button>
                  <button onClick={() => xoaHaiSan(haisan.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>🗑️ Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;