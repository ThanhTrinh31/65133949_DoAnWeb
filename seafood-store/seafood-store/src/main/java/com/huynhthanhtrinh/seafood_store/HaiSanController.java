package com.huynhthanhtrinh.seafood_store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/haisan")
@CrossOrigin(origins = "http://localhost:3000")
public class HaiSanController {

    @Autowired
    private HaiSanRepository repository;

    // 1. LẤY DANH SÁCH + TÌM KIẾM + PHÂN TRANG
    @GetMapping
    public ResponseEntity<Map<String, Object>> layDanhSachHaiSan(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        
        try {
            Pageable paging = PageRequest.of(page, size);
            Page<HaiSan> pageHaisan;

            if (keyword == null || keyword.isEmpty()) {
                pageHaisan = repository.findAll(paging);
            } else {
                pageHaisan = repository.findByTenContainingIgnoreCase(keyword, paging);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("haisans", pageHaisan.getContent());
            response.put("currentPage", pageHaisan.getNumber());
            response.put("totalItems", pageHaisan.getTotalElements());
            response.put("totalPages", pageHaisan.getTotalPages());

            // Dùng ResponseEntity.ok() thay thế
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Sửa lỗi infer type bằng cách build response lỗi rõ ràng
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 2. HÀM THÊM MỚI
    @PostMapping
    public ResponseEntity<HaiSan> themHaiSan(@RequestBody HaiSan haisanMoi) {
        try {
        	// THÊM DÒNG NÀY: Ép ID về null để MongoDB tự động tạo ID ngẫu nhiên mới
        	haisanMoi.setId(null);
        	
            HaiSan hs = repository.save(haisanMoi);
            // Sửa đổi trả về kiểu tường minh thông qua body
            return ResponseEntity.status(HttpStatus.CREATED).body(hs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

 // 3. HÀM SỬA (CẬP NHẬT)
    @PutMapping("/api/haisan/{id}")
    public HaiSan capNhatHaiSan(@PathVariable String id, @RequestBody HaiSan thongTinMoi) {
        thongTinMoi.setId(id); // Ép cái ID cũ vào thông tin mới để nó đè lên đúng chỗ
        return repository.save(thongTinMoi); 
    }

    // 4. HÀM XÓA
    @DeleteMapping("/api/haisan/{id}")
    public void xoaHaiSan(@PathVariable String id) {
        repository.deleteById(id);
    }
}