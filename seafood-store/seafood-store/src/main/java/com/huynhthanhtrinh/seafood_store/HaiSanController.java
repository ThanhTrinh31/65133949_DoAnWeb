package com.huynhthanhtrinh.seafood_store;
import com.huynhthanhtrinh.seafood_store.HaiSan;
import com.huynhthanhtrinh.seafood_store.HaiSanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/haisan")
@CrossOrigin(origins = "http://localhost:3000") // Cấp quyền VIP cho React truy cập
public class HaiSanController {

    @Autowired
    private HaiSanRepository repository;

    // API LẤY DANH SÁCH (Hỗ trợ cấu trúc phân trang bọc ngoài giống hình ông gửi)
    @GetMapping
    public Map<String, Object> layDanhSach() {
        List<HaiSan> danhSach = repository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("haisans", danhSach);
        response.put("totalItems", danhSach.size());
        response.put("totalPages", 1);
        response.put("currentPage", 0);
        return response;
    }

    // API THÊM MỚI (POST) - Giải quyết dứt điểm lỗi mất tích dữ liệu
    @PostMapping
    public HaiSan themHaiSan(@RequestBody HaiSan haisanMoi) {
        if (haisanMoi.getId() != null && haisanMoi.getId().trim().isEmpty()) {
            haisanMoi.setId(null); // Xóa id rỗng để MongoDB tự sinh ObjectId
        }
        return repository.save(haisanMoi);
    }

    // API SỬA (PUT)
    @PutMapping("/{id}")
    public HaiSan capNhatHaiSan(@PathVariable String id, @RequestBody HaiSan thongTinMoi) {
        thongTinMoi.setId(id);
        return repository.save(thongTinMoi);
    }

    // API XÓA (DELETE)
    @DeleteMapping("/{id}")
    public void xoaHaiSan(@PathVariable String id) {
        repository.deleteById(id);
    }
}