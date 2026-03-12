package com.app.demo.Controller;

import com.app.demo.DTO.LoginRequestDTO;
import com.app.demo.DTO.LoginResponseDTO;
import com.app.demo.DTO.UserRegisterDTO;
import com.app.demo.DTO.UserResponseDTO;
import com.app.demo.Entity.User;
import com.app.demo.Repository.UserRepository;
import com.app.demo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UserController{

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

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

        LoginResponseDTO response = new LoginResponseDTO("Login successful", true);

        return ResponseEntity.ok(response);
    }
}
