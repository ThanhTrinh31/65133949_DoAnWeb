package com.huynhthanhtrinh.seafood_store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class HaiSanController {

    @Autowired
    private HaiSanRepository repository;

    // Đường dẫn API để lấy danh sách
    @GetMapping("/api/haisan")
    public List<HaiSan> layDanhSachHaiSan() {
        List<HaiSan> danhSach = repository.findAll();
        
        // Nếu kho rỗng, ép Spring Boot tự động thêm 1 món vào kho để test
        if (danhSach.isEmpty()) {
            HaiSan hs = new HaiSan();
            hs.setTen("Cua Hoàng Đế (Auto Test)");
            hs.setGiaBan(2000000.0);
            hs.setSoLuong(5);
            repository.save(hs); // Lưu thẳng vào Database
            
            danhSach = repository.findAll(); // Cập nhật lại danh sách để hiển thị
        }
        
        return danhSach; 
    }
}