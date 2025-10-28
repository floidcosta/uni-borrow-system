package com.invoice.controller;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.model.BorrowRequest;
import com.invoice.model.BorrowStatus;
import com.invoice.repository.BorrowRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/requests")
public class BorrowController {

    private final BorrowRepository repo;

    @Autowired
    public BorrowController(BorrowRepository repo) {
        this.repo = repo;
    }

    // List borrow requests with optional filters
    @GetMapping
    public List<BorrowRequest> listRequests(@RequestParam(required = false) String status,
            @RequestParam(required = false) String userId, @RequestParam(required = false) String equipmentId) {

        List<BorrowRequest> all = repo.findAll();

        return all.stream().filter(r -> {
            boolean ok = true;
            if (status != null) {
                try {
                    BorrowStatus s = BorrowStatus.fromString(status);
                    ok = ok && s == r.getStatus();
                } catch (IllegalArgumentException e) {
                    return false;
                }
            }
            if (userId != null) {
                ok = ok && userId.equals(r.getUserId());
            }
            if (equipmentId != null) {
                ok = ok && equipmentId.equals(r.getEquipmentId());
            }
            return ok;
        }).collect(Collectors.toList());
    }

    // Create a new borrow request
    @PostMapping
    public ResponseEntity<BorrowRequest> createRequest(@Valid @RequestBody CreateBorrowRequest body) {
        BorrowRequest r = new BorrowRequest();
        r.setEquipmentId(body.getEquipmentId());
        r.setQuantity(body.getQuantity());
        r.setNotes(body.getNotes());
        r.setRequestDate(Instant.now());
        r.setStatus(BorrowStatus.PENDING);
        // TODO: Integrate with auth to set real userId/userName. For now allow optional override.
        if (body.getUserId() != null) {
            r.setUserId(body.getUserId());
        } else {
            r.setUserId("unknown");
        }
        if (body.getUserName() != null) {
            r.setUserName(body.getUserName());
        } else {
            r.setUserName("unknown");
        }

        BorrowRequest saved = repo.save(r);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Get request by id
    @GetMapping("/{id}")
    public ResponseEntity<BorrowRequest> getById(@PathVariable String id) {
        Optional<BorrowRequest> o = repo.findById(id);
        return o.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update request status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @Valid @RequestBody UpdateRequestStatusRequest body) {
        Optional<BorrowRequest> o = repo.findById(id);
        if (!o.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        BorrowRequest r = o.get();
        BorrowStatus newStatus;
        try {
            newStatus = BorrowStatus.fromString(body.getStatus());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + body.getStatus());
        }

        r.setStatus(newStatus);
        if (newStatus == BorrowStatus.APPROVED) {
            r.setApprovedDate(Instant.now());
            // TODO: set approvedBy from authenticated user
            r.setApprovedBy(body.getApprovedBy() != null ? body.getApprovedBy() : "system");
        } else if (newStatus == BorrowStatus.RETURNED) {
            r.setReturnDate(Instant.now());
        }

        BorrowRequest saved = repo.save(r);
        return ResponseEntity.ok(saved);
    }

    // --- DTOs ---
    public static class CreateBorrowRequest {
        private String equipmentId;
        private int quantity;
        private String notes;
        // optional overrides (until auth is wired)
        private String userId;
        private String userName;

        public String getEquipmentId() {
            return equipmentId;
        }

        public void setEquipmentId(String equipmentId) {
            this.equipmentId = equipmentId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }
    }

    public static class UpdateRequestStatusRequest {
        private String status;
        // optional: who approved it (temporary)
        private String approvedBy;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getApprovedBy() {
            return approvedBy;
        }

        public void setApprovedBy(String approvedBy) {
            this.approvedBy = approvedBy;
        }
    }

}
