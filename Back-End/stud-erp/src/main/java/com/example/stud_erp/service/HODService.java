package com.example.stud_erp.service;

import com.example.stud_erp.entity.Department;
import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.exception.OTPExpiredException;
import com.example.stud_erp.exception.ResourceNotFoundException;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.repository.HODRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class HODService {

    @Autowired
    private HODRepository hodRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DepartmentService departmentService;

    public HOD saveHOD(HOD hod) {
        // Encrypt password before saving
        hod.setPassword(passwordEncoder.encode(hod.getPassword()));

        // Auto-create department if it doesn't exist
        createDepartmentIfNotExists(hod.getDepartment());

        return hodRepository.save(hod);
    }

    private void createDepartmentIfNotExists(String departmentName) {
        try {
            // Check if department already exists
            List<Department> existingDepartments = departmentService.getAllDepartments();
            boolean departmentExists = existingDepartments.stream()
                    .anyMatch(dept -> dept.getName().equalsIgnoreCase(departmentName));

            if (!departmentExists) {
                // Create new department
                Department newDepartment = new Department();
                newDepartment.setName(departmentName);
                departmentService.saveDepartment(newDepartment);
                System.out.println("✅ Auto-created department: " + departmentName);
            } else {
                System.out.println("🔄 Department already exists: " + departmentName);
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating department: " + e.getMessage());
        }
    }

    public List<HOD> getAllHODs() {
        return hodRepository.findAll();
    }

    public HOD getHODById(Long id) {
        return hodRepository.findById(id).orElse(null);
    }

    public void deleteHOD(Long id) {
        hodRepository.deleteById(id);
    }

    public HOD updateHOD(Long id, HOD hodDetails) {
        HOD hod = hodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found for this id :: " + id));

        hod.setName(hodDetails.getName());
        hod.setDepartment(hodDetails.getDepartment());
        hod.setUsername(hodDetails.getUsername());
        hod.setPassword(hodDetails.getPassword());
        hod.setEmail(hodDetails.getEmail());
        hod.setPhone(hodDetails.getPhone());
        hod.setSubjects(hodDetails.getSubjects());
        hod.setUpdatedAt(LocalDateTime.now());

        if (hodDetails.getImageUrl() != null) {
            hod.setImageUrl(hodDetails.getImageUrl());
        }

        return hodRepository.save(hod);
    }

    public HOD updateHODProfile(Long id, HOD hodDetails) {
        HOD hod = hodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found for this id :: " + id));

        // Allow HOD to update their own profile information
        if (hodDetails.getName() != null) {
            hod.setName(hodDetails.getName());
        }
        if (hodDetails.getEmail() != null) {
            hod.setEmail(hodDetails.getEmail());
        }
        if (hodDetails.getPhone() != null) {
            hod.setPhone(hodDetails.getPhone());
        }
        if (hodDetails.getDepartment() != null) {
            hod.setDepartment(hodDetails.getDepartment());
            // Auto-create department if it doesn't exist
            createDepartmentIfNotExists(hodDetails.getDepartment());
        }
        if (hodDetails.getSubjects() != null) {
            hod.setSubjects(hodDetails.getSubjects());
        }
        // Only encrypt and update password if provided
        if (hodDetails.getPassword() != null && !hodDetails.getPassword().isEmpty()) {
            hod.setPassword(passwordEncoder.encode(hodDetails.getPassword()));
        }
        hod.setUpdatedAt(LocalDateTime.now());

        return hodRepository.save(hod);
    }

    public HOD authenticateUser(LoginRequest loginRequest) {
        HOD user = hodRepository.findByUsername(loginRequest.getUsername());
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        return user;
    }

    public void sendForgotPasswordEmail(String email) {
        HOD user = hodRepository.findByEmail(email).getHod();
        if (user == null) {
            throw new OTPExpiredException("User with email " + email + " not found");
        }

        String otp = generateOTP();
        user.setOtp(otp);
        hodRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    private String generateOTP() {
        // Generate a random 6-digit OTP
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public void verifyOTP(String email, String otp) {
        HOD user = hodRepository.findByEmail(email).getHod();
        if (user == null) {
            throw new OTPExpiredException("User with email " + email + " not found");
        }

        if (!user.getOtp().equals(otp)) {
            throw new OTPExpiredException("Invalid OTP");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        HOD hod = hodRepository.findByEmail(request.getEmail()).getHod();
        if (hod == null) {
            throw new OTPExpiredException("User with email " + request.getEmail() + " not found");
        }

        // Encrypt the new password before saving
        hod.setPassword(passwordEncoder.encode(request.getNewPassword()));
        hod.setOtp(null); // Clear OTP after successful password reset
        hodRepository.save(hod);
    }
}
