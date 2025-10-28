package com.invoice.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "borrow_request")
public class BorrowRequest {
    @Id
    private String id;

    private String equipmentId;
    private String userId;
    private String userName;
    private BorrowStatus status = BorrowStatus.PENDING;
    private Instant requestDate = Instant.now();
    private Instant approvedDate;
    private Instant returnDate;
    private String approvedBy;
    private int quantity;
    private String notes;

    public BorrowRequest() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(String equipmentId) {
        this.equipmentId = equipmentId;
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

    public BorrowStatus getStatus() {
        return status;
    }

    public void setStatus(BorrowStatus status) {
        this.status = status;
    }

    public Instant getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Instant requestDate) {
        this.requestDate = requestDate;
    }

    public Instant getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(Instant approvedDate) {
        this.approvedDate = approvedDate;
    }

    public Instant getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(Instant returnDate) {
        this.returnDate = returnDate;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
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

    @Override
    public String toString() {
        return "BorrowRequest [id=" + id + ", equipmentId=" + equipmentId + ", userId=" + userId + ", userName="
                + userName + ", status=" + status + ", requestDate=" + requestDate + ", approvedDate="
                + approvedDate + ", returnDate=" + returnDate + ", approvedBy=" + approvedBy + ", quantity="
                + quantity + ", notes=" + notes + "]";
    }
}
