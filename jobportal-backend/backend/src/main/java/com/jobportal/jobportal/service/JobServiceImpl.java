package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dao.JobCategoryDao;
import com.jobportal.jobportal.dao.JobDao;
import com.jobportal.jobportal.dao.UserDao;
import com.jobportal.jobportal.dto.JobRequest;
import com.jobportal.jobportal.dto.JobResponse;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.entity.JobCategory;
import com.jobportal.jobportal.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobDao jobDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private JobCategoryDao categoryDao;

    @Override
    public JobResponse addJob(JobRequest request) {
        User employer = userDao.findById(request.getEmployerId())
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        if (!employer.getRole().equals("EMPLOYER")) {
            throw new RuntimeException("User is not an employer");
        }

        JobCategory category = categoryDao.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setEmployer(employer);
        job.setCategory(category);

        return mapToResponse(jobDao.save(job));
    }

    @Override
    public List<JobResponse> getAllJobs() {
        return jobDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobResponse> getJobsByEmployer(Long employerId) {
        User employer = userDao.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        return jobDao.findByEmployer(employer).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteJob(Long jobId) {
        if (!jobDao.existsById(jobId)) {
            throw new RuntimeException("Job not found");
        }
        jobDao.deleteById(jobId);
    }

    @Override
    public JobResponse getJobById(Long jobId) {
        Job job = jobDao.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return mapToResponse(job);
    }

    private JobResponse mapToResponse(Job job) {
        JobResponse r = new JobResponse();
        r.setId(job.getId());
        r.setTitle(job.getTitle());
        r.setDescription(job.getDescription());
        r.setLocation(job.getLocation());
        r.setSalary(job.getSalary());
        if (job.getCategory() != null) {
            r.setCategoryId(job.getCategory().getId());
            r.setCategoryName(job.getCategory().getName());
        }
        if (job.getEmployer() != null) {
            r.setEmployerId(job.getEmployer().getUserId());
            r.setEmployerEmail(job.getEmployer().getEmail());
        }
        return r;
    }
}
