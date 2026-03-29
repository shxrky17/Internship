package com.app.demo.Service;

import com.app.demo.DTO.JobResponseDTO;
import com.app.demo.DTO.JobRequestDTO;
import com.app.demo.DTO.PythonResponseDTO;
import com.app.demo.Entity.Job;
import com.app.demo.Repository.JobRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String PYTHON_API_URL = "http://127.0.0.1:8000/generate-query";

    public JobResponseDTO saveJobAndGenerateQuery(Job job) {

        // 1. Save job in DB first
        Job savedJob = jobRepository.save(job);

        // 2. Convert to Python request DTO
        JobRequestDTO pythonRequest = new JobRequestDTO();
        pythonRequest.setId(savedJob.getId());
        pythonRequest.setTitle(savedJob.getTitle());
        pythonRequest.setCompany(savedJob.getCompany());
        pythonRequest.setLocation(savedJob.getLocation());
        pythonRequest.setSkills(savedJob.getSkills());

        // 3. Prepare HTTP request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JobRequestDTO> requestEntity = new HttpEntity<>(pythonRequest, headers);

        // 4. Call Python API
        ResponseEntity<PythonResponseDTO> pythonResponse = restTemplate.exchange(
                PYTHON_API_URL,
                HttpMethod.POST,
                requestEntity,
                PythonResponseDTO.class
        );

        PythonResponseDTO body = pythonResponse.getBody();

        // 5. Build response for frontend
        JobResponseDTO response = new JobResponseDTO();
        response.setId(savedJob.getId());
        response.setTitle(savedJob.getTitle());
        response.setCompany(savedJob.getCompany());
        response.setLocation(savedJob.getLocation());
        response.setSkills(savedJob.getSkills());

        if (body != null) {
            response.setGeneratedQuery(body.getGeneratedQuery());
            response.setEmbeddingLength(body.getEmbeddingLength());
            response.setMessage(body.getMessage());
        } else {
            response.setMessage("Job saved, but Python API returned empty response");
        }

        return response;
    }
}