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
            @RequestPart(value = "resume", required = true) MultipartFile resume,
            @RequestPart(value = "marksheet10", required = true) MultipartFile marksheet10,
            @RequestPart(value = "marksheet12ITI", required = true) MultipartFile marksheet12ITI
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
        int uId=user.getId();
        if (user == null) {
            System.err.println("[ERROR] User not found for email: " + email);
            return ResponseEntity.status(401).body("User not found or session expired. Please log in again.");
        }

        // find existing profile
        Profile p = profileRepository.findByUserId(uId);

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

        // Also map file paths from the JSON payload if they exist and no new file was uploaded
        // This ensures "Instant Uploads" are not lost when the main form is saved
        if ((resume == null || resume.isEmpty()) && profile.getCv() != null && !profile.getCv().isEmpty()) {
            p.setCv(profile.getCv());
        }
        if ((marksheet10 == null || marksheet10.isEmpty()) && profile.getMarksheet10() != null && !profile.getMarksheet10().isEmpty()) {
            p.setMarksheet10(profile.getMarksheet10());
        }
        if ((marksheet12ITI == null || marksheet12ITI.isEmpty()) && profile.getMarksheet12ITI() != null && !profile.getMarksheet12ITI().isEmpty()) {
            p.setMarksheet12ITI(profile.getMarksheet12ITI());
        }

        // save profile
        profileRepository.save(p);
        
        // Ensure bidirectional relationship is set in the current session
        user.setProfile(p);

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
    public ResponseEntity<UserResponseDTO> getProfile() {
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

        // Explicitly load the profile to ensure Jackson serializes it
        Profile profile = user.getProfile();
        if (profile == null) {
            profile = profileRepository.findByUser(user).orElse(null);
            if (profile != null) {
                user.setProfile(profile);
            }
        }
        
        // Map to DTO for reliable serialization
        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        
        if (profile != null) {
            ProfileDTO pDto = new ProfileDTO();
            pDto.setId(profile.getId());
            pDto.setDob(profile.getDob());
            pDto.setPhoneNumber(profile.getPhoneNumber());
            pDto.setGender(profile.getGender());
            pDto.setDistrict(profile.getDistrict());
            pDto.setState(profile.getState());
            pDto.setCv(profile.getCv());
            pDto.setHighestQualification(profile.getHighestQualification());
            pDto.setFieldOfStudy(profile.getFieldOfStudy());
            pDto.setClgName(profile.getClgName());
            pDto.setGradYear(profile.getGradYear());
            pDto.setSkills(profile.getSkills());
            pDto.setLanguages(profile.getLanguages());
            pDto.setBio(profile.getBio());
            pDto.setMarksheet10(profile.getMarksheet10());
            pDto.setMarksheet12ITI(profile.getMarksheet12ITI());
            response.setProfile(pDto);
        }
        
        return ResponseEntity.ok(response);
    }
}
