package com.huynhthanhtrinh.seafood_store;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface HaiSanRepository extends MongoRepository<HaiSan, String> {
    // Để trống hoàn toàn! Spring Boot sẽ tự lo phần kết nối.
}