package com.example.seafood_store;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface HaiSanRepository extends MongoRepository<HaiSan, String> {
    // Để trống thế này thôi! Spring Boot sẽ tự viết code gầm cho bạn.
}

