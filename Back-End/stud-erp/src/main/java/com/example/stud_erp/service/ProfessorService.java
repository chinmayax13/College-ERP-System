package com.example.stud_erp.service;

import com.example.stud_erp.entity.Department;
import com.example.stud_erp.entity.Professor;
import com.example.stud_erp.exception.OTPExpiredException;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.List;
import java.util.Random;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DepartmentService departmentService;

    public Professor saveProfessor(Professor professor) {
        // Encrypt password before saving
        professor.setPassword(passwordEncoder.encode(professor.getPassword()));

        // Auto-create department if it doesn't exist
        createDepartmentIfNotExists(professor.getDepartmentName());

        return professorRepository.save(professor);
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
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating department: " + e.getMessage());
        }
    }

    public List<Professor> getAllProfessors() {
        return professorRepository.findAll();
    }

    public Professor getProfessorById(String id) {
        return professorRepository.findByProfessorId(id);
    }

    public void deleteProfessor(Long id) {
        professorRepository.deleteById(id);
    }

    public Professor updateProfessorProfile(Long id, Professor professorDetails) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found for this id :: " + id));

        // Allow Professor to update their own profile information
        if (professorDetails.getName() != null) {
            professor.setName(professorDetails.getName());
        }
        if (professorDetails.getEmail() != null) {
            professor.setEmail(professorDetails.getEmail());
        }
        if (professorDetails.getPhone() != null) {
            professor.setPhone(professorDetails.getPhone());
        }
        if (professorDetails.getDepartmentName() != null) {
            professor.setDepartmentName(professorDetails.getDepartmentName());
            // Auto-create department if it doesn't exist
            createDepartmentIfNotExists(professorDetails.getDepartmentName());
        }
        if (professorDetails.getSubject() != null) {
            professor.setSubject(professorDetails.getSubject());
        }
        if (professorDetails.getSubjects() != null) {
            professor.setSubjects(professorDetails.getSubjects());
        }
        // Only encrypt and update password if provided
        if (professorDetails.getPassword() != null && !professorDetails.getPassword().isEmpty()) {
            professor.setPassword(passwordEncoder.encode(professorDetails.getPassword()));
        }

        return professorRepository.save(professor);
    }

    public Professor authenticateUser(LoginRequest loginRequest) {
        Professor user = professorRepository.findByUsername(loginRequest.getUsername());
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        return user;
    }

    public void sendForgotPasswordEmail(String email) {
        Professor user = professorRepository.findByEmail(email);
        if (user == null) {
            throw new OTPExpiredException("User with email " + email + " not found");
        }

        String otp = generateOTP();
        user.setOtp(otp);
        professorRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    private String generateOTP() {
        // Generate a random 6-digit OTP
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public void verifyOTP(String email, String otp) {
        Professor user = professorRepository.findByEmail(email);
        if (user == null) {
            throw new OTPExpiredException("User with email " + email + " not found");
        }

        if (!user.getOtp().equals(otp)) {
            throw new OTPExpiredException("Invalid OTP");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        Professor user = professorRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new OTPExpiredException("User with email " + request.getEmail() + " not found");
        }

        // Encrypt the new password before saving
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtp(null); // Clear OTP after successful password reset
        professorRepository.save(user);
    }
}
