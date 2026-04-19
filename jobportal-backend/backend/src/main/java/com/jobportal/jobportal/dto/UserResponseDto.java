package com.jobportal.jobportal.dto;

import lombok.Data;

@Data
public class UserResponseDto {
    private Long userId;
    private String email;
    private String role;
    private boolean active;
}
