package com.huynhthanhtrinh.seafood_store.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.huynhthanhtrinh.seafood_store.model.DonHang;

@Repository
public interface DonHangRepository extends MongoRepository<DonHang, String> {
}