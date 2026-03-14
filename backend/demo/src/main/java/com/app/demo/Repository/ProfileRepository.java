package com.app.demo.Repository;

import com.app.demo.Entity.Profile;
import com.app.demo.Entity.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Integer> {
    Profile findByUser(User user);
}
