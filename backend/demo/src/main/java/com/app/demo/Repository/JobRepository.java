package com.app.demo.Repository;

import com.app.demo.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

@Repository
public interface JobRepository extends JpaRepository<Job,Integer> {

}
