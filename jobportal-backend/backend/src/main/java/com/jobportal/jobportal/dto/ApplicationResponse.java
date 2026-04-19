package com.jobportal.jobportal.dto;

import lombok.Data;

@Data
public class ApplicationResponse {
    private Long id;
    private String status;
    private Long jobId;
    private String jobTitle;
    private String jobLocation;
    private Double jobSalary;
    private Long userId;
    private String userEmail;
    private Long employerId;
}
