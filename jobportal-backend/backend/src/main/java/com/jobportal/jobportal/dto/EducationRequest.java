package com.jobportal.jobportal.dto;

import lombok.Data;

@Data
public class EducationRequest {
    private Long userId;
    private String degree;
    private String institution;
    private String year;
}
