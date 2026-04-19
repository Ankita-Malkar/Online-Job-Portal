package com.jobportal.jobportal.dto;

import lombok.Data;

@Data
public class ExperienceRequest {
    private Long userId;
    private String company;
    private String position;
    private String duration;
}
