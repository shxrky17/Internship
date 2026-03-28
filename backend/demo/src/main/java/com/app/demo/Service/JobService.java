package com.app.demo.Service;

import com.app.demo.DTO.JobRequestDTO;
import com.app.demo.DTO.JobResponseDTO;
import com.app.demo.DTO.PythonResponseDTO;
import com.app.demo.Entity.Job;
import com.app.demo.Repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private RestTemplate restTemplate;

    public JobResponseDTO saveJobAndGenerateQuery(Job job) {

        // save in DB
        Job savedJob = jobRepository.save(job);

        // prepare request for python api
        JobRequestDTO requestDTO = new JobRequestDTO(
                savedJob.getTitle(),
                savedJob.getCompany(),
                savedJob.getLocation(),
                savedJob.getSkills()
        );

        // call python api
        String pythonUrl = "http://localhost:8000/generate-query";
        PythonResponseDTO pythonResponse = restTemplate.postForObject(
                pythonUrl,
                requestDTO,
                PythonResponseDTO.class
        );

        // build final response
        JobResponseDTO response = new JobResponseDTO();
        response.setId(savedJob.getId());
        response.setTitle(savedJob.getTitle());
        response.setCompany(savedJob.getCompany());
        response.setLocation(savedJob.getLocation());
        response.setSkills(savedJob.getSkills());

        if (pythonResponse != null) {
            response.setGeneratedQuery(pythonResponse.getGeneratedQuery());
        }

        return response;
    }

    public Job saveJob(Job job){
        return jobRepository.save(job);
    }
}
