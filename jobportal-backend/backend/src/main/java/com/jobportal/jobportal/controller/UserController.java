package com.jobportal.jobportal.controller;

import com.jobportal.jobportal.dto.*;
import com.jobportal.jobportal.entity.*;
import com.jobportal.jobportal.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired private UserService userService;
    @Autowired private UserSkillService skillService;
    @Autowired private UserEducationService educationService;
    @Autowired private UserExperienceService experienceService;

    // ── Register ──────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody RegisterUserRequestDto dto) {
        return ResponseEntity.ok(userService.register(dto));
    }

    // ── Login ─────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // ── Profile ───────────────────────────────────────────────
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile/update")
    public ResponseEntity<UserProfile> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    // ── Users (Admin) ─────────────────────────────────────────
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
@PostMapping("/create-admin")
public String createAdmin() {
    User u = new User();
    u.setEmail("admin@jobportal.com");
    u.setPassword(passwordEncoder.encode("admin123"));
    u.setRole("ADMIN");
    userRepository.save(u);
    return "Admin created";
}
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    // ── Skills ────────────────────────────────────────────────
    @PostMapping("/skill/add")
    public ResponseEntity<UserSkill> addSkill(@RequestBody SkillRequest request) {
        return ResponseEntity.ok(skillService.addSkill(request));
    }

    @GetMapping("/skill/{userId}")
    public ResponseEntity<List<UserSkill>> getSkills(@PathVariable Long userId) {
        return ResponseEntity.ok(skillService.getSkillsByUser(userId));
    }

    @DeleteMapping("/skill/{skillId}")
    public ResponseEntity<CommonApiResponse> deleteSkill(@PathVariable Long skillId) {
        skillService.deleteSkill(skillId);
        return ResponseEntity.ok(new CommonApiResponse(true, "Skill deleted"));
    }

    // ── Education ─────────────────────────────────────────────
    @PostMapping("/education/add")
    public ResponseEntity<UserEducation> addEducation(@RequestBody EducationRequest request) {
        return ResponseEntity.ok(educationService.addEducation(request));
    }

    @GetMapping("/education/{userId}")
    public ResponseEntity<List<UserEducation>> getEducation(@PathVariable Long userId) {
        return ResponseEntity.ok(educationService.getEducationByUser(userId));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<CommonApiResponse> deleteEducation(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.ok(new CommonApiResponse(true, "Education deleted"));
    }

    // ── Experience ────────────────────────────────────────────
    @PostMapping("/experience/add")
    public ResponseEntity<UserWorkExperience> addExperience(@RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(experienceService.addExperience(request));
    }

    @GetMapping("/experience/{userId}")
    public ResponseEntity<List<UserWorkExperience>> getExperience(@PathVariable Long userId) {
        return ResponseEntity.ok(experienceService.getExperienceByUser(userId));
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<CommonApiResponse> deleteExperience(@PathVariable Long id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.ok(new CommonApiResponse(true, "Experience deleted"));
    }
}
