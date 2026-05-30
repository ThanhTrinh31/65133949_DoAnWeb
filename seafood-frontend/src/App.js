import React, { useState, useEffect } from 'react';

const HaiSanManager = () => {
    // Các State quản lý dữ liệu
    const [haisans, setHaisans] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    // State cho Form (Thêm/Sửa) -> ĐÃ ĐỒNG BỘ THÀNH giaBan
    const [formData, setFormData] = useState({ id: '', ten: '', giaBan: '', soLuong: '' });
    const [isEditing, setIsEditing] = useState(false);

    // 1. Gọi API lấy dữ liệu (Chạy mỗi khi page thay đổi)
    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/haisan?keyword=${keyword}&page=${page}&size=5`);
            const data = await res.json();
            setHaisans(data.haisans);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi fetch dữ liệu:", error);
        }
    };

    // 2. Xử lý tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0); // Đưa về trang 1 khi tìm kiếm
        fetchData();
    };

    // 3. Xử lý Input trong Form (Tự động bắt theo thuộc tính name="giaBan")
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Xử lý Lưu (Thêm mới HOẶC Cập nhật)
    const handleSave = async (e) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing 
            ? `http://localhost:8080/api/haisan/${formData.id}` 
            : 'http://localhost:8080/api/haisan';

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
            setFormData({ id: '', ten: '', giaBan: '', soLuong: '' }); // ĐÃ SỬA THÀNH giaBan KHHI LÀM SẠCH FORM
            setIsEditing(false);
            fetchData(); // Tải lại danh sách
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
        }
    };

    // 5. Chuẩn bị dữ liệu để Sửa -> ĐÃ SỬA THÀNH giaBan: hs.giaBan
    const handleEditClick = (hs) => {
        setFormData({ id: hs.id, ten: hs.ten, giaBan: hs.giaBan, soLuong: hs.soLuong });
        setIsEditing(true);
    };

    // 6. Xử lý Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa?")) {
            try {
                await fetch(`http://localhost:8080/api/haisan/${id}`, { method: 'DELETE' });
                alert("Xóa thành công!");
                fetchData();
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
            }
        }
    };

    // GIAO DIỆN HIỂN THỊ
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Quản Lý Cửa Hàng Hải Sản</h1>

            {/* FORM THÊM / SỬA */}
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h3>{isEditing ? "Sửa Hải Sản" : "Thêm Hải Sản Mới"}</h3>
                <form onSubmit={handleSave}>
                    <input type="text" name="ten" placeholder="Tên hải sản" value={formData.ten} onChange={handleInputChange} required style={{ margin: '5px' }}/>
                    
                    {/* ĐÃ SỬA: Thay đổi name và value thành giaBan */}
                    <input type="number" name="giaBan" placeholder="Giá bán" value={formData.giaBan} onChange={handleInputChange} required style={{ margin: '5px' }}/>
                    
                    <input type="number" name="soLuong" placeholder="Số lượng" value={formData.soLuong} onChange={handleInputChange} required style={{ margin: '5px' }}/>
                    <button type="submit" style={{ padding: '5px 10px', background: 'blue', color: 'white' }}>
                        {isEditing ? "Cập Nhật" : "Thêm Mới"}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', ten: '', giaBan: '', soLuong: '' }); }} style={{ marginLeft: '5px' }}>Hủy</button>
                    )}
                </form>
            </div>

            {/* THANH TÌM KIẾM */}
            <form onSubmit={handleSearch} style={{ marginBottom: '15px' }}>
                <input type="text" placeholder="Tìm tên hải sản..." value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ padding: '5px' }}/>
                <button type="submit" style={{ padding: '5px' }}>Tìm Kiếm</button>
            </form>

            {/* BẢNG DANH SÁCH */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f4f4f4' }}>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {haisans.map((hs) => (
                        <tr key={hs.id}>
                            <td>{hs.ten}</td>
                            
                            {/* ĐÃ SỬA: Hiển thị đúng biến hs.giaBan từ MongoDB trả về */}
                            <td>{hs.giaBan ? hs.giaBan.toLocaleString() : 0} VNĐ</td>
                            
                            <td>{hs.soLuong}</td>
                            <td>
                                <button onClick={() => handleEditClick(hs)} style={{ marginRight: '10px', background: 'orange' }}>Sửa</button>
                                <button onClick={() => handleDelete(hs.id)} style={{ background: 'red', color: 'white' }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* PHÂN TRANG */}
            <div style={{ marginTop: '15px' }}>
                <button disabled={page === 0} onClick={() => setPage(page - 1)}> Trang trước </button>
                <span style={{ margin: '0 15px' }}>Trang {page + 1} / {totalPages === 0 ? 1 : totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}> Trang sau </button>
            </div>
        </div>
    );
};

export default HaiSanManager;