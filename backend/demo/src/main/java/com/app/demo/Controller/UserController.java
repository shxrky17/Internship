package com.app.demo.Controller;

import com.app.demo.DTO.*;
import com.app.demo.Entity.Profile;
import com.app.demo.Entity.User;
import com.app.demo.Repository.ProfileRepository;
import com.app.demo.Repository.UserRepository;
import com.app.demo.Service.UserService;
import com.app.demo.Service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private FileStorageService fileStorageService;

    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRegisterDTO userRegisterDTO) {
        String email = userRegisterDTO.getEmail();

        User user = userRepository.findByEmail(email);
        if (user != null) {
            return ResponseEntity.badRequest().build();
        }

        userRegisterDTO.setEmail(email.trim().toLowerCase());
        return ResponseEntity.ok(userService.register(userRegisterDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO, HttpServletRequest request, HttpServletResponse response) {

        String email = loginRequestDTO.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (!user.getPassword().equals(loginRequestDTO.getPassword())) {
            return ResponseEntity.badRequest().body(
                    new LoginResponseDTO("Invalid password", false));
        }
        // Create Authentication object
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, null);

        // Store it in Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Required in Spring Security 6+ for manual authentication persistence
        securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, response);

        LoginResponseDTO loginResponse = new LoginResponseDTO("Login successful", true);

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping(value = "/add-details", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addDetails(
            @RequestPart("profile") Profile profile,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            @RequestPart(value = "marksheet10", required = false) MultipartFile marksheet10,
            @RequestPart(value = "marksheet12ITI", required = false) MultipartFile marksheet12ITI
    ) {

        // get logged-in user email
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("User not athenticated. Please log in.");
        }
        String email = auth.getName().trim().toLowerCase();

        System.out.println("[DEBUG] add-details email: " + email);

        // find user from database
        User user = userRepository.findByEmail(email);

        if (user == null) {
            System.err.println("[ERROR] User not found for email: " + email);
            return ResponseEntity.status(401).body("User not found or session expired. Please log in again.");
        }

        // find existing profile
        Profile p = profileRepository.findByUser(user).orElse(null);

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
        
        // Handle files
        if (resume != null && !resume.isEmpty()) {
            if (p.getCv() != null) fileStorageService.deleteFile(p.getCv());
            p.setCv(fileStorageService.storeFile(resume, email + "_resume"));
        }
        if (marksheet10 != null && !marksheet10.isEmpty()) {
            if (p.getMarksheet10() != null) fileStorageService.deleteFile(p.getMarksheet10());
            p.setMarksheet10(fileStorageService.storeFile(marksheet10, email + "_marksheet10"));
        }
        if (marksheet12ITI != null && !marksheet12ITI.isEmpty()) {
            if (p.getMarksheet12ITI() != null) fileStorageService.deleteFile(p.getMarksheet12ITI());
            p.setMarksheet12ITI(fileStorageService.storeFile(marksheet12ITI, email + "_marksheet12ITI"));
        }

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

    @PostMapping(value = "/upload-document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType
    ) {
        // get logged-in user email
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("User not authenticated.");
        }
        String email = auth.getName().trim().toLowerCase();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found.");
        }

        Profile p = profileRepository.findByUser(user).orElse(null);
        if (p == null) {
            p = new Profile();
            p.setUser(user);
        }

        String filePath = fileStorageService.storeFile(file, email + "_" + documentType);
        if (filePath == null) {
            return ResponseEntity.badRequest().body("Failed to store file or file is empty.");
        }

        switch (documentType) {
            case "resume":
                if (p.getCv() != null) fileStorageService.deleteFile(p.getCv());
                p.setCv(filePath);
                break;
            case "marksheet10":
                if (p.getMarksheet10() != null) fileStorageService.deleteFile(p.getMarksheet10());
                p.setMarksheet10(filePath);
                break;
            case "marksheet12ITI":
                if (p.getMarksheet12ITI() != null) fileStorageService.deleteFile(p.getMarksheet12ITI());
                p.setMarksheet12ITI(filePath);
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid document type.");
        }

        profileRepository.save(p);
        return ResponseEntity.ok(filePath);
    }

    @PostMapping("/get-profile")
    public ResponseEntity<User> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            System.err.println("[ERROR] get-profile: User not authenticated");
            return ResponseEntity.status(401).build();
        }
        String email = auth.getName().trim().toLowerCase();

        System.out.println("[DEBUG] get-profile email: " + email);

        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.err.println("[ERROR] get-profile User not found for email: " + email);
            return ResponseEntity.status(401).build();
        }

        // The user object naturally contains the profile due to @OneToOne relationship.
        // Jackson will serialize the nested profile automatically.
        return ResponseEntity.ok(user);
    }
}
