package com.app.demo.Controller;

import com.app.demo.DTO.JobResponseDTO;
import com.app.demo.Entity.Job;
import com.app.demo.Service.JobService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/create-job")
    public ResponseEntity<JobResponseDTO> postJob(@RequestBody Job job){
        JobResponseDTO response = jobService.saveJobAndGenerateQuery(job);
        return ResponseEntity.ok(response);
    }
}
