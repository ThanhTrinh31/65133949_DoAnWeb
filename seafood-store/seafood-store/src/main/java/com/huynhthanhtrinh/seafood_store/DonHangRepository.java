package com.huynhthanhtrinh.seafood_store;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonHangRepository extends MongoRepository<DonHang, String> {
}