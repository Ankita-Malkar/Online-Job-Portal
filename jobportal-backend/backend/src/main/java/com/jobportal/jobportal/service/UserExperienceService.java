package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dao.UserDao;
import com.jobportal.jobportal.dao.UserWorkExperienceDao;
import com.jobportal.jobportal.dto.ExperienceRequest;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserWorkExperience;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserExperienceService {

    @Autowired
    private UserWorkExperienceDao expDao;

    @Autowired
    private UserDao userDao;

    public UserWorkExperience addExperience(ExperienceRequest request) {
        User user = userDao.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserWorkExperience exp = new UserWorkExperience();
        exp.setUser(user);
        exp.setCompany(request.getCompany());
        exp.setPosition(request.getPosition());
        exp.setDuration(request.getDuration());
        return expDao.save(exp);
    }

    public List<UserWorkExperience> getExperienceByUser(Long userId) {
        return expDao.findByUserUserId(userId);
    }

    public void deleteExperience(Long id) {
        if (!expDao.existsById(id)) throw new RuntimeException("Experience record not found");
        expDao.deleteById(id);
    }
}
