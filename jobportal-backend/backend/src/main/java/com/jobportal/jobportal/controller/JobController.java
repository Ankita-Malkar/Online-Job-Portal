package com.jobportal.jobportal.controller;

import com.jobportal.jobportal.dto.CommonApiResponse;
import com.jobportal.jobportal.dto.JobRequest;
import com.jobportal.jobportal.dto.JobResponse;
import com.jobportal.jobportal.entity.JobCategory;
import com.jobportal.jobportal.service.JobCategoryService;
import com.jobportal.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired private JobService jobService;
    @Autowired private JobCategoryService categoryService;

    // ── Categories ────────────────────────────────────────────
    @PostMapping("/category/add")
    public ResponseEntity<JobCategory> addCategory(@RequestParam String name) {
        return ResponseEntity.ok(categoryService.addCategory(name));
    }

    @GetMapping("/category")
    public ResponseEntity<List<JobCategory>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @DeleteMapping("/category/delete/{id}")
    public ResponseEntity<CommonApiResponse> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new CommonApiResponse(true, "Category deleted"));
    }

    // ── Jobs ──────────────────────────────────────────────────
    @PostMapping("/add")
    public ResponseEntity<JobResponse> addJob(@Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.addJob(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getJobById(jobId));
    }

    @GetMapping("/employer/{userId}")
    public ResponseEntity<List<JobResponse>> getJobsByEmployer(@PathVariable Long userId) {
        return ResponseEntity.ok(jobService.getJobsByEmployer(userId));
    }

    @DeleteMapping("/delete/{jobId}")
    public ResponseEntity<CommonApiResponse> deleteJob(@PathVariable Long jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.ok(new CommonApiResponse(true, "Job deleted"));
    }
}
