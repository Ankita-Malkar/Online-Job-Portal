package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dao.JobApplicationDao;
import com.jobportal.jobportal.dao.JobDao;
import com.jobportal.jobportal.dao.UserDao;
import com.jobportal.jobportal.dto.ApplyRequest;
import com.jobportal.jobportal.dto.ApplicationResponse;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.entity.JobApplication;
import com.jobportal.jobportal.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationDao applicationDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private JobDao jobDao;

    @Override
    public ApplicationResponse applyJob(ApplyRequest request) {
        User user = userDao.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobDao.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationDao.existsByUserAndJob(user, job)) {
            throw new RuntimeException("Already applied for this job");
        }

        JobApplication app = new JobApplication();
        app.setUser(user);
        app.setJob(job);
        app.setStatus("APPLIED");

        return mapToResponse(applicationDao.save(app));
    }

    @Override
    public List<ApplicationResponse> getApplicationsByUser(Long userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationDao.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationResponse> getApplicationsByJob(Long jobId) {
        Job job = jobDao.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationDao.findByJob(job).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationResponse> getAllApplications() {
        return applicationDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelApplication(Long applicationId) {
        JobApplication app = applicationDao.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus("CANCELLED");
        applicationDao.save(app);
    }

    @Override
    public void updateStatus(Long applicationId, String status) {
        JobApplication app = applicationDao.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status.toUpperCase());
        applicationDao.save(app);
    }

    private ApplicationResponse mapToResponse(JobApplication app) {
        ApplicationResponse r = new ApplicationResponse();
        r.setId(app.getId());
        r.setStatus(app.getStatus());
        if (app.getJob() != null) {
            r.setJobId(app.getJob().getId());
            r.setJobTitle(app.getJob().getTitle());
            r.setJobLocation(app.getJob().getLocation());
            r.setJobSalary(app.getJob().getSalary());
            if (app.getJob().getEmployer() != null) {
                r.setEmployerId(app.getJob().getEmployer().getUserId());
            }
        }
        if (app.getUser() != null) {
            r.setUserId(app.getUser().getUserId());
            r.setUserEmail(app.getUser().getEmail());
        }
        return r;
    }
}
