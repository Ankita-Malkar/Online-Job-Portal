package com.jobportal.jobportal.controller;

import com.jobportal.jobportal.dto.ApplyRequest;
import com.jobportal.jobportal.dto.ApplicationResponse;
import com.jobportal.jobportal.dto.CommonApiResponse;
import com.jobportal.jobportal.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/application")
@CrossOrigin(origins = "*")
public class JobApplicationController {

    @Autowired
    private JobApplicationService service;

    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponse> apply(@Valid @RequestBody ApplyRequest request) {
        return ResponseEntity.ok(service.applyJob(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationResponse>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getApplicationsByUser(userId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(service.getApplicationsByJob(jobId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ApplicationResponse>> getAll() {
        return ResponseEntity.ok(service.getAllApplications());
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<CommonApiResponse> cancel(@PathVariable Long id) {
        service.cancelApplication(id);
        return ResponseEntity.ok(new CommonApiResponse(true, "Application cancelled"));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<CommonApiResponse> updateStatus(
            @PathVariable Long id, @RequestParam String status) {
        service.updateStatus(id, status);
        return ResponseEntity.ok(new CommonApiResponse(true, "Status updated"));
    }
}
