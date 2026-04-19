package com.jobportal.jobportal.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private Long userId;
    private String fullName;
    private String bio;
    private String contactNumber;
    private String city;
    private String state;
    private String country;
    private String resume;
}
