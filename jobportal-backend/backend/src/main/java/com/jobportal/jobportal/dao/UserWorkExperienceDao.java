package com.jobportal.jobportal.dao;

import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserWorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserWorkExperienceDao extends JpaRepository<UserWorkExperience, Long> {
    List<UserWorkExperience> findByUser(User user);
    List<UserWorkExperience> findByUserUserId(Long userId);
}
