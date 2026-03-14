package com.app.demo.DTO;

import com.app.demo.Entity.Profile;

public class ProfileResponseDTO {
    private String email;
    private Profile profile;

    public ProfileResponseDTO() {}

    public ProfileResponseDTO(String email, Profile profile) {
        this.email = email;
        this.profile = profile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }
}
