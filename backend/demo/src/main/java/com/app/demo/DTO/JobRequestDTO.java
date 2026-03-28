package com.app.demo.DTO;

import java.util.List;

public class JobRequestDTO{
    private String title;
    private String company;
    private String location;
    private List<String> skills;

    public JobRequestDTO() {}

    public JobRequestDTO(String title, String company, String location, List<String> skills) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.skills = skills;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}