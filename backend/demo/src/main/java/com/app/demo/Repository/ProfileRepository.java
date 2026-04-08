package com.app.demo.Repository;

import com.app.demo.Entity.Profile;
import com.app.demo.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Integer> {
    Profile getProfileByUserId (Integer id);
}