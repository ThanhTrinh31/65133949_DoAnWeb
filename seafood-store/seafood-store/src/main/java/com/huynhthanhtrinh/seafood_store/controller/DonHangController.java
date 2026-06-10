package com.huynhthanhtrinh.seafood_store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.huynhthanhtrinh.seafood_store.model.DonHang;
import com.huynhthanhtrinh.seafood_store.repository.DonHangRepository;

@RestController
@RequestMapping("/api/donhang")
@CrossOrigin(origins = "http://localhost:3000")
public class DonHangController {

    @Autowired
    private DonHangRepository donHangRepository;

    @PostMapping
    public ResponseEntity<DonHang> taoDonHang(@RequestBody DonHang donHangMoi) {
        try {
            DonHang dh = donHangRepository.save(donHangMoi);
            return ResponseEntity.status(HttpStatus.CREATED).body(dh);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}