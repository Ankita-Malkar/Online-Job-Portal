package com.jobportal.jobportal.dao;

import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.entity.JobApplication;
import com.jobportal.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationDao extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUser(User user);
    List<JobApplication> findByJob(Job job);
    Optional<JobApplication> findByUserAndJob(User user, Job job);
    boolean existsByUserAndJob(User user, Job job);
}
