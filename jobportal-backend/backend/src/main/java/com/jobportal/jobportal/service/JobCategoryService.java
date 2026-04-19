package com.jobportal.jobportal.service;

import com.jobportal.jobportal.entity.JobCategory;

import java.util.List;

public interface JobCategoryService {
    JobCategory addCategory(String name);
    List<JobCategory> getAllCategories();
    void deleteCategory(Long id);
}
