package com.app.demo.DTO;

import java.util.List;

public class PythonResponseDTO {
    private Integer id;
    private String title;
    private String company;
    private String location;
    private List<String> skills;
    private String generatedQuery;
    private Integer embeddingLength;
    private String message;

    public PythonResponseDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getGeneratedQuery() {
        return generatedQuery;
    }

    public void setGeneratedQuery(String generatedQuery) {
        this.generatedQuery = generatedQuery;
    }

    public Integer getEmbeddingLength() {
        return embeddingLength;
    }

    public void setEmbeddingLength(Integer embeddingLength) {
        this.embeddingLength = embeddingLength;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}