package com.example.stud_erp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.stud_erp.entity.Admin;
import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.entity.Professor;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.repository.AdminRepository;
import com.example.stud_erp.repository.HODRepository;
import com.example.stud_erp.repository.ProfessorRepository;
import com.example.stud_erp.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private HODRepository hodRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private Cloudinary cloudinary;

    public void saveStudent(Student student) {
        studentRepository.save(student);
    }

    public void saveProfessor(Professor professor) {
        professorRepository.save(professor);
    }

    public void saveHod(HOD hod) {
        hodRepository.save(hod);
    }

    public void saveAdmin(Admin admin) {
        adminRepository.save(admin);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public String upload(MultipartFile multipartFile) {
        try {
            if (multipartFile == null || multipartFile.isEmpty()) {
                logger.warn("No file provided for upload");
                return "No file provided";
            }

            logger.info("Starting image upload - File: {}, Size: {} bytes",
                    multipartFile.getOriginalFilename(), multipartFile.getSize());

            // Upload to Cloudinary with minimal options to avoid signature issues
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(
                    multipartFile.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "college_erp",
                            "resource_type", "auto"));

            String imageUrl = (String) uploadResult.get("secure_url");
            logger.info("Image uploaded successfully to Cloudinary: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            logger.error("IO Error uploading image to Cloudinary - File: {}, Error: {}",
                    multipartFile != null ? multipartFile.getOriginalFilename() : "unknown",
                    e.getMessage(), e);
            return "Image couldn't upload, IO Error: " + e.getMessage();
        } catch (Exception e) {
            logger.error("Unexpected error uploading image - File: {}, Error: {}, Type: {}",
                    multipartFile != null ? multipartFile.getOriginalFilename() : "unknown",
                    e.getMessage(), e.getClass().getSimpleName(), e);
            return "Image couldn't upload, Something went wrong: " + e.getMessage();
        }
    }

    public String uploadStudentData(MultipartFile multipartFile, Student student) {
        String imageUrl = this.upload(multipartFile);
        if (!imageUrl.startsWith("http")) {
            // Upload failed, use default image or handle error
            logger.warn("Student image upload failed, using default");
            imageUrl = null;
        }
        student.setImageUrl(imageUrl);
        return imageUrl;
    }

    public String uploadProfData(MultipartFile multipartFile, Professor professor) {
        String imageUrl = this.upload(multipartFile);
        if (!imageUrl.startsWith("http")) {
            // Upload failed, use default image or handle error
            logger.warn("Professor image upload failed, using default");
            imageUrl = null;
        }
        professor.setImageUrl(imageUrl);
        return imageUrl;
    }

    public String uploadHodData(MultipartFile multipartFile, HOD hod) {
        String imageUrl = this.upload(multipartFile);
        if (!imageUrl.startsWith("http")) {
            // Upload failed, use default image or handle error
            logger.warn("HOD image upload failed, using default");
            imageUrl = null;
        }
        hod.setImageUrl(imageUrl);
        return imageUrl;
    }

    public String uploadAdminData(MultipartFile multipartFile, Admin admin) {
        String imageUrl = this.upload(multipartFile);
        if (!imageUrl.startsWith("http")) {
            // Upload failed, use default image or handle error
            logger.warn("Admin image upload failed, using default");
            imageUrl = null;
        }
        admin.setImageUrl(imageUrl);
        return imageUrl;
    }
}
