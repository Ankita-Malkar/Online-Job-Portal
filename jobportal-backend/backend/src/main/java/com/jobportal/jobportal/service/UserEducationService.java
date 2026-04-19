package com.jobportal.jobportal.service;

import com.jobportal.jobportal.dao.UserDao;
import com.jobportal.jobportal.dao.UserEducationDao;
import com.jobportal.jobportal.dto.EducationRequest;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.entity.UserEducation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserEducationService {

    @Autowired
    private UserEducationDao educationDao;

    @Autowired
    private UserDao userDao;

    public UserEducation addEducation(EducationRequest request) {
        User user = userDao.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserEducation ed = new UserEducation();
        ed.setUser(user);
        ed.setDegree(request.getDegree());
        ed.setInstitution(request.getInstitution());
        ed.setYear(request.getYear());
        return educationDao.save(ed);
    }

    public List<UserEducation> getEducationByUser(Long userId) {
        return educationDao.findByUserUserId(userId);
    }

    public void deleteEducation(Long id) {
        if (!educationDao.existsById(id)) throw new RuntimeException("Education record not found");
        educationDao.deleteById(id);
    }
}
