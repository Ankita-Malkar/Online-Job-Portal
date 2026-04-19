package com.jobportal.jobportal.dao;

import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileDao extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUser(User user);
    Optional<UserProfile> findByUserUserId(Long userId);
}
