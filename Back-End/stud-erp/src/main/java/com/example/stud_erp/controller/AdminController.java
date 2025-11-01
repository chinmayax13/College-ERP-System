package com.example.stud_erp.controller;

import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.Professor;
import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.entity.Department;
import com.example.stud_erp.entity.Course;
import com.example.stud_erp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

  @Autowired
  private AdminService adminService;

  // Dashboard Statistics
  @GetMapping("/dashboard/stats")
  public ResponseEntity<Map<String, Object>> getDashboardStats() {
    Map<String, Object> stats = adminService.getDashboardStatistics();
    return ResponseEntity.ok(stats);
  }

  // Student Management
  @GetMapping("/students")
  public ResponseEntity<List<Student>> getAllStudents() {
    List<Student> students = adminService.getAllStudents();
    return ResponseEntity.ok(students);
  }

  @GetMapping("/students/{id}")
  public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
    Student student = adminService.getStudentById(id);
    return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
  }

  @PostMapping("/students")
  public ResponseEntity<Student> createStudent(@RequestBody Student student) {
    Student createdStudent = adminService.createStudent(student);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
  }

  @PutMapping("/students/{id}")
  public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
    Student updatedStudent = adminService.updateStudent(id, student);
    return updatedStudent != null ? ResponseEntity.ok(updatedStudent) : ResponseEntity.notFound().build();
  }

  @DeleteMapping("/students/{id}")
  public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
    adminService.deleteStudent(id);
    return ResponseEntity.noContent().build();
  }

  // Professor Management
  @GetMapping("/professors")
  public ResponseEntity<List<Professor>> getAllProfessors() {
    List<Professor> professors = adminService.getAllProfessors();
    return ResponseEntity.ok(professors);
  }

  @GetMapping("/professors/{id}")
  public ResponseEntity<Professor> getProfessorById(@PathVariable Long id) {
    Professor professor = adminService.getProfessorById(id);
    return professor != null ? ResponseEntity.ok(professor) : ResponseEntity.notFound().build();
  }

  @PostMapping("/professors")
  public ResponseEntity<Professor> createProfessor(@RequestBody Professor professor) {
    Professor createdProfessor = adminService.createProfessor(professor);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdProfessor);
  }

  @PutMapping("/professors/{id}")
  public ResponseEntity<Professor> updateProfessor(@PathVariable Long id, @RequestBody Professor professor) {
    Professor updatedProfessor = adminService.updateProfessor(id, professor);
    return updatedProfessor != null ? ResponseEntity.ok(updatedProfessor) : ResponseEntity.notFound().build();
  }

  @DeleteMapping("/professors/{id}")
  public ResponseEntity<Void> deleteProfessor(@PathVariable Long id) {
    adminService.deleteProfessor(id);
    return ResponseEntity.noContent().build();
  }

  // HOD Management
  @GetMapping("/hods")
  public ResponseEntity<List<HOD>> getAllHODs() {
    List<HOD> hods = adminService.getAllHODs();
    return ResponseEntity.ok(hods);
  }

  @GetMapping("/hods/{id}")
  public ResponseEntity<HOD> getHODById(@PathVariable Long id) {
    HOD hod = adminService.getHODById(id);
    return hod != null ? ResponseEntity.ok(hod) : ResponseEntity.notFound().build();
  }

  @PostMapping("/hods")
  public ResponseEntity<HOD> createHOD(@RequestBody HOD hod) {
    HOD createdHOD = adminService.createHOD(hod);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdHOD);
  }

  @PutMapping("/hods/{id}")
  public ResponseEntity<HOD> updateHOD(@PathVariable Long id, @RequestBody HOD hod) {
    HOD updatedHOD = adminService.updateHOD(id, hod);
    return updatedHOD != null ? ResponseEntity.ok(updatedHOD) : ResponseEntity.notFound().build();
  }

  @DeleteMapping("/hods/{id}")
  public ResponseEntity<Void> deleteHOD(@PathVariable Long id) {
    adminService.deleteHOD(id);
    return ResponseEntity.noContent().build();
  }

  // Department Management
  @GetMapping("/departments")
  public ResponseEntity<List<Department>> getAllDepartments() {
    List<Department> departments = adminService.getAllDepartments();
    return ResponseEntity.ok(departments);
  }

  @PostMapping("/departments")
  public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
    Department createdDepartment = adminService.createDepartment(department);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdDepartment);
  }

  @PutMapping("/departments/{id}")
  public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department department) {
    Department updatedDepartment = adminService.updateDepartment(id, department);
    return ResponseEntity.ok(updatedDepartment);
  }

  @DeleteMapping("/departments/{id}")
  public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
    adminService.deleteDepartment(id);
    return ResponseEntity.noContent().build();
  }

  // Course Management
  @GetMapping("/courses")
  public ResponseEntity<List<Course>> getAllCourses() {
    List<Course> courses = adminService.getAllCourses();
    return ResponseEntity.ok(courses);
  }

  @PostMapping("/courses")
  public ResponseEntity<Course> createCourse(@RequestBody Course course) {
    Course createdCourse = adminService.createCourse(course);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
  }

  @PutMapping("/courses/{id}")
  public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
    Course updatedCourse = adminService.updateCourse(id, course);
    return ResponseEntity.ok(updatedCourse);
  }

  @DeleteMapping("/courses/{id}")
  public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
    adminService.deleteCourse(id);
    return ResponseEntity.noContent().build();
  }

  // Bulk Operations
  @PostMapping("/students/bulk-import")
  public ResponseEntity<Map<String, Object>> bulkImportStudents(@RequestBody List<Student> students) {
    Map<String, Object> result = adminService.bulkImportStudents(students);
    return ResponseEntity.ok(result);
  }

  @PostMapping("/professors/bulk-import")
  public ResponseEntity<Map<String, Object>> bulkImportProfessors(@RequestBody List<Professor> professors) {
    Map<String, Object> result = adminService.bulkImportProfessors(professors);
    return ResponseEntity.ok(result);
  }

  // System Health Check
  @GetMapping("/health")
  public ResponseEntity<Map<String, Object>> healthCheck() {
    Map<String, Object> health = adminService.getSystemHealth();
    return ResponseEntity.ok(health);
  }
}
