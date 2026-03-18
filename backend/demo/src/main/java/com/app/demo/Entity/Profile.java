package com.app.demo.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String dob;
    private String phoneNumber;
    private String gender;
    private String district;
    private String cv;
    private String state;
    private String highestQualification;
    private String fieldOfStudy;
    private String clgName;
    private String gradYear;
    private String skills;
    private String languages;
    private String bio;
    private String marksheet10;
    private String marksheet12ITI;

    @JsonIgnore
    @OneToOne(optional = false)
    @JoinColumn(name="user_id", unique = true)
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getHighestQualification() {
        return highestQualification;
    }

    public void setHighestQualification(String highestQualification) {
        this.highestQualification = highestQualification;
    }

    public String getClgName() {
        return clgName;
    }

    public void setClgName(String clgName) {
        this.clgName = clgName;
    }

    public String getGradYear() {
        return gradYear;
    }

    public void setGradYear(String gradYear) {
        this.gradYear = gradYear;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCv() {
        return cv;
    }

    public void setCv(String cv) {
        this.cv = cv;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getMarksheet10() {
        return marksheet10;
    }

    public void setMarksheet10(String marksheet10) {
        this.marksheet10 = marksheet10;
    }

    public String getMarksheet12ITI() {
        return marksheet12ITI;
    }

    public void setMarksheet12ITI(String marksheet12ITI) {
        this.marksheet12ITI = marksheet12ITI;
    }

    public Profile() {
    }

    public Profile(Integer id, String dob, String phoneNumber, String gender, String district, String cv, String state, String highestQualification, String fieldOfStudy, String gradYear, String clgName, String skills, String languages, String bio, String marksheet10, String marksheet12ITI, User user) {
        this.id = id;
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.district = district;
        this.cv = cv;
        this.state = state;
        this.highestQualification = highestQualification;
        this.fieldOfStudy = fieldOfStudy;
        this.gradYear = gradYear;
        this.clgName = clgName;
        this.skills = skills;
        this.languages = languages;
        this.bio = bio;
        this.marksheet10 = marksheet10;
        this.marksheet12ITI = marksheet12ITI;
        this.user = user;
    }
}
