package com.example.stud_erp.service;

import com.example.stud_erp.entity.*;
import com.example.stud_erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AdminService {

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private ProfessorRepository professorRepository;

  @Autowired
  private HODRepository hodRepository;

  @Autowired
  private DepartmentRepository departmentRepository;

  @Autowired
  private CourseRepository courseRepository;

  @Autowired
  private SemesterRepository semesterRepository;

  @Autowired
  private AttendanceRepository attendanceRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  // Dashboard Statistics
  public Map<String, Object> getDashboardStatistics() {
    Map<String, Object> stats = new HashMap<>();

    stats.put("totalStudents", studentRepository.count());
    stats.put("totalProfessors", professorRepository.count());
    stats.put("totalHODs", hodRepository.count());
    stats.put("totalDepartments", departmentRepository.count());
    stats.put("totalCourses", courseRepository.count());
    stats.put("totalSemesters", semesterRepository.count());
    stats.put("totalAttendanceRecords", attendanceRepository.count());

    // Recent activity counts (last 30 days) - simplified for now
    stats.put("recentStudents", 0);
    stats.put("recentProfessors", 0);

    return stats;
  }

  // Student Management
  public List<Student> getAllStudents() {
    return studentRepository.findAll();
  }

  public Student getStudentById(Long id) {
    return studentRepository.findById(id).orElse(null);
  }

  public Student createStudent(Student student) {
    // Encrypt password before saving
    student.setPassword(passwordEncoder.encode(student.getPassword()));
    return studentRepository.save(student);
  }

  public Student updateStudent(Long id, Student studentDetails) {
    return studentRepository.findById(id)
        .map(student -> {
          if (studentDetails.getStudName() != null) {
            student.setStudName(studentDetails.getStudName());
          }
          if (studentDetails.getEmail() != null) {
            student.setEmail(studentDetails.getEmail());
          }
          if (studentDetails.getStudPhoneNumber() != null) {
            student.setStudPhoneNumber(studentDetails.getStudPhoneNumber());
          }
          if (studentDetails.getUsername() != null) {
            student.setUsername(studentDetails.getUsername());
          }
          if (studentDetails.getPassword() != null && !studentDetails.getPassword().isEmpty()) {
            student.setPassword(passwordEncoder.encode(studentDetails.getPassword()));
          }
          if (studentDetails.getMajor() != null) {
            student.setMajor(studentDetails.getMajor());
          }
          if (studentDetails.getYear() != 0) {
            student.setYear(studentDetails.getYear());
          }
          if (studentDetails.getStudRollNo() != null) {
            student.setStudRollNo(studentDetails.getStudRollNo());
          }
          if (studentDetails.getStudFatherName() != null) {
            student.setStudFatherName(studentDetails.getStudFatherName());
          }
          if (studentDetails.getStudLastName() != null) {
            student.setStudLastName(studentDetails.getStudLastName());
          }

          return studentRepository.save(student);
        })
        .orElse(null);
  }

  public void deleteStudent(Long id) {
    studentRepository.deleteById(id);
  }

  // Professor Management
  public List<Professor> getAllProfessors() {
    return professorRepository.findAll();
  }

  public Professor getProfessorById(Long id) {
    return professorRepository.findById(id).orElse(null);
  }

  public Professor createProfessor(Professor professor) {
    // Encrypt password before saving
    professor.setPassword(passwordEncoder.encode(professor.getPassword()));

    // Auto-create department if it doesn't exist
    createDepartmentIfNotExists(professor.getDepartmentName());

    return professorRepository.save(professor);
  }

  public Professor updateProfessor(Long id, Professor professorDetails) {
    return professorRepository.findById(id)
        .map(professor -> {
          professor.setName(professorDetails.getName());
          professor.setEmail(professorDetails.getEmail());
          professor.setPhone(professorDetails.getPhone());
          professor.setUsername(professorDetails.getUsername());
          if (professorDetails.getPassword() != null && !professorDetails.getPassword().isEmpty()) {
            professor.setPassword(passwordEncoder.encode(professorDetails.getPassword()));
          }
          professor.setDepartmentName(professorDetails.getDepartmentName());
          professor.setSubjects(professorDetails.getSubjects());

          // Auto-create department if it doesn't exist
          createDepartmentIfNotExists(professorDetails.getDepartmentName());

          return professorRepository.save(professor);
        })
        .orElse(null);
  }

  public void deleteProfessor(Long id) {
    professorRepository.deleteById(id);
  }

  // HOD Management
  public List<HOD> getAllHODs() {
    return hodRepository.findAll();
  }

  public HOD getHODById(Long id) {
    return hodRepository.findById(id).orElse(null);
  }

  public HOD createHOD(HOD hod) {
    // Encrypt password before saving
    hod.setPassword(passwordEncoder.encode(hod.getPassword()));

    // Auto-create department if it doesn't exist
    createDepartmentIfNotExists(hod.getDepartment());

    return hodRepository.save(hod);
  }

  public HOD updateHOD(Long id, HOD hodDetails) {
    return hodRepository.findById(id)
        .map(hod -> {
          hod.setName(hodDetails.getName());
          hod.setDepartment(hodDetails.getDepartment());
          hod.setUsername(hodDetails.getUsername());
          if (hodDetails.getPassword() != null && !hodDetails.getPassword().isEmpty()) {
            hod.setPassword(passwordEncoder.encode(hodDetails.getPassword()));
          }
          hod.setEmail(hodDetails.getEmail());
          hod.setPhone(hodDetails.getPhone());
          hod.setSubjects(hodDetails.getSubjects());

          // Auto-create department if it doesn't exist
          createDepartmentIfNotExists(hodDetails.getDepartment());

          return hodRepository.save(hod);
        })
        .orElse(null);
  }

  public void deleteHOD(Long id) {
    hodRepository.deleteById(id);
  }

  private void createDepartmentIfNotExists(String departmentName) {
    try {
      // Check if department already exists
      List<Department> existingDepartments = departmentRepository.findAll();
      boolean departmentExists = existingDepartments.stream()
          .anyMatch(dept -> dept.getName().equalsIgnoreCase(departmentName));

      if (!departmentExists) {
        // Create new department
        Department newDepartment = new Department();
        newDepartment.setName(departmentName);
        departmentRepository.save(newDepartment);
        System.out.println("✅ Auto-created department: " + departmentName);
      }
    } catch (Exception e) {
      System.err.println("❌ Error creating department: " + e.getMessage());
    }
  }

  // Department Management
  public List<Department> getAllDepartments() {
    return departmentRepository.findAll();
  }

  public Department createDepartment(Department department) {
    return departmentRepository.save(department);
  }

  public Department updateDepartment(Long id, Department departmentDetails) {
    Department department = departmentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

    department.setName(departmentDetails.getName());

    return departmentRepository.save(department);
  }

  public void deleteDepartment(Long id) {
    departmentRepository.deleteById(id);
  }

  // Course Management
  public List<Course> getAllCourses() {
    return courseRepository.findAll();
  }

  public Course createCourse(Course course) {
    return courseRepository.save(course);
  }

  public Course updateCourse(Long id, Course courseDetails) {
    Course course = courseRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

    course.setName(courseDetails.getName());
    course.setCredits(courseDetails.getCredits());
    course.setProfessor(courseDetails.getProfessor());

    return courseRepository.save(course);
  }

  public void deleteCourse(Long id) {
    courseRepository.deleteById(id);
  }

  // Bulk Operations
  public Map<String, Object> bulkImportStudents(List<Student> students) {
    Map<String, Object> result = new HashMap<>();
    int successCount = 0;
    int errorCount = 0;

    for (Student student : students) {
      try {
        // Encrypt password before saving
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        studentRepository.save(student);
        successCount++;
      } catch (Exception e) {
        errorCount++;
      }
    }

    result.put("totalProcessed", students.size());
    result.put("successCount", successCount);
    result.put("errorCount", errorCount);
    result.put("message", String.format("Successfully imported %d students, %d errors", successCount, errorCount));

    return result;
  }

  public Map<String, Object> bulkImportProfessors(List<Professor> professors) {
    Map<String, Object> result = new HashMap<>();
    int successCount = 0;
    int errorCount = 0;

    for (Professor professor : professors) {
      try {
        // Encrypt password before saving
        professor.setPassword(passwordEncoder.encode(professor.getPassword()));
        professorRepository.save(professor);
        successCount++;
      } catch (Exception e) {
        errorCount++;
      }
    }

    result.put("totalProcessed", professors.size());
    result.put("successCount", successCount);
    result.put("errorCount", errorCount);
    result.put("message", String.format("Successfully imported %d professors, %d errors", successCount, errorCount));

    return result;
  }

  // System Health Check
  public Map<String, Object> getSystemHealth() {
    Map<String, Object> health = new HashMap<>();

    try {
      // Test database connectivity
      studentRepository.count();
      health.put("database", "UP");
    } catch (Exception e) {
      health.put("database", "DOWN");
    }

    health.put("timestamp", LocalDateTime.now());
    health.put("status", "HEALTHY");

    return health;
  }
}
