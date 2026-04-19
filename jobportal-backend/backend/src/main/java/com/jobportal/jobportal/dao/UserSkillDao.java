package com.jobportal.jobportal.dao;

import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillDao extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    List<UserSkill> findByUserUserId(Long userId);
}
