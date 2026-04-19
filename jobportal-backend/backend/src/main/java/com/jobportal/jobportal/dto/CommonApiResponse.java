package com.jobportal.jobportal.dto;

import lombok.Data;

@Data
public class CommonApiResponse {
    private boolean success;
    private String message;

    public CommonApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
