package com.invoice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.invoice.model.BorrowRequest;
import com.invoice.model.BorrowStatus;

public interface BorrowRepository extends MongoRepository<BorrowRequest, String> {
    List<BorrowRequest> findByUserId(String userId);
    List<BorrowRequest> findByStatus(BorrowStatus status);
    List<BorrowRequest> findByEquipmentId(String equipmentId);
}
