import React, { useState, useEffect } from 'react';

const HaiSanManager = () => {
    // --- STATE CHUNG ---
    const [viewMode, setViewMode] = useState('CUSTOMER'); // 'CUSTOMER' hoặc 'ADMIN'
    const [haisans, setHaisans] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // --- STATE ADMIN ---
    const [formData, setFormData] = useState({ id: '', ten: '', giaBan: '', soLuong: '' });
    const [isEditing, setIsEditing] = useState(false);

    // --- STATE KHÁCH HÀNG (GIỎ HÀNG) ---
    const [cart, setCart] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({ tenKhachHang: '', soDienThoai: '', diaChi: '' });

    // 1. FETCH DỮ LIỆU
    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/haisan?keyword=${keyword}&page=${page}&size=6`);
            const data = await res.json();
            setHaisans(data.haisans);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi fetch:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchData();
    };

    // ==========================================
    // CÁC HÀM CỦA GIỎ HÀNG (CUSTOMER)
    // ==========================================
    const addToCart = (hs) => {
        const existingItem = cart.find(item => item.idHaiSan === hs.id);
        if (existingItem) {
            setCart(cart.map(item => item.idHaiSan === hs.id ? { ...item, soLuongMua: item.soLuongMua + 1 } : item));
        } else {
            setCart([...cart, { idHaiSan: hs.id, tenHaiSan: hs.ten, giaBan: hs.giaBan, soLuongMua: 1 }]);
        }
    };

    const removeFromCart = (idHaiSan) => {
        setCart(cart.filter(item => item.idHaiSan !== idHaiSan));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.giaBan * item.soLuongMua), 0);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Giỏ hàng đang trống!");
        
        const donHang = {
            ...customerInfo,
            tongTien: calculateTotal(),
            danhSachMon: cart
        };

        try {
            const res = await fetch('http://localhost:8080/api/donhang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donHang)
            });
            if (res.ok) {
                alert("Đặt hàng thành công! Trân trọng cảm ơn quý khách.");
                setCart([]); // Xóa giỏ hàng
                setCustomerInfo({ tenKhachHang: '', soDienThoai: '', diaChi: '' }); // Reset form
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
        }
    };

    // ==========================================
    // CÁC HÀM CỦA ADMIN (THÊM, SỬA, XÓA) - Y Như Cũ
    // ==========================================
    const handleAdminSave = async (e) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `http://localhost:8080/api/haisan/${formData.id}` : 'http://localhost:8080/api/haisan';
        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
            setFormData({ id: '', ten: '', giaBan: '', soLuong: '' });
            setIsEditing(false);
            fetchData();
        } catch (error) {}
    };

    const handleEditClick = (hs) => {
        setFormData({ id: hs.id, ten: hs.ten, giaBan: hs.giaBan, soLuong: hs.soLuong });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa món này?")) {
            await fetch(`http://localhost:8080/api/haisan/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    // ==========================================
    // GIAO DIỆN
    // ==========================================
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            {/* Thanh Điều Hướng Chế Độ */}
            <div style={{ marginBottom: '20px', background: '#333', padding: '10px', color: 'white' }}>
                <button onClick={() => setViewMode('CUSTOMER')} style={{ marginRight: '10px', padding: '10px', background: viewMode === 'CUSTOMER' ? 'green' : 'gray', color: 'white' }}>🛒 Cửa Hàng (Khách mua)</button>
                <button onClick={() => setViewMode('ADMIN')} style={{ padding: '10px', background: viewMode === 'ADMIN' ? 'blue' : 'gray', color: 'white' }}>⚙️ Quản Trị (Admin)</button>
            </div>

            {/* THANH TÌM KIẾM (Dùng chung cho cả 2 chế độ) */}
            <form onSubmit={handleSearch} style={{ marginBottom: '15px' }}>
                <input type="text" placeholder="Tìm tên hải sản..." value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ padding: '8px', width: '200px' }}/>
                <button type="submit" style={{ padding: '8px' }}>Tìm Kiếm</button>
            </form>

            {/* ============================================================== */}
            {/* GIAO DIỆN KHÁCH HÀNG */}
            {/* ============================================================== */}
            {viewMode === 'CUSTOMER' && (
                <div style={{ display: 'flex', gap: '20px' }}>
                    
                    {/* BÊN TRÁI: DANH SÁCH MÓN ĂN */}
                    <div style={{ flex: 2 }}>
                        <h2>Thực đơn hôm nay</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            {haisans.map((hs) => (
                                <div key={hs.id} style={{ border: '1px solid #ddd', padding: '15px', width: '200px', borderRadius: '8px', textAlign: 'center', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#ff6600' }}>{hs.ten}</h3>
                                    <p>Giá: <b>{hs.giaBan?.toLocaleString()} đ</b></p>
                                    <button onClick={() => addToCart(hs)} style={{ background: 'green', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                        + Thêm vào giỏ
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Phân trang */}
                        <div style={{ marginTop: '20px' }}>
                            <button disabled={page === 0} onClick={() => setPage(page - 1)}> Trang trước </button>
                            <span style={{ margin: '0 15px' }}>Trang {page + 1} / {totalPages === 0 ? 1 : totalPages}</span>
                            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}> Trang sau </button>
                        </div>
                    </div>

                    {/* BÊN PHẢI: GIỎ HÀNG & ĐẶT HÀNG */}
                    <div style={{ flex: 1, border: '2px solid #ccc', padding: '20px', borderRadius: '10px', background: '#f9f9f9', height: 'fit-content' }}>
                        <h2>🛒 Giỏ Hàng</h2>
                        {cart.length === 0 ? <p>Giỏ hàng trống.</p> : (
                            <ul style={{ paddingLeft: '20px' }}>
                                {cart.map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '10px' }}>
                                        <b>{item.tenHaiSan}</b> x {item.soLuongMua} <br/>
                                        Giá: {(item.giaBan * item.soLuongMua).toLocaleString()} đ
                                        <button onClick={() => removeFromCart(item.idHaiSan)} style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>[Xóa]</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <h3 style={{ color: 'red' }}>Tổng tiền: {calculateTotal().toLocaleString()} đ</h3>
                        
                        <hr />
                        <h4>Thông tin giao hàng</h4>
                        <form onSubmit={handleCheckout}>
                            <input type="text" placeholder="Tên người nhận" required value={customerInfo.tenKhachHang} onChange={e => setCustomerInfo({...customerInfo, tenKhachHang: e.target.value})} style={{ width: '90%', padding: '8px', marginBottom: '10px' }}/>
                            <input type="text" placeholder="Số điện thoại" required value={customerInfo.soDienThoai} onChange={e => setCustomerInfo({...customerInfo, soDienThoai: e.target.value})} style={{ width: '90%', padding: '8px', marginBottom: '10px' }}/>
                            <input type="text" placeholder="Địa chỉ giao" required value={customerInfo.diaChi} onChange={e => setCustomerInfo({...customerInfo, diaChi: e.target.value})} style={{ width: '90%', padding: '8px', marginBottom: '10px' }}/>
                            <button type="submit" style={{ width: '95%', padding: '12px', background: 'red', color: 'white', fontWeight: 'bold', fontSize: '16px', border: 'none', borderRadius: '5px' }}>ĐẶT HÀNG NGAY</button>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* GIAO DIỆN ADMIN (NHƯ CŨ) */}
            {/* ============================================================== */}
            {viewMode === 'ADMIN' && (
                <div>
                    <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                        <h3>{isEditing ? "Sửa Hải Sản" : "Thêm Hải Sản Mới"}</h3>
                        <form onSubmit={handleAdminSave}>
                            <input type="text" name="ten" placeholder="Tên hải sản" value={formData.ten} onChange={e => setFormData({...formData, ten: e.target.value})} required style={{ margin: '5px' }}/>
                            <input type="number" name="giaBan" placeholder="Giá bán" value={formData.giaBan} onChange={e => setFormData({...formData, giaBan: e.target.value})} required style={{ margin: '5px' }}/>
                            <input type="number" name="soLuong" placeholder="Số lượng" value={formData.soLuong} onChange={e => setFormData({...formData, soLuong: e.target.value})} required style={{ margin: '5px' }}/>
                            <button type="submit" style={{ padding: '5px 10px', background: 'blue', color: 'white' }}>{isEditing ? "Cập Nhật" : "Thêm Mới"}</button>
                            {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', ten: '', giaBan: '', soLuong: '' }); }} style={{ marginLeft: '5px' }}>Hủy</button>}
                        </form>
                    </div>

                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f4f4f4' }}>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Kho</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {haisans.map((hs) => (
                                <tr key={hs.id}>
                                    <td>{hs.ten}</td>
                                    <td>{hs.giaBan?.toLocaleString()} đ</td>
                                    <td>{hs.soLuong}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(hs)} style={{ marginRight: '10px', background: 'orange' }}>Sửa</button>
                                        <button onClick={() => handleDelete(hs.id)} style={{ background: 'red', color: 'white' }}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '15px' }}>
                        <button disabled={page === 0} onClick={() => setPage(page - 1)}> Trang trước </button>
                        <span style={{ margin: '0 15px' }}>Trang {page + 1} / {totalPages === 0 ? 1 : totalPages}</span>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}> Trang sau </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HaiSanManager;