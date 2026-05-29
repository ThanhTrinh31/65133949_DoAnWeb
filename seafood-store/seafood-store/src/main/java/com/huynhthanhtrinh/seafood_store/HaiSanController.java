package com.huynhthanhtrinh.seafood_store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HaiSanController {

    @Autowired
    private HaiSanRepository repository;

    // Đường dẫn API để lấy danh sách
    @GetMapping("/api/haisan")
    public List<HaiSan> layDanhSachHaiSan() {
        return repository.findAll(); 
    }
    @PostMapping("/api/haisan")
    public HaiSan themHaiSan(@RequestBody HaiSan haisanMoi) {
        // Nhận hải sản mới từ web và lưu thẳng vào kho MongoDB
        return repository.save(haisanMoi); 
    }
 // HÀM SỬA (CẬP NHẬT)
    @PutMapping("/api/haisan/{id}")
    public HaiSan capNhatHaiSan(@PathVariable String id, @RequestBody HaiSan thongTinMoi) {
        thongTinMoi.setId(id); // Ép cái ID cũ vào thông tin mới để nó đè lên đúng chỗ
        return repository.save(thongTinMoi); 
    }

    // HÀM XÓA
    @DeleteMapping("/api/haisan/{id}")
    public void xoaHaiSan(@PathVariable String id) {
        repository.deleteById(id);
    }
}