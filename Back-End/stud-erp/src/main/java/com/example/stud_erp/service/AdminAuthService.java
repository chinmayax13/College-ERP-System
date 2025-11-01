package com.example.stud_erp.service;

import com.example.stud_erp.entity.Admin;
import com.example.stud_erp.exception.OTPExpiredException;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class AdminAuthService {

  @Autowired
  private AdminRepository adminRepository;

  @Autowired
  private EmailService emailService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public Admin saveAdmin(Admin admin) {
    // Encrypt password before saving
    admin.setPassword(passwordEncoder.encode(admin.getPassword()));
    return adminRepository.save(admin);
  }

  public List<Admin> getAllAdmins() {
    return adminRepository.findAll();
  }

  public Admin getAdminById(Long id) {
    return adminRepository.findById(id).orElse(null);
  }

  public void deleteAdmin(Long id) {
    adminRepository.deleteById(id);
  }

  public Admin authenticateUser(LoginRequest loginRequest) {
    Admin user = adminRepository.findByUsername(loginRequest.getUsername());
    if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
      throw new RuntimeException("Invalid username or password");
    }
    return user;
  }

  public void sendForgotPasswordEmail(String email) {
    Admin user = adminRepository.findByEmail(email);
    if (user == null) {
      throw new OTPExpiredException("User with email " + email + " not found");
    }

    String otp = generateOTP();
    user.setOtp(otp);
    adminRepository.save(user);

    emailService.sendOtpEmail(user.getEmail(), otp);
  }

  private String generateOTP() {
    // Generate a random 6-digit OTP
    Random random = new Random();
    int otp = 100000 + random.nextInt(900000);
    return String.valueOf(otp);
  }

  public void verifyOTP(String email, String otp) {
    Admin user = adminRepository.findByEmail(email);
    if (user == null) {
      throw new OTPExpiredException("User with email " + email + " not found");
    }

    if (!user.getOtp().equals(otp)) {
      throw new OTPExpiredException("Invalid OTP");
    }
  }

  public void resetPassword(ResetPasswordRequest request) {
    Admin user = adminRepository.findByEmail(request.getEmail());
    if (user == null) {
      throw new OTPExpiredException("User with email " + request.getEmail() + " not found");
    }

    // Encrypt the new password before saving
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    user.setOtp(null); // Clear OTP after successful password reset
    adminRepository.save(user);
  }
}
