package com.app.demo.Service;

import com.app.demo.DTO.LoginRequestDTO;
import com.app.demo.DTO.LoginResponseDTO;
import com.app.demo.DTO.UserRegisterDTO;
import com.app.demo.DTO.UserResponseDTO;
import com.app.demo.Entity.User;
import com.app.demo.Repository.UserRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> sendPdfToFastApi(MultipartFile file) throws Exception {

        String fastApiUrl = "http://localhost:8000/analyze-resume";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileAsResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                fastApiUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        return response.getBody();
    }
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
