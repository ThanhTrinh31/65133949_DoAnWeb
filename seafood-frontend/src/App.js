import React, { useState, useEffect, useRef } from 'react';

// 1. CẤU HÌNH DỮ LIỆU TĨNH
const DANH_MUC_LIST = [
  { ma: 'TAT_CA', ten: '✨ Tất Cả' },
  { ma: 'Tom', ten: '🦐 Tôm Các Loại' },
  { ma: 'CuaGhe', ten: '🦀 Cua - Ghẹ' },
  { ma: 'Muc', ten: '🦑 Mực tươi' },
  { ma: 'CaHoi', ten: '🐟 Cá Hồi' },
  { ma: 'NgaoSooOc', ten: '🐚 Ngao - Sò - Ốc' },
  { ma: 'HauSua', ten: '🦪 Hàu sữa' },
  { ma: 'GiaViSot', ten: '🌶️ Gia Vị - Sốt' },
];

function App() {
  // --- TẦNG QUẢN LÝ TRẠNG THÁI ---
  const [danhSachHaiSan, setDanhSachHaiSan] = useState([]);
  const [danhMucChon, setDanhMucChon] = useState('TAT_CA');
  const [gioHang, setGioHang] = useState([]);

  // Form Admin State
  const [ten, setTen] = useState('');
  const [giaBan, setGiaBan] = useState('');
  const [soLuong, setSoLuong] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [danhMuc, setDanhMuc] = useState('Tom');
  const [idDangSua, setIdDangSua] = useState(null);
  const formAdminRef = useRef(null);

  // State cho Đặt Hàng
  const [hienFormDatHang, setHienFormDatHang] = useState(false);
  const [tenKhach, setTenKhach] = useState('');
  const [sdt, setSdt] = useState('');
  const [email, setEmail] = useState('');
  const [huyenChon, setHuyenChon] = useState('NhaTrang');
  const [diaChiChiTiet, setDiaChiChiTiet] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [phuongThucTT, setPhuongThucTT] = useState('COD');
  const [ngayGiao, setNgayGiao] = useState('');
  const [khungGioGiao, setKhungGioGiao] = useState('ANY');
  const [gioGiaoCuThe, setGioGiaoCuThe] = useState('08:00');

  const isAdminMode = new URLSearchParams(window.location.search).get('admin') === 'true';

  // --- TẦNG GIAO TIẾP DỮ LIỆU ---
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
    const today = new Date().toISOString().split('T')[0];
    setNgayGiao(today);
  }, []);

  // --- TẦNG XỬ LÝ LOGIC NGHIỆP VỤ ---
  
  const themVaoGio = (haisan) => {
    if (haisan.soLuong <= 0) {
      alert("Món này đã hết hàng tạm thời!");
      return;
    }
    const itemDaCo = gioHang.find(item => item.id === haisan.id);
    if (itemDaCo) {
      if (itemDaCo.soLuongMua >= haisan.soLuong) {
        alert(`Kho hiện tại chỉ còn tối đa ${haisan.soLuong} phần thôi ông ơi!`);
        return;
      }
      setGioHang(gioHang.map(item => item.id === haisan.id ? { ...item, soLuongMua: item.soLuongMua + 1 } : item));
    } else {
      setGioHang([...gioHang, { ...haisan, soLuongMua: 1 }]);
    }
  };

  // 🔥 TÍNH NĂNG MỚI: Tự nhập số lượng và bấm cộng trừ
  const capNhatSoLuongGioHang = (id, soLuongMoi) => {
    const item = gioHang.find(i => i.id === id);
    if (!item) return;

    let sl = parseInt(soLuongMoi, 10);
    if (isNaN(sl) || sl < 1) sl = 1; // Nếu nhập sai hoặc <= 0 thì tự gán bằng 1
    
    if (sl > item.soLuong) {
      alert(`Kho hiện tại chỉ còn tối đa ${item.soLuong} phần thôi!`);
      sl = item.soLuong;
    }

    setGioHang(gioHang.map(i => i.id === id ? { ...i, soLuongMua: sl } : i));
  };

  const tangSoLuong = (id) => {
    const item = gioHang.find(i => i.id === id);
    if (item) capNhatSoLuongGioHang(id, item.soLuongMua + 1);
  };

  const giamSoLuong = (id) => {
    const item = gioHang.find(i => i.id === id);
    if (item && item.soLuongMua > 1) capNhatSoLuongGioHang(id, item.soLuongMua - 1);
  };

  const xoaKhoiGio = (id) => {
    setGioHang(gioHang.filter(item => item.id !== id));
  };

  const tongTienHang = gioHang.reduce((tong, item) => tong + (item.giaBan * item.soLuongMua), 0);

  // 🔥 ĐÃ FIX LỖI TRỐNG DỮ LIỆU & CẬP NHẬT MỐC THỜI GIAN THEO YÊU CẦU
  const tinhShipVaThoiGian = () => {
    let phiShip = 0;
    let thoiGianGiaoKhaiBao = '';

    if (huyenChon === 'NhaTrang') {
      phiShip = tongTienHang > 1000000 ? 0 : 30000;
      thoiGianGiaoKhaiBao = '2 giờ';
    } else if (['CamRanh', 'DienKhanh', 'NinhHoa'].includes(huyenChon)) {
      phiShip = 100000;
      thoiGianGiaoKhaiBao = '3 giờ';
    } else {
      phiShip = 200000;
      thoiGianGiaoKhaiBao = '5 giờ';
    }
    return { phiShip, thoiGianGiaoKhaiBao };
  };

  const { phiShip, thoiGianGiaoKhaiBao } = tinhShipVaThoiGian();
  const tongThanhToanCuoiCung = tongTienHang + phiShip;

  const dinhDangNgayVN = (ngayGoc) => {
    if (!ngayGoc) return '';
    const [year, month, day] = ngayGoc.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleXacNhanDatHang = (e) => {
    e.preventDefault();
    const donHangData = {
      tenKhach, sdt, email, huyenChon, diaChiChiTiet, ghiChu, phuongThucTT,
      ngayGiao, khungGioGiao, gioGiaoCuThe, tongTien: tongThanhToanCuoiCung,
      items: gioHang.map(i => ({ id: i.id, ten: i.ten, soLuongMua: i.soLuongMua }))
    };

    fetch('http://localhost:8080/api/haisan/dat-hang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donHangData)
    }).then(() => {
      alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n\nChào ông/bà ${tenKhach},\nĐơn hàng trị giá ${tongThanhToanCuoiCung.toLocaleString('vi-VN')} đ đã được Đại Hải Sản ghi nhận.\n⏱️ Thời gian nhận: Khung giờ ${khungGioGiao === 'ANY' ? 'Bất kỳ' : gioGiaoCuThe} - Ngày ${dinhDangNgayVN(ngayGiao)}\n🚚 Thời gian để giao đến bạn: ${thoiGianGiaoKhaiBao}.\nCảm ơn bạn đã ủng hộ cửa hàng!`);
      setGioHang([]);
      setHienFormDatHang(false);
      layDuLieu();
    }).catch(err => console.error('Lỗi khi đặt hàng:', err));
  };

  const luuDuLieu = (e) => {
    e.preventDefault();
    const haisanData = { ten, giaBan: Number(giaBan), soLuong: Number(soLuong), hinhAnh, danhMuc };
    if (idDangSua) {
      fetch(`http://localhost:8080/api/haisan/${idDangSua}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(haisanData)
      }).then(() => { alert("Cập nhật thành công!"); window.location.href = window.location.pathname + '?admin=true'; });
    } else {
      fetch('http://localhost:8080/api/haisan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(haisanData)
      }).then(() => { alert("Thêm vào kho thành công!"); window.location.href = window.location.pathname + '?admin=true'; });
    }
  };

  const xoaHaiSan = (id) => {
    if (window.confirm("Xóa món này khỏi kho?")) {
      fetch(`http://localhost:8080/api/haisan/${id}`, { method: 'DELETE' }).then(() => { window.location.href = window.location.pathname + '?admin=true'; });
    }
  };

  const batDauSua = (haisan) => {
    setIdDangSua(haisan.id); setTen(haisan.ten); setGiaBan(haisan.giaBan);
    setSoLuong(haisan.soLuong); setHinhAnh(haisan.hinhAnh || ''); setDanhMuc(haisan.danhMuc || 'Tom');
    setTimeout(() => { if (formAdminRef.current) formAdminRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const huySua = () => { setIdDangSua(null); setTen(''); setGiaBan(''); setSoLuong(''); setHinhAnh(''); setDanhMuc('Tom'); };

  const hienThiTenDanhMuc = (maDm) => {
    const dm = DANH_MUC_LIST.find(d => d.ma === maDm);
    return dm ? dm.ten.replace(/✨|🦐|🦀|🦑|🐟|🐚|🦪|🌶️/g, '').trim() : maDm;
  };

  const haiSanHienThi = danhMucChon === 'TAT_CA' ? danhSachHaiSan : danhSachHaiSan.filter(h => h.danhMuc === danhMucChon);

  // --- TẦNG ĐIỀU HƯỚNG GIAO DIỆN ---
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '10px' }}>
      <style>{`
        .main-container { display: flex; padding: 25px 40px; gap: 20px; align-items: flex-start; }
        .sidebar-left { width: 18%; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); position: -webkit-sticky; position: sticky; top: 20px; }
        .product-grid-container { width: 57%; flex-grow: 1; }
        .product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        .cart-right { width: 25%; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); position: -webkit-sticky; position: sticky; top: 20px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; overflow-y: auto; padding: 20px 0; }
        .modal-content { background-color: white; padding: 30px; border-radius: 12px; width: 70%; max-width: 900px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: left; max-height: 90vh; overflow-y: auto; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .qr-placeholder { border: 2px dashed #007bff; background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 6px; margin-top: 15px; }
        /* Tùy chỉnh ẩn mũi tên mặc định của thẻ input type="number" cho đẹp */
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        
        @media (max-width: 1400px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 1050px) {
          .main-container { display: flex; flex-direction: column; padding: 15px; gap: 15px; }
          .sidebar-left { width: 100%; position: static; }
          .sidebar-left ul { display: flex; flex-wrap: wrap; gap: 8px; }
          .sidebar-left ul li { margin: 0 !important; padding: 8px 12px !important; }
          .product-grid-container { width: 100%; }
          .product-grid { grid-template-columns: repeat(2, 1fr); }
          .cart-right { width: 100%; position: static; }
        }
      `}</style>

      <Header AppName="🌊 ĐẠI HẢI SẢN" gioHangLength={gioHang.length} tongTienHang={tongTienHang} />

      <div className="main-container">
        <CategorySidebar danhMucChon={danhMucChon} setDanhMucChon={setDanhMucChon} />
        <ProductGrid haiSanHienThi={haiSanHienThi} themVaoGio={themVaoGio} />
        <CartSidebar 
          gioHang={gioHang} tongTienHang={tongTienHang} 
          xoaKhoiGio={xoaKhoiGio} setHienFormDatHang={setHienFormDatHang}
          tangSoLuong={tangSoLuong} giamSoLuong={giamSoLuong} capNhatSoLuongGioHang={capNhatSoLuongGioHang}
        />
      </div>

      {hienFormDatHang && (
        <CheckoutModal 
          setHienFormDatHang={setHienFormDatHang} handleXacNhanDatHang={handleXacNhanDatHang}
          tenKhach={tenKhach} setTenKhach={setTenKhach} sdt={sdt} setSdt={setSdt} email={email} setEmail={setEmail}
          huyenChon={huyenChon} setHuyenChon={setHuyenChon} diaChiChiTiet={diaChiChiTiet} setDiaChiChiTiet={setDiaChiChiTiet}
          ghiChu={ghiChu} setGhiChu={setGhiChu} ngayGiao={ngayGiao} setNgayGiao={setNgayGiao}
          khungGioGiao={khungGioGiao} setKhungGioGiao={setKhungGioGiao} gioGiaoCuThe={gioGiaoCuThe} setGioGiaoCuThe={setGioGiaoCuThe}
          phuongThucTT={phuongThucTT} setPhuongThucTT={setPhuongThucTT} tongTienHang={tongTienHang} phiShip={phiShip}
          thoiGianGiaoKhaiBao={thoiGianGiaoKhaiBao} tongThanhToanCuoiCung={tongThanhToanCuoiCung}
        />
      )}

      <Footer hotline="0963670363" email="Daihaisan31@gmail.com" />

      {isAdminMode && (
        <AdminPanel 
          formAdminRef={formAdminRef} luuDuLieu={luuDuLieu} ten={ten} setTen={setTen}
          giaBan={giaBan} setGiaBan={setGiaBan} soLuong={soLuong} setSoLuong={setSoLuong}
          hinhAnh={hinhAnh} setHinhAnh={setHinhAnh} danhMuc={danhMuc} setDanhMuc={setDanhMuc}
          idDangSua={idDangSua} huySua={huySua} danhSachHaiSan={danhSachHaiSan}
          hienThiTenDanhMuc={hienThiTenDanhMuc} batDauSua={batDauSua} xoaHaiSan={xoaHaiSan}
        />
      )}
    </div>
  );
}

// =================================================================
// --- CÁC SUB-COMPONENTS SẠCH ĐẸP ---
// =================================================================

function Header({ AppName, gioHangLength, tongTienHang }) {
  return (
    <header style={{ backgroundColor: '#007bff', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{AppName}</h1>
      <div style={{ fontSize: '18px', fontWeight: 'bold', backgroundColor: '#ff9800', padding: '8px 15px', borderRadius: '20px' }}>
        🛒 Giỏ Hàng: {gioHangLength} món ({tongTienHang.toLocaleString('vi-VN')} đ)
      </div>
    </header>
  );
}

function CategorySidebar({ danhMucChon, setDanhMucChon }) {
  return (
    <aside className="sidebar-left">
      <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginTop: 0, fontSize: '15px', textAlign: 'left' }}>DANH MỤC SẢN PHẨM</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
        {DANH_MUC_LIST.map(dm => (
          <li key={dm.ma} onClick={() => setDanhMucChon(dm.ma)} style={{ padding: '10px 12px', margin: '5px 0', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: danhMucChon === dm.ma ? '#007bff' : 'transparent', color: danhMucChon === dm.ma ? 'white' : '#333' }}>
            {dm.ten}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function ProductGrid({ haiSanHienThi, themVaoGio }) {
  return (
    <main className="product-grid-container">
      <h2 style={{ color: '#333', marginTop: 0, fontSize: '22px', textAlign: 'left' }}>🔥 Sản Phẩm Bán Chạy</h2>
      <div className="product-grid">
        {haiSanHienThi.length > 0 ? (
          haiSanHienThi.map(haisan => (
            <div key={haisan.id} style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <img src={haisan.hinhAnh || 'https://via.placeholder.com/200x150?text=No+Image'} alt={haisan.ten} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '12px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333', height: '38px', overflow: 'hidden', textAlign: 'left' }}>{haisan.ten}</h4>
                  <p style={{ color: 'red', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px 0', textAlign: 'left' }}>{haisan.giaBan?.toLocaleString('vi-VN')} đ</p>
                  <p style={{ color: '#777', fontSize: '11px', margin: '0 0 12px 0', textAlign: 'left' }}>Kho: {haisan.soLuong} phần</p>
                </div>
                <button onClick={() => themVaoGio(haisan)} style={{ width: '100%', padding: '8px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                  🛒 Chọn Mua
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontStyle: 'italic', color: '#888', textAlign: 'left' }}>Mục này chưa có hàng bán ông ơi...</p>
        )}
      </div>
    </main>
  );
}

// 🔥 TÍNH NĂNG MỚI: Hiển thị bộ tăng giảm số lượng cực mượt
function CartSidebar({ gioHang, tongTienHang, xoaKhoiGio, setHienFormDatHang, tangSoLuong, giamSoLuong, capNhatSoLuongGioHang }) {
  return (
    <aside className="cart-right">
      <h3 style={{ marginTop: 0, borderBottom: '2px solid #ff9800', paddingBottom: '10px', textAlign: 'left' }}>Chi Tiết Đơn Hàng</h3>
      {gioHang.length === 0 ? (
        <p style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'left' }}>Giỏ hàng trống trơn...</p>
      ) : (
        <div>
          {gioHang.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
              <img src={item.hinhAnh} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ textAlign: 'left', flexGrow: 1 }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px', display: 'block' }}>{item.ten}</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                  <button onClick={() => giamSoLuong(item.id)} style={{ padding: '2px 8px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>-</button>
                  <input
                    type="number"
                    value={item.soLuongMua}
                    onChange={(e) => capNhatSoLuongGioHang(item.id, e.target.value)}
                    style={{ width: '40px', textAlign: 'center', padding: '2px', border: '1px solid #ccc', borderRadius: '4px', fontWeight: 'bold', color: '#333' }}
                  />
                  <button onClick={() => tangSoLuong(item.id)} style={{ padding: '2px 8px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>+</button>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: 'red', fontSize: '13px', marginBottom: '8px' }}>
                  {(item.giaBan * item.soLuongMua).toLocaleString('vi-VN')} đ
                </div>
                <button onClick={() => xoaKhoiGio(item.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '15px' }} title="Xóa món này">🗑️</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Tạm tính: <span style={{ color: 'red', fontSize: '18px' }}>{tongTienHang.toLocaleString('vi-VN')} đ</span></h4>
            <button onClick={() => setHienFormDatHang(true)} style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              ⚡ THANH TOÁN NGAY
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

function CheckoutModal({ 
  setHienFormDatHang, handleXacNhanDatHang, tenKhach, setTenKhach, sdt, setSdt, email, setEmail,
  huyenChon, setHuyenChon, diaChiChiTiet, setDiaChiChiTiet, ghiChu, setGhiChu, ngayGiao, setNgayGiao,
  khungGioGiao, setKhungGioGiao, gioGiaoCuThe, setGioGiaoCuThe, phuongThucTT, setPhuongThucTT,
  tongTienHang, phiShip, thoiGianGiaoKhaiBao, tongThanhToanCuoiCung
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#007bff' }}>📝 THÔNG TIN ĐẶT HÀNG & GIAO NHẬN</h2>
          <button onClick={() => setHienFormDatHang(false)} style={{ padding: '5px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng X</button>
        </div>

        <form onSubmit={handleXacNhanDatHang} className="form-grid">
          <div>
            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#555' }}>📍 1. Địa Chỉ Giao Hàng</h3>
            
            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Họ và Tên Khách Hàng *</label>
            <input type="text" value={tenKhach} onChange={(e) => setTenKhach(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="Nguyễn Văn A" />

            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Số Điện Thoại Nhận Hàng *</label>
            <input type="tel" value={sdt} onChange={(e) => setSdt(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="0905xxxxxx" />

            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Địa Chỉ Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="khachhang@gmail.com" />

            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Quốc Gia</label>
            <input type="text" value="Việt Nam" disabled style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#eee' }} />

            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Tỉnh / Thành Phố</label>
            <input type="text" value="Khánh Hòa (Chỉ hỗ trợ giao tại Khánh Hòa)" disabled style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#eee', color: 'red', fontWeight: 'bold' }} />

            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Quận / Huyện (Chọn để tính phí ship) *</label>
            <select value={huyenChon} onChange={(e) => setHuyenChon(e.target.value)} style={{ width: '100%', padding: '8px', fontWeight: 'bold' }}>
              <option value="NhaTrang">TP. Nha Trang (Nội thành)</option>
              <option value="CamRanh">TP. Cam Ranh</option>
              <option value="NinhHoa">Thị xã Ninh Hòa</option>
              <option value="DienKhanh">Huyện Diên Khánh</option>
              <option value="CamLam">Huyện Cam Lâm</option>
              <option value="VanNinh">Huyện Vạn Ninh</option>
              <option value="KhanhSon">Huyện Khánh Sơn</option>
              <option value="KhanhVinh">Huyện Khánh Vĩnh</option>
            </select>

            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã) *</label>
            <input type="text" value={diaChiChiTiet} onChange={(e) => setDiaChiChiTiet(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="Ví dụ: 12 Ngô Gia Tự, Phường Phước Tiến" />

            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Ghi Chú Đơn Hàng</label>
            <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', height: '60px' }} placeholder="Giao hàng nhẹ tay, gọi điện trước khi đến..." />
          </div>

          <div>
            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#555' }}>⏱️ 2. Thời Gian Giao Nhận</h3>
            
            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Chọn Ngày Giao</label>
            <input 
              type="text" 
              value={ngayGiao ? ngayGiao.split('-').reverse().join('/') : ''} 
              placeholder="dd/mm/yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => { if(!e.target.value) e.target.type = 'text'; }}
              onChange={(e) => setNgayGiao(e.target.value)}
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', fontWeight: 'bold' }} 
            />

            <label style={{ fontWeight: 'bold', display: 'block', margin: '10px 0 5px 0' }}>Khung Giờ Giao Hàng *</label>
            <div style={{ display: 'flex', gap: '15px', margin: '5px 0' }}>
              <label><input type="radio" name="time_mode" checked={khungGioGiao === 'ANY'} onChange={() => setKhungGioGiao('ANY')} /> Giao bất kì khung giờ nào</label>
              <label><input type="radio" name="time_mode" checked={khungGioGiao === 'CUSTOM'} onChange={() => setKhungGioGiao('CUSTOM')} /> Chọn giờ cụ thể</label>
            </div>
            {khungGioGiao === 'CUSTOM' && (
              <input type="time" value={gioGiaoCuThe} onChange={(e) => setGioGiaoCuThe(e.target.value)} style={{ width: '50%', padding: '8px', marginTop: '5px' }} />
            )}

            <h3 style={{ marginTop: '25px', fontSize: '16px', color: '#555', borderTop: '1px solid #eee', paddingTop: '15px' }}>💳 3. Phương Thức Thanh Toán</h3>
            <div style={{ display: 'flex', gap: '20px', margin: '10px 0' }}>
              <label style={{ fontWeight: 'bold', cursor: 'pointer' }}><input type="radio" name="payment_mode" checked={phuongThucTT === 'COD'} onChange={() => setPhuongThucTT('COD')} /> Thanh toán khi nhận hàng (COD)</label>
              <label style={{ fontWeight: 'bold', cursor: 'pointer' }}><input type="radio" name="payment_mode" checked={phuongThucTT === 'BANKING'} onChange={() => setPhuongThucTT('BANKING')} /> Chuyển khoản qua Ngân hàng</label>
            </div>

            {phuongThucTT === 'BANKING' && (
              <div className="qr-placeholder">
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#007bff' }}>📸 QUÉT MÃ QR ĐỂ CHUYỂN KHOẢN THANH TOÁN</p>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=DaiHaiSanStore" 
                  alt="Ma QR Thanh Toan" 
                  style={{ width: '160px', height: '160px', border: '1px solid #ccc', padding: '5px', backgroundColor: 'white' }} 
                /> 
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Số tài khoản: 090905101205</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>MB Bank Huỳnh Thanh Trình</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#888', fontStyle: 'italic' }}>(Thông tin đơn hàng sẽ được gửi qua email của bạn một cách nhanh chóng.)</p>
              </div>
            )}

            {/* 🔥 ĐÃ CẬP NHẬT TÊN NHÃN: Thời gian để giao đến bạn */}
            <div style={{ marginTop: '25px', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', border: '1px solid #ffeeba' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>💵 Tiền hàng: <b>{tongTienHang.toLocaleString('vi-VN')} đ</b></p>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>🚚 Phí giao hàng: <b style={{ color: phiShip === 0 ? 'green' : 'black' }}>{phiShip === 0 ? 'Miễn phí (Freeship >1tr)' : `${phiShip.toLocaleString('vi-VN')} đ`}</b></p>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#856404' }}>⏱️ Thời gian để giao đến bạn: <b>{thoiGianGiaoKhaiBao}</b></p>
              <hr style={{ border: 'none', borderTop: '1px solid #ffeeba' }} />
              <h3 style={{ margin: '5px 0 0 0', color: 'red', fontSize: '18px' }}>Tổng thanh toán: {tongThanhToanCuoiCung.toLocaleString('vi-VN')} đ</h3>
            </div>

            <button type="submit" style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              🚀 XÁC NHẬN ĐẶT HÀNG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Footer({ hotline, email }) {
  return (
    <footer style={{ backgroundColor: '#343a40', color: '#bbb', padding: '25px 40px', marginTop: '60px', textAlign: 'center', fontSize: '14px', borderTop: '3px solid #007bff' }}>
      <p style={{ margin: '0 0 8px 0', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>🌊 HỆ THỐNG CỬA HÀNG ĐẠI HẢI SẢN KHÁNH HÒA</p>
      <p style={{ margin: '5px 0' }}>📞 Hotline Hỗ Trợ: <b style={{ color: '#ff9800' }}>{hotline}</b> | ✉️ Email Đơn Hàng: <b style={{ color: '#007bff' }}>{email}</b></p>
    </footer>
  );
}

function AdminPanel({ 
  formAdminRef, luuDuLieu, ten, setTen, giaBan, setGiaBan, soLuong, setSoLuong,
  hinhAnh, setHinhAnh, danhMuc, setDanhMuc, idDangSua, huySua, danhSachHaiSan,
  hienThiTenDanhMuc, batDauSua, xoaHaiSan 
}) {
  return (
    <>
      <hr style={{ margin: '40px 40px 20px 40px', border: '1px solid #ddd' }} />
      <section style={{ padding: '0 40px' }}>
        <h2 ref={formAdminRef} style={{ color: '#555', textAlign: 'left', scrollMarginTop: '30px' }}>🛠️ Hệ Thống Nhập Kho (Admin)</h2>
        <form onSubmit={luuDuLieu} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'block', width: '100%', boxSizing: 'border-box', textAlign: 'left' }}>
          <input type="text" placeholder="Tên hải sản" value={ten} onChange={(e) => setTen(e.target.value)} required style={{ margin: '5px', padding: '10px', width: '22%', minWidth: '150px' }} />
          <input type="number" placeholder="Giá bán" value={giaBan} onChange={(e) => setGiaBan(e.target.value)} required style={{ margin: '5px', padding: '10px', width: '12%', minWidth: '100px' }} />
          <input type="number" placeholder="Số lượng" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} required style={{ margin: '5px', padding: '10px', width: '10%', minWidth: '80px' }} />
          <input type="text" placeholder="Link hình ảnh" value={hinhAnh} onChange={(e) => setHinhAnh(e.target.value)} style={{ margin: '5px', padding: '10px', width: '25%', minWidth: '180px' }} />
          
          <select value={danhMuc} onChange={(e) => setDanhMuc(e.target.value)} style={{ margin: '5px', padding: '10px', width: '15%', minWidth: '140px', fontWeight: 'bold' }}>
            <option value="Tom">🦐 Tôm Các Loại</option>
            <option value="CuaGhe">🦀 Cua - Ghẹ</option>
            <option value="Muc">🦑 Mực tươi</option>
            <option value="CaHoi">🐟 Cá Hồi</option>
            <option value="NgaoSooOc">🐚 Ngao - Sò - Ốc</option>
            <option value="HauSua">🦪 Hàu sữa</option>
            <option value="GiaViSot">🌶️ Gia Vị - Sốt</option>
          </select>

          <button type="submit" style={{ padding: '10px 20px', margin: '5px', backgroundColor: idDangSua ? '#f39c12' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {idDangSua ? '🔄 Cập Nhật' : '➕ Thêm Vào Kho'}
          </button>
          {idDangSua && <button type="button" onClick={huySua} style={{ padding: '10px 15px', marginLeft: '5px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px' }}>Hủy</button>}
        </form>

        <div style={{ overflowX: 'auto', width: '100%', marginTop: '20px' }}>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: 'white', minWidth: '700px' }}>
            <thead style={{ backgroundColor: '#343a40', color: 'white' }}>
              <tr><th>Hình Ảnh</th><th>Tên</th><th>Danh Mục</th><th>Giá Cả</th><th>Kho Còn</th><th>Quản Lý</th></tr>
            </thead>
            <tbody>
              {danhSachHaiSan.map((haisan) => (
                <tr key={haisan.id}>
                  <td><img src={haisan.hinhAnh || 'https://via.placeholder.com/50'} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover' }} /></td>
                  <td style={{ fontWeight: 'bold', textAlign: 'left' }}>{haisan.ten}</td>
                  <td style={{ color: '#007bff', fontWeight: 'bold', textAlign: 'left' }}>{hienThiTenDanhMuc(haisan.danhMuc)}</td>
                  <td style={{ color: 'red', fontWeight: 'bold', textAlign: 'left' }}>{haisan.giaBan?.toLocaleString('vi-VN')} đ</td>
                  <td>{haisan.soLuong}</td>
                  <td>
                    <button onClick={() => batDauSua(haisan)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer' }}>✏️ Sửa</button>
                    <button onClick={() => xoaHaiSan(haisan.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>🗑️ Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default App;