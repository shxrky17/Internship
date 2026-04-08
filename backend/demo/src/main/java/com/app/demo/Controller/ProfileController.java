package com.app.demo.Controller;

import com.app.demo.DTO.ProfileRequestDTO;
import com.app.demo.Entity.Profile;
import com.app.demo.Entity.User;
import com.app.demo.Repository.ProfileRepository;
import com.app.demo.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProfileController {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public ProfileController(UserRepository userRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @PostMapping("/add-profile")
    public ResponseEntity<?> addProfile(@RequestBody ProfileRequestDTO dto) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(401).body("User not logged in");
        }

        String email = auth.getName().trim().toLowerCase();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (user.getProfile() != null) {
            return ResponseEntity.status(409).body("Profile already exists");
        }

        Profile profile = new Profile();
        profile.setPhoneNumber(dto.getPhoneNumber());
        profile.setGender(dto.getGender());
        profile.setState(dto.getState());

        profile.setUser(user);
        user.setProfile(profile);

        profileRepository.save(profile);

        return ResponseEntity.ok("Profile added successfully");
    }
}