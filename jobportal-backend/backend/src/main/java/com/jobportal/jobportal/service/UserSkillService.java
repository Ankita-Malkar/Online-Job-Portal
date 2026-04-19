package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dao.UserDao;
import com.jobportal.jobportal.dao.UserSkillDao;
import com.jobportal.jobportal.dto.SkillRequest;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserSkill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserSkillService {

    @Autowired
    private UserSkillDao skillDao;

    @Autowired
    private UserDao userDao;

    public UserSkill addSkill(SkillRequest request) {
        User user = userDao.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserSkill skill = new UserSkill();
        skill.setUser(user);
        skill.setSkillName(request.getSkillName());
        return skillDao.save(skill);
    }

    public List<UserSkill> getSkillsByUser(Long userId) {
        return skillDao.findByUserUserId(userId);
    }

    public void deleteSkill(Long skillId) {
        if (!skillDao.existsById(skillId)) throw new RuntimeException("Skill not found");
        skillDao.deleteById(skillId);
    }
}
