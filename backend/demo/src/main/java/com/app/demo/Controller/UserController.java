package com.app.demo.Controller;

import com.app.demo.DTO.LoginRequestDTO;
import com.app.demo.DTO.LoginResponseDTO;
import com.app.demo.DTO.UserRegisterDTO;
import com.app.demo.DTO.UserResponseDTO;
import com.app.demo.Entity.Profile;
import com.app.demo.Entity.User;
import com.app.demo.Repository.ProfileRepository;
import com.app.demo.Repository.UserRepository;
import com.app.demo.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class UserController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

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
@PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletRequest request,
                                HttpServletResponse response) {

    // clear authentication
    SecurityContextHolder.clearContext();

    // invalidate session
    if (request.getSession(false) != null) {
        request.getSession(false).invalidate();
    }

    return ResponseEntity.ok("Logged out successfully");
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

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, response);
        LoginResponseDTO loginResponse = new LoginResponseDTO("Login successful", true);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName().trim().toLowerCase();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-profile")
    public ResponseEntity<?> getProfile() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName().trim().toLowerCase();

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        Optional<Profile> profileOpt = Optional.ofNullable(profileRepository.getProfileByUserId(user.getId()));

        if (profileOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Profile does not exist");
        }

        return ResponseEntity.ok(profileOpt.get());
    }
}
