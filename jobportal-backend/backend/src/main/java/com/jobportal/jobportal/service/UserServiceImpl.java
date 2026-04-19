package com.jobportal.jobportal.service;

import com.jobportal.jobportal.config.JwtUtil;
import com.jobportal.jobportal.dao.UserDao;
import com.jobportal.jobportal.dao.UserProfileDao;
import com.jobportal.jobportal.dto.*;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserProfileDao userProfileDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserResponseDto register(RegisterUserRequestDto dto) {
        if (userDao.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getEmail().equalsIgnoreCase("admin12@jobportal.com")) {
    user.setRole("ADMIN");
} else {
    user.setRole(dto.getRole().toUpperCase());
}
        user.setActive(true);
        User saved = userDao.save(user);

        // Create blank profile for the user
        UserProfile profile = new UserProfile();
        profile.setUser(saved);
        profile.setFullName("");
        userProfileDao.save(profile);

        return mapToDto(saved);
    }

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        User user = userDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        UserLoginResponse response = new UserLoginResponse();
        response.setToken(token);
        response.setRole(user.getRole());
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setMessage("Login successful");
        return response;
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return userDao.findByRole(role.toUpperCase());
    }

    @Override
    public UserProfile getProfile(Long userId) {
        return userProfileDao.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));
    }

    @Override
    public UserProfile updateProfile(ProfileUpdateRequest request) {
        User user = userDao.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileDao.findByUser(user)
                .orElse(new UserProfile());

        profile.setUser(user);
        if (request.getFullName() != null) profile.setFullName(request.getFullName());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getContactNumber() != null) profile.setContactNumber(request.getContactNumber());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getState() != null) profile.setState(request.getState());
        if (request.getCountry() != null) profile.setCountry(request.getCountry());
        if (request.getResume() != null) profile.setResume(request.getResume());

        return userProfileDao.save(profile);
    }

    private UserResponseDto mapToDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        return dto;
    }
}
