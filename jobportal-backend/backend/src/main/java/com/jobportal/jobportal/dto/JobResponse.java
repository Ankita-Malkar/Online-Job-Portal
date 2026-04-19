package com.jobportal.jobportal.dto;

import lombok.Data;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Double salary;
    private Long categoryId;
    private String categoryName;
    private Long employerId;
    private String employerEmail;
}
