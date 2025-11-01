package com.example.stud_erp.controller;

import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.exception.OTPExpiredException;
import com.example.stud_erp.payload.ForgotPasswordRequest;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.service.HODService;
import com.example.stud_erp.service.ImageService;
import com.example.stud_erp.service.DepartmentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/hods")
@CrossOrigin(origins = "*")
public class HODController {

    private static final Logger logger = LoggerFactory.getLogger(HODController.class);
    private static final String ERROR_MESSAGE_PREFIX = "An error occurred: ";

    private final HODService hodService;
    private final ImageService imageService;
    private final DepartmentService departmentService;

    public HODController(HODService hodService, ImageService imageService, DepartmentService departmentService) {
        this.hodService = hodService;
        this.imageService = imageService;
        this.departmentService = departmentService;
    }

    @PostMapping("/add-hod")
    public ResponseEntity<String> createHOD(@RequestParam("file") MultipartFile multipartFile,
            @RequestParam("name") String name,
            @RequestParam("departmentName") String departmentName,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam(value = "subjects", required = false) String subjects) {
        try {
            // Auto-create department if it doesn't exist
            departmentService.createDepartmentIfNotExists(departmentName);

            HOD hod = new HOD();
            hod.setName(name);
            hod.setDepartment(departmentName);
            hod.setUsername(username);
            hod.setPassword(password);
            hod.setEmail(email);
            hod.setPhone(phone);

            // Handle subjects if provided
            if (subjects != null && !subjects.trim().isEmpty()) {
                try {
                    // Parse JSON array of subjects
                    String[] subjectArray = subjects.replace("[", "").replace("]", "")
                            .replace("\"", "").split(",");
                    List<String> subjectList = new ArrayList<>();
                    for (String subject : subjectArray) {
                        String trimmedSubject = subject.trim();
                        if (!trimmedSubject.isEmpty()) {
                            subjectList.add(trimmedSubject);
                        }
                    }
                    hod.setSubjects(subjectList);
                } catch (Exception e) {
                    logger.warn("Error parsing subjects, setting empty list: {}", e.getMessage());
                    hod.setSubjects(new ArrayList<>());
                }
            } else {
                hod.setSubjects(new ArrayList<>());
            }

            // Handle the image upload
            String imageUrl = imageService.uploadHodData(multipartFile, hod);
            hod.setImageUrl(imageUrl);

            // Set creation and update timestamps
            hod.setCreatedAt(LocalDateTime.now());
            hod.setUpdatedAt(LocalDateTime.now());

            hodService.saveHOD(hod);
            return ResponseEntity.status(HttpStatus.CREATED).body("HOD data successfully uploaded");
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while creating HOD: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("An HOD with the same Username or Email already exists.");
        } catch (Exception e) {
            logger.error("Error uploading HOD data: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading HOD data");
        }
    }

    @PutMapping("/update-hod/{id}")
    public ResponseEntity<String> updateHOD(@PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile multipartFile,
            @RequestParam("name") String name,
            @RequestParam("department") String department,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam(value = "subjects", required = false) String subjects) {
        try {
            HOD existingHOD = hodService.getHODById(id);
            if (existingHOD == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("HOD not found with ID: " + id);
            }

            existingHOD.setName(name);
            existingHOD.setDepartment(department);
            existingHOD.setUsername(username);
            existingHOD.setPassword(password);
            existingHOD.setEmail(email);
            existingHOD.setPhone(phone);

            // Handle subjects if provided
            if (subjects != null && !subjects.trim().isEmpty()) {
                try {
                    // Parse comma-separated subjects
                    String[] subjectArray = subjects.split(",");
                    List<String> subjectList = new ArrayList<>();
                    for (String subject : subjectArray) {
                        String trimmedSubject = subject.trim();
                        if (!trimmedSubject.isEmpty()) {
                            subjectList.add(trimmedSubject);
                        }
                    }
                    existingHOD.setSubjects(subjectList);
                } catch (Exception e) {
                    logger.warn("Error parsing subjects, keeping existing subjects: {}", e.getMessage());
                }
            }

            // Update image if provided
            if (multipartFile != null && !multipartFile.isEmpty()) {
                String imageUrl = imageService.uploadHodData(multipartFile, existingHOD);
                existingHOD.setImageUrl(imageUrl);
            }

            existingHOD.setUpdatedAt(LocalDateTime.now());
            hodService.saveHOD(existingHOD);

            return ResponseEntity.ok("HOD updated successfully.");
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating HOD: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("An HOD with the same Username or Email already exists.");
        } catch (Exception e) {
            logger.error("Error updating HOD data: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating HOD data");
        }
    }

    @GetMapping("/get-hod")
    public ResponseEntity<List<HOD>> getAllHODs() {
        List<HOD> hods = hodService.getAllHODs();
        return ResponseEntity.ok(hods);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HOD> getHODById(@PathVariable Long id) {
        HOD hod = hodService.getHODById(id);
        return hod != null ? ResponseEntity.ok(hod) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<HOD> updateHODProfile(@PathVariable Long id, @RequestBody HOD updatedHOD) {
        try {
            HOD hod = hodService.updateHODProfile(id, updatedHOD);
            return ResponseEntity.ok(hod);
        } catch (Exception e) {
            logger.error("Error updating HOD profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHOD(@PathVariable Long id) {
        hodService.deleteHOD(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            HOD authenticatedUser = hodService.authenticateUser(loginRequest);
            return ResponseEntity.ok(authenticatedUser);
        } catch (Exception ex) {
            logger.error("Login failed for user: {}", loginRequest.getUsername(), ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + ex.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Object> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            hodService.sendForgotPasswordEmail(request.getEmail());
            return ResponseEntity.ok("OTP sent to your email successfully");
        } catch (Exception ex) {
            logger.error("Error sending forgot password email: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ERROR_MESSAGE_PREFIX + ex.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Object> verifyOTP(@RequestParam String email, @RequestParam String otp) {
        try {
            hodService.verifyOTP(email, otp);
            return ResponseEntity.ok("OTP verified successfully");
        } catch (OTPExpiredException ex) {
            logger.error("OTP verification failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("OTP verification failed: " + ex.getMessage());
        } catch (Exception ex) {
            logger.error("Error verifying OTP: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ERROR_MESSAGE_PREFIX + ex.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Object> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            hodService.resetPassword(request);
            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception ex) {
            logger.error("Error resetting password: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ERROR_MESSAGE_PREFIX + ex.getMessage());
        }
    }
}
