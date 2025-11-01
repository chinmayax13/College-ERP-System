package com.example.stud_erp.controller;

import com.example.stud_erp.entity.Attendance;
import com.example.stud_erp.entity.ClassSession;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.service.AttendanceService;
import com.example.stud_erp.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private StudentService studentService;

    @PostMapping("/save")
    public ResponseEntity<?> saveAttendance(@RequestBody Map<String, Object> request) {
        try {
            String professorName = (String) request.get("professorName");
            String subject = (String) request.get("subject");
            LocalDate attendanceDate = LocalDate.parse((String) request.get("attendanceDate"));
            String timeStr = (String) request.get("time");
            LocalTime time = LocalTime.parse(timeStr);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> attendanceList = (List<Map<String, Object>>) request.get("attendanceList");

            if (attendanceList == null || attendanceList.isEmpty()) {
                return ResponseEntity.badRequest().body("Attendance list is required.");
            }

            ClassSession savedSession = attendanceService.saveAttendanceWithList(professorName, subject, attendanceDate,
                    time, attendanceList);
            return ResponseEntity.ok(savedSession);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving attendance: " + e.getMessage());
        }
    }

    @GetMapping("/lecturer/subject")
    public ResponseEntity<Map<LocalDate, List<Attendance>>> getAttendance(
            @RequestParam String lecturer,
            @RequestParam String subject) {
        Map<LocalDate, List<Attendance>> records = attendanceService.getAttendanceByLecturerAndSubject(lecturer,
                subject);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/students/department/{departmentName}")
    public ResponseEntity<List<Student>> getStudentsByDepartment(@PathVariable String departmentName) {
        try {
            System.out.println("🔍 Searching for students in department: '" + departmentName + "'");
            List<Student> students = studentService.getStudentsByDepartment(departmentName);
            System.out.println("📊 Found " + students.size() + " students");
            if (students.size() > 0) {
                System.out.println("👥 First student: " + students.get(0).getStudName());
            }
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            System.err.println("❌ Error fetching students: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/professor/{professorId}/attendance-history")
    public ResponseEntity<List<ClassSession>> getProfessorAttendanceHistory(@PathVariable Long professorId) {
        try {
            List<ClassSession> sessions = attendanceService.getAttendanceHistoryByProfessor(professorId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable Integer studentId) {
        try {
            List<Attendance> attendanceRecords = attendanceService.getStudentAttendance(studentId);
            return ResponseEntity.ok(attendanceRecords);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<Map<String, Object>> getStudentAttendanceSummary(@PathVariable Integer studentId) {
        try {
            Map<String, Object> summary = attendanceService.getStudentAttendanceSummary(studentId);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/student/{studentId}/semester/{semester}")
    public ResponseEntity<List<Attendance>> getStudentAttendanceBySemester(
            @PathVariable Integer studentId,
            @PathVariable String semester) {
        try {
            List<Attendance> attendanceRecords = attendanceService.getStudentAttendanceBySemester(studentId, semester);
            return ResponseEntity.ok(attendanceRecords);
        } catch (Exception e) {
            System.err.println("❌ Error fetching student attendance for semester: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/student/{studentId}/semester/{semester}/summary")
    public ResponseEntity<Map<String, Object>> getStudentAttendanceSummaryBySemester(
            @PathVariable Integer studentId,
            @PathVariable String semester) {
        try {
            Map<String, Object> summary = attendanceService.getStudentAttendanceSummaryBySemester(studentId, semester);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/student/{studentId}/available-semesters")
    public ResponseEntity<Map<String, Object>> getAvailableSemesters(@PathVariable Integer studentId) {
        try {
            Map<String, Object> availableSemesters = attendanceService.getAvailableSemestersForStudent(studentId);
            return ResponseEntity.ok(availableSemesters);
        } catch (Exception e) {
            System.err.println("❌ Error fetching available semesters: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/subjects/all")
    public ResponseEntity<Map<String, Object>> getAllSubjectsBySemester() {
        try {
            Map<String, Object> allSubjects = attendanceService.getAllSubjectsBySemester();
            return ResponseEntity.ok(allSubjects);
        } catch (Exception e) {
            System.err.println("❌ Error fetching subjects: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/subjects/semester/{semester}")
    public ResponseEntity<List<String>> getSubjectsBySemester(@PathVariable String semester) {
        try {
            List<String> subjects = attendanceService.getSubjectsBySemester(semester);
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            System.err.println("❌ Error fetching subjects for semester: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testProfessorStudentConnection(
            @RequestBody Map<String, Object> request) {
        try {
            // This endpoint simulates professor taking attendance and immediately shows
            // student view
            String professorName = (String) request.get("professorName");
            String subject = (String) request.get("subject");
            LocalDate attendanceDate = LocalDate.parse((String) request.get("attendanceDate"));
            String timeStr = (String) request.get("time");
            LocalTime time = LocalTime.parse(timeStr);
            Integer testStudentId = (Integer) request.get("testStudentId");
            String testSemester = (String) request.get("testSemester");

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> attendanceList = (List<Map<String, Object>>) request.get("attendanceList");

            // 1. Professor takes attendance
            ClassSession savedSession = attendanceService.saveAttendanceWithList(professorName, subject, attendanceDate,
                    time, attendanceList);

            // 2. Immediately fetch student's updated attendance for that semester
            List<Attendance> studentAttendance = attendanceService.getStudentAttendanceBySemester(testStudentId,
                    testSemester);

            // 3. Return both results to demonstrate the connection
            Map<String, Object> result = new java.util.HashMap<>();
            result.put("professorAction", "Attendance saved for " + subject + " on " + attendanceDate);
            result.put("savedSession", savedSession);
            result.put("studentUpdatedAttendance", studentAttendance);
            result.put("connectionStatus",
                    "✅ Real-time connection working - Professor attendance immediately reflected in student view");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new java.util.HashMap<>();
            error.put("error", "Connection test failed: " + e.getMessage());
            error.put("connectionStatus", "❌ Connection broken");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
