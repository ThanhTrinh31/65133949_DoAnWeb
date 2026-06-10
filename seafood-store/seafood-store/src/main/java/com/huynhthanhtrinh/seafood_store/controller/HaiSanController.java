package com.huynhthanhtrinh.seafood_store.controller;

import com.huynhthanhtrinh.seafood_store.model.HaiSan;
import com.huynhthanhtrinh.seafood_store.repository.HaiSanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/haisan")
@CrossOrigin(origins = "http://localhost:3000")
public class HaiSanController {

    @Autowired
    private HaiSanRepository repository;

    // Giả lập lưu trữ Đơn hàng trực tiếp trên RAM Server
    private static List<Map<String, Object>> danhSachDonHang = new ArrayList<>();

    // 1. API LẤY DANH SÁCH HẢI SẢN
    @GetMapping
    public Map<String, Object> layDanhSach() {
        List<HaiSan> danhSach = repository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("haisans", danhSach);
        return response;
    }

    // 2. API THÊM MỚI SẢN PHẨM (POST)
    @PostMapping
    public HaiSan themHaiSan(@RequestBody HaiSan haisanMoi) {
        if (haisanMoi.getId() != null && haisanMoi.getId().trim().isEmpty()) {
            haisanMoi.setId(null);
        }
        return repository.save(haisanMoi);
    }

    // 3. API SỬA SẢN PHẨM (PUT)
    @PutMapping("/{id}")
    public HaiSan capNhatHaiSan(@PathVariable String id, @RequestBody HaiSan thongTinMoi) {
        thongTinMoi.setId(id);
        return repository.save(thongTinMoi);
    }

    // 4. API XÓA SẢN PHẨM (DELETE)
    @DeleteMapping("/{id}")
    public void xoaHaiSan(@PathVariable String id) {
        repository.deleteById(id);
    }

    // 🌟 5. API TỰ ĐỘNG TRỪ KHO KHI ĐẶT HÀNG CHỐT ĐƠN
    @PostMapping("/dat-hang")
    public Map<String, Object> xuLyDatHang(@RequestBody Map<String, Object> payload) {
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        
        // Tiến hành trừ kho vật lý trong MongoDB
        if (items != null) {
            for (Map<String, Object> item : items) {
                String id = (String) item.get("id");
                int soLuongMua = (int) item.get("soLuongMua");
                
                repository.findById(id).ifPresent(haisan -> {
                    int khoHienTai = haisan.getSoLuong();
                    if (khoHienTai >= soLuongMua) {
                        haisan.setSoLuong(khoHienTai - soLuongMua);
                        repository.save(haisan); // Lưu trực tiếp số lượng mới xuống MongoDB
                    }
                });
            }
        }
        
        // Lưu đơn hàng vào danh sách quản lý
        Map<String, Object> donHangMoi = new HashMap<>(payload);
        donHangMoi.put("idDonHang", "DH" + System.currentTimeMillis());
        donHangMoi.put("trangThai", "Chờ xử lý");
        danhSachDonHang.add(donHangMoi);

        Map<String, Object> res = new HashMap<>();
        // ✅ ĐÃ SỬA CHUẨN CÚ PHÁP: Dùng .put thay vì .setStatus
        res.put("status", "SUCCESS");
        return res;
    }

    // 🌟 6. API LẤY DANH SÁCH ĐƠN HÀNG CHO ADMIN DUYỆT
    @GetMapping("/don-hang")
    public List<Map<String, Object>> layDanhSachDonHang() {
        return danhSachDonHang;
    }

    // 🌟 7. API THAY ĐỔI TRẠNG THÁI ĐƠN HÀNG
    @PutMapping("/don-hang/{id}")
    public Map<String, Object> capNhatTrangThaiDonHang(@PathVariable String id) {
        for (Map<String, Object> dh : danhSachDonHang) {
            if (dh.get("idDonHang").equals(id)) {
                dh.put("trangThai", "Đã xử lý ✔️");
                break;
            }
        }
        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        return res;
    }
}