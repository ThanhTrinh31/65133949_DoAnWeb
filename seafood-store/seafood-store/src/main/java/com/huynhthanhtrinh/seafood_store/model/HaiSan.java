package com.huynhthanhtrinh.seafood_store.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "san_pham")
public class HaiSan {
    
    @Id
    private String id;
    
    private String ten;

    // Ép Spring Boot khi đọc DB phải tìm đúng chữ viết hoa 'giaBan' và 'soLuong' giống hình ông chụp
    @Field("giaBan")
    private Object giaBan; // Dùng Object để cân cả kiểu String lẫn kiểu Số trong DB
    
    @Field("soLuong")
    private int soLuong;
    
    private String hinhAnh;
    private String danhMuc;

    // --- HÀM GETTER VÀ SETTER ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTen() { return ten; }
    public void setTen(String ten) { this.ten = ten; }

    // Tự động convert từ String sang Double nếu ông lỡ nhập kiểu chữ trong MongoDB Compass
    public Double getGiaBan() {
        if (giaBan == null) return 0.0;
        if (giaBan instanceof Number) {
            return ((Number) giaBan).doubleValue();
        }
        try {
            return Double.parseDouble(giaBan.toString());
        } catch (Exception e) {
            return 0.0;
        }
    }
    public void setGiaBan(Object giaBan) { this.giaBan = giaBan; }

    public int getSoLuong() { return soLuong; }
    public void setSoLuong(int soLuong) { this.soLuong = soLuong; }

    public String getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(String hinhAnh) { this.hinhAnh = hinhAnh; }

    public String getDanhMuc() { return danhMuc; }
    public void setDanhMuc(String danhMuc) { this.danhMuc = danhMuc; }
}