package com.example.stud_erp.controller;

import com.example.stud_erp.entity.Admin;
import com.example.stud_erp.exception.OTPExpiredException;
import com.example.stud_erp.payload.ForgotPasswordRequest;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.service.AdminAuthService;
import com.example.stud_erp.service.ImageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "*")
public class AdminAuthController {

  @Autowired
  private AdminAuthService adminAuthService;

  @Autowired
  private ImageService imageService;

  @PostMapping("/signup")
  public ResponseEntity<String> createAdmin(@RequestParam("file") MultipartFile multipartFile,
      @RequestParam("name") String name,
      @RequestParam("username") String username,
      @RequestParam("password") String password,
      @RequestParam("email") String email,
      @RequestParam("phone") String phone) {
    try {
      Admin admin = new Admin();
      admin.setName(name);
      admin.setUsername(username);
      admin.setPassword(password);
      admin.setEmail(email);
      admin.setPhone(phone);

      // Handle the image upload
      String imageUrl = imageService.uploadAdminData(multipartFile, admin);
      admin.setImageUrl(imageUrl);

      adminAuthService.saveAdmin(admin);
      return ResponseEntity.ok("Admin account created successfully");
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body("An admin with the same Username or Email already exists.");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating admin account");
    }
  }

  @GetMapping("/admins")
  public ResponseEntity<List<Admin>> getAllAdmins() {
    List<Admin> admins = adminAuthService.getAllAdmins();
    return ResponseEntity.ok(admins);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
    Admin admin = adminAuthService.getAdminById(id);
    return admin != null ? ResponseEntity.ok(admin) : ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
    adminAuthService.deleteAdmin(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<Admin> updateAdmin(@PathVariable Long id,
      @RequestParam(value = "file", required = false) MultipartFile multipartFile,
      @RequestParam("name") String name,
      @RequestParam("username") String username,
      @RequestParam("password") String password,
      @RequestParam("email") String email,
      @RequestParam("phone") String phone) {
    try {
      Admin existingAdmin = adminAuthService.getAdminById(id);
      if (existingAdmin == null) {
        return ResponseEntity.notFound().build();
      }

      // Update admin fields
      existingAdmin.setName(name);
      existingAdmin.setUsername(username);
      if (password != null && !password.isEmpty()) {
        existingAdmin.setPassword(password);
      }
      existingAdmin.setEmail(email);
      existingAdmin.setPhone(phone);

      // Handle image update if provided
      if (multipartFile != null && !multipartFile.isEmpty()) {
        String imageUrl = imageService.uploadAdminData(multipartFile, existingAdmin);
        existingAdmin.setImageUrl(imageUrl);
      }

      Admin updatedAdmin = adminAuthService.saveAdmin(existingAdmin);
      return ResponseEntity.ok(updatedAdmin);
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
    try {
      Admin authenticatedUser = adminAuthService.authenticateUser(loginRequest);
      return ResponseEntity.ok(authenticatedUser);
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + ex.getMessage());
    }
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    try {
      adminAuthService.sendForgotPasswordEmail(request.getEmail());
      return ResponseEntity.ok("OTP sent to your email successfully");
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("An error occurred: " + ex.getMessage());
    }
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<?> verifyOTP(@RequestParam String email, @RequestParam String otp) {
    try {
      adminAuthService.verifyOTP(email, otp);
      return ResponseEntity.ok("OTP verified successfully");
    } catch (OTPExpiredException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("OTP verification failed: " + ex.getMessage());
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("An error occurred: " + ex.getMessage());
    }
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
    try {
      adminAuthService.resetPassword(request);
      return ResponseEntity.ok("Password reset successfully");
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("An error occurred: " + ex.getMessage());
    }
  }
}
