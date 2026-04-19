package com.jobportal.jobportal.dao;

import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobDao extends JpaRepository<Job, Long> {
    List<Job> findByEmployer(User employer);
}
