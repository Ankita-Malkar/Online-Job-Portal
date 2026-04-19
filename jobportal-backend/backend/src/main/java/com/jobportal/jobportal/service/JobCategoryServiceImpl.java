package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dao.JobCategoryDao;
import com.jobportal.jobportal.entity.JobCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobCategoryServiceImpl implements JobCategoryService {

    @Autowired
    private JobCategoryDao categoryDao;

    @Override
    public JobCategory addCategory(String name) {
        if (categoryDao.existsByName(name)) {
            throw new RuntimeException("Category '" + name + "' already exists");
        }
        JobCategory cat = new JobCategory();
        cat.setName(name);
        return categoryDao.save(cat);
    }

    @Override
    public List<JobCategory> getAllCategories() {
        return categoryDao.findAll();
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryDao.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryDao.deleteById(id);
    }
}
