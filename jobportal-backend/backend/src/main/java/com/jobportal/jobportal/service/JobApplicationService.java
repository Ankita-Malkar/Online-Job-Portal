package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dto.ApplyRequest;
import com.jobportal.jobportal.dto.ApplicationResponse;

import java.util.List;

public interface JobApplicationService {
    ApplicationResponse applyJob(ApplyRequest request);
    List<ApplicationResponse> getApplicationsByUser(Long userId);
    List<ApplicationResponse> getApplicationsByJob(Long jobId);
    List<ApplicationResponse> getAllApplications();
    void cancelApplication(Long applicationId);
    void updateStatus(Long applicationId, String status);
}
