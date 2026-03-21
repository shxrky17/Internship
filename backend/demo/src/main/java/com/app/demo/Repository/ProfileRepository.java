package com.app.demo.Repository;

import com.app.demo.Entity.Profile;
import com.app.demo.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Integer> {
    Optional<Profile> findByUser(User user);

    Profile findByUserId(int uId);
}
