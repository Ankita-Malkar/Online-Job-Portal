package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dto.*;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserProfile;

import java.util.List;

public interface UserService {
    UserResponseDto register(RegisterUserRequestDto dto);
    UserLoginResponse login(UserLoginRequest request);
    List<User> getAllUsers();
    List<User> getUsersByRole(String role);
    UserProfile getProfile(Long userId);
    UserProfile updateProfile(ProfileUpdateRequest request);
}
