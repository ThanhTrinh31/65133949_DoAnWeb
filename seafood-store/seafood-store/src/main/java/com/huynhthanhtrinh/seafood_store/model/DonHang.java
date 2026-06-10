package com.huynhthanhtrinh.seafood_store.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "donhang")
public class DonHang {
    @Id
    private String id;
    private String tenKhachHang;
    private String soDienThoai;
    private String diaChi;
    private long tongTien;
    private List<ChiTietDonHang> danhSachMon;

    // Getter và Setter (Dùng Generate của Eclipse hoặc gõ tay)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTenKhachHang() { return tenKhachHang; }
    public void setTenKhachHang(String tenKhachHang) { this.tenKhachHang = tenKhachHang; }
    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }
    public long getTongTien() { return tongTien; }
    public void setTongTien(long tongTien) { this.tongTien = tongTien; }
    public List<ChiTietDonHang> getDanhSachMon() { return danhSachMon; }
    public void setDanhSachMon(List<ChiTietDonHang> danhSachMon) { this.danhSachMon = danhSachMon; }

    // Class con chứa thông tin từng món trong giỏ hàng
    public static class ChiTietDonHang {
        private String idHaiSan;
        private String tenHaiSan;
        private int soLuongMua;
        private long giaBan;

        // Getter & Setter
        public String getIdHaiSan() { return idHaiSan; }
        public void setIdHaiSan(String idHaiSan) { this.idHaiSan = idHaiSan; }
        public String getTenHaiSan() { return tenHaiSan; }
        public void setTenHaiSan(String tenHaiSan) { this.tenHaiSan = tenHaiSan; }
        public int getSoLuongMua() { return soLuongMua; }
        public void setSoLuongMua(int soLuongMua) { this.soLuongMua = soLuongMua; }
        public long getGiaBan() { return giaBan; }
        public void setGiaBan(long giaBan) { this.giaBan = giaBan; }
    }
}