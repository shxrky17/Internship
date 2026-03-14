package com.app.demo.Controller;

import com.app.demo.DTO.*;
import com.app.demo.Entity.Profile;
import com.app.demo.Entity.User;
import com.app.demo.Repository.ProfileRepository;
import com.app.demo.Repository.UserRepository;
import com.app.demo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class UserController{

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRegisterDTO userRegisterDTO){
        String email = userRegisterDTO.getEmail();

        User user = userRepository.findByEmail(email);
        if(user!=null){
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(userService.register(userRegisterDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {

        String email = loginRequestDTO.getEmail();

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (!user.getPassword().equals(loginRequestDTO.getPassword())) {
            return ResponseEntity.badRequest().body(
                    new LoginResponseDTO("Invalid password", false)
            );
        }
        // Create Authentication object
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(email, null, null);

        // Store it in Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        LoginResponseDTO response = new LoginResponseDTO("Login successful", true);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-details")
    public ResponseEntity<String> addDetails(@RequestBody Profile profile) {

        // get logged-in user email
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // find user from database
        User user = userRepository.findByEmail(email);

        // find existing profile
        Profile p = profileRepository.findByUser(user);

        if (p == null) {
            // create new profile if none exists
            p = new Profile();
            p.setUser(user);
        }

        // map fields
        p.setDob(profile.getDob());
        p.setPhoneNumber(profile.getPhoneNumber());
        p.setGender(profile.getGender());
        p.setDistrict(profile.getDistrict());
        p.setState(profile.getState());
        p.setCv(profile.getCv());
        p.setHighestQualification(profile.getHighestQualification());
        p.setFieldOfStudy(profile.getFieldOfStudy());
        p.setClgName(profile.getClgName());
        p.setGradYear(profile.getGradYear());
        p.setSkills(profile.getSkills());
        p.setLanguages(profile.getLanguages());
        p.setBio(profile.getBio());

        // save profile
        profileRepository.save(p);

        return ResponseEntity.ok("Profile details saved successfully");
    }

    @PostMapping("/get-profile")
    public ResponseEntity<ProfileResponseDTO> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Profile profile = profileRepository.findByUser(user);
        // We return the email even if profile is null, to help session recovery
        return ResponseEntity.ok(new ProfileResponseDTO(email, profile));
    }
}
