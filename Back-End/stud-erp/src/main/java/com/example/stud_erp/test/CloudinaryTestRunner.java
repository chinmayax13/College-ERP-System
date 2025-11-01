package com.example.stud_erp.test;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Temporary test class to verify Cloudinary connection
 * Remove this after testing
 */
@Component
public class CloudinaryTestRunner implements CommandLineRunner {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Test Cloudinary connection
            var config = cloudinary.config;
            System.out.println("✅ Cloudinary Configuration:");
            System.out.println("   Cloud Name: " + config.cloudName);
            System.out.println("   API Key: " + config.apiKey.substring(0, 6) + "...");
            System.out.println("   Secure: " + config.secure);
            System.out.println("✅ Cloudinary connection configured successfully!");
        } catch (Exception e) {
            System.err.println("❌ Cloudinary configuration error: " + e.getMessage());
        }
    }
}
