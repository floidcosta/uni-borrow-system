package com.uniborrow.dto;
public class UpdateRequestStatusRequest {
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