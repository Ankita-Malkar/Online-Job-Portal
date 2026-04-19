package com.jobportal.jobportal.dao;

import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEducationDao extends JpaRepository<UserEducation, Long> {
    List<UserEducation> findByUser(User user);
    List<UserEducation> findByUserUserId(Long userId);
}
