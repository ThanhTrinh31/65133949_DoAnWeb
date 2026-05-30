package com.huynhthanhtrinh.seafood_store;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HaiSanRepository extends MongoRepository<HaiSan, String> {
    // Dòng này giúp Spring Boot tự động viết câu lệnh tìm kiếm hải sản theo tên
    Page<HaiSan> findByTenContainingIgnoreCase(String ten, Pageable pageable);
}