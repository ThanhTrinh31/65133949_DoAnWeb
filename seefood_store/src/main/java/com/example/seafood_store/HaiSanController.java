package com.example.seafood_store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class HaiSanController {

    @Autowired
    private HaiSanRepository repository;

    // Đây chính là hàm 3 dòng để lấy dữ liệu!
    @GetMapping("/api/haisan")
    public List<HaiSan> layDanhSachHaiSan() {
        return repository.findAll(); 
    }
}
