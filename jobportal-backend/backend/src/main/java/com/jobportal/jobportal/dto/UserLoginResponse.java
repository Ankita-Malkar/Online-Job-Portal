package com.jobportal.jobportal.dto;

import lombok.Data;

@Data
public class UserLoginResponse {
    private String token;
    private String role;
    private Long userId;
    private String email;
    private String message;
}
