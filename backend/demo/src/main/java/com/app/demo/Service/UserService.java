package com.app.demo.Service;

import com.app.demo.DTO.LoginRequestDTO;
import com.app.demo.DTO.LoginResponseDTO;
import com.app.demo.DTO.UserRegisterDTO;
import com.app.demo.DTO.UserResponseDTO;
import com.app.demo.Entity.User;
import com.app.demo.Repository.UserRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponseDTO register(UserRegisterDTO userRegisterDTO) {

        User user=new User();
        user.setId(userRegisterDTO.getId());
        user.setFirstName(userRegisterDTO.getFirstName());
        user.setLastName(userRegisterDTO.getLastName());
        user.setEmail(userRegisterDTO.getEmail().trim().toLowerCase());
        user.setPassword(userRegisterDTO.getPassword());
        User savedUser=userRepository.save(user);

        UserResponseDTO userRegisterDTO1 =new UserResponseDTO();
        userRegisterDTO1.setId(savedUser.getId());
        userRegisterDTO1.setEmail(savedUser.getEmail());
        userRegisterDTO1.setFirstName(savedUser.getFirstName());
        userRegisterDTO1.setLastName(savedUser.getLastName());
        return userRegisterDTO1;

    }

}
