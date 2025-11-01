package com.uniborrow.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.uniborrow.model.BorrowRequest;
import com.uniborrow.model.BorrowStatus;

public interface BorrowRepository extends MongoRepository<BorrowRequest, String> {
    List<BorrowRequest> findByUserId(String userId);
    List<BorrowRequest> findByStatus(BorrowStatus status);
    List<BorrowRequest> findByEquipmentId(String equipmentId);
}
