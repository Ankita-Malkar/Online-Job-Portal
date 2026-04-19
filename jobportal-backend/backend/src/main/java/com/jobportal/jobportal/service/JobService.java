package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dto.JobRequest;
import com.jobportal.jobportal.dto.JobResponse;

import java.util.List;

public interface JobService {
    JobResponse addJob(JobRequest request);
    List<JobResponse> getAllJobs();
    List<JobResponse> getJobsByEmployer(Long employerId);
    void deleteJob(Long jobId);
    JobResponse getJobById(Long jobId);
}
