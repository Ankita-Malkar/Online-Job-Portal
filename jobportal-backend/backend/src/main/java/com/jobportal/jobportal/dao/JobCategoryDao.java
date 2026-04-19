package com.jobportal.jobportal.dao;

import com.jobportal.jobportal.entity.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobCategoryDao extends JpaRepository<JobCategory, Long> {
    boolean existsByName(String name);
}
