package com.app.demo.DTO;

public class LoginResponseDTO {

    private String message;
    private boolean success;

    public LoginResponseDTO(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public boolean isSuccess() {
        return success;
    }
}