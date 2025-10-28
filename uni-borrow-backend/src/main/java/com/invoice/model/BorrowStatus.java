package com.invoice.model;

public enum BorrowStatus {
    PENDING,
    APPROVED,
    REJECTED,
    RETURNED;

    public static BorrowStatus fromString(String s) {
        if (s == null) return null;
        switch (s.toLowerCase()) {
            case "pending":
                return PENDING;
            case "approved":
                return APPROVED;
            case "rejected":
                return REJECTED;
            case "returned":
                return RETURNED;
            default:
                throw new IllegalArgumentException("Unknown status: " + s);
        }
    }
}
