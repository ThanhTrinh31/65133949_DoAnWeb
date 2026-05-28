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
        return repository.findAll(); 
    }
}