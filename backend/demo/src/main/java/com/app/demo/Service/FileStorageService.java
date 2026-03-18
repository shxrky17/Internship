package com.app.demo.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/";

    public FileStorageService() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public String storeFile(MultipartFile file, String prefix) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Clean prefix (remove @, ., etc. to be safe for filenames)
            String safePrefix = prefix.replaceAll("[^a-zA-Z0-9_]", "_");
            
            // Get original extension
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String fileName = safePrefix + "_" + System.currentTimeMillis() + extension;
            Path targetLocation = Paths.get(uploadDir).resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Return the relative path or URL
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file", e);
        }
    }

    public void deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }

        try {
            // filePath is like "/uploads/filename.ext"
            // We need to resolve it relative to the working directory or just take the filename
            String fileName = filePath;
            if (filePath.startsWith("/uploads/")) {
                fileName = filePath.substring("/uploads/".length());
            } else if (filePath.startsWith("uploads/")) {
                fileName = filePath.substring("uploads/".length());
            }

            Path path = Paths.get(uploadDir).resolve(fileName);
            if (Files.exists(path)) {
                Files.delete(path);
                System.out.println("[DEBUG] Deleted old file: " + path.toString());
            }
        } catch (IOException e) {
            System.err.println("[ERROR] Could not delete file: " + filePath + ". Error: " + e.getMessage());
            // We don't throw exception here to avoid breaking the upload flow if deletion fails
        }
    }
}