package com.example.stud_erp.config;

import com.example.stud_erp.entity.*;
import com.example.stud_erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private ClassRepository classSessionRepository;

  @Autowired
  private AttendanceRepository attendanceRepository;

  private final Random random = new Random();

  @Override
  public void run(String... args) throws Exception {
    // Only initialize if there's no attendance data already
    if (attendanceRepository.count() == 0) {
      System.out.println("🚀 Initializing sample attendance data...");
      initializeSampleAttendanceData();
      System.out.println("✅ Sample attendance data initialized successfully!");
    } else {
      System.out.println("📊 Attendance data already exists, skipping initialization.");
    }
  }

  private void initializeSampleAttendanceData() {
    // Get all students
    List<Student> students = studentRepository.findAll();

    if (students.isEmpty()) {
      System.out.println("⚠️ No students found, cannot initialize attendance data");
      return;
    }

    // Create sample attendance for each semester
    for (int semester = 1; semester <= 7; semester++) {
      List<String> subjects = getSemesterSubjects(String.valueOf(semester));

      for (String subject : subjects) {
        createAttendanceForSubject(subject, students, semester);
      }
    }
  }

  private void createAttendanceForSubject(String subject, List<Student> students, int semester) {
    // Create multiple class sessions for this subject over the past months
    int numberOfSessions = 15 + random.nextInt(20); // 15-35 sessions per subject

    for (int session = 0; session < numberOfSessions; session++) {
      // Create class session
      ClassSession classSession = new ClassSession();
      classSession.setLecturer("Prof. " + getRandomProfessorName());
      classSession.setSubject(subject);
      classSession.setTime(LocalTime.of(9 + random.nextInt(6), random.nextInt(60))); // Random time between 9-14:xx

      // Save class session first
      classSession = classSessionRepository.save(classSession);

      // Create attendance records for each student
      List<Attendance> attendanceList = new ArrayList<>();
      LocalDate sessionDate = LocalDate.now().minusDays(session * 2 + random.nextInt(5));

      for (Student student : students) {
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setStudentName(student.getStudName());
        attendance.setClassSession(classSession);
        attendance.setAttendanceDate(sessionDate);

        // Random attendance - 80% chance of being present
        attendance.setStatus(random.nextDouble() < 0.8 ? "P" : "A");

        attendanceList.add(attendance);
      }

      // Save all attendance records
      attendanceRepository.saveAll(attendanceList);
      classSession.setAttendance(attendanceList);
      classSessionRepository.save(classSession);
    }
  }

  private List<String> getSemesterSubjects(String semester) {
    switch (semester) {
      case "1":
        return List.of("Mathematics I", "Physics I", "English Communication",
            "Basic Electrical Engineering", "Basic Mechanical Engineering");
      case "2":
        return List.of("Mathematics II", "Programming Fundamentals C", "Basic Civil Engineering",
            "Engineering Mechanics", "Chemistry", "Basic Electronics Engineering");
      case "3":
        return List.of("Object Oriented Programming using JAVA", "Mathematics-III", "Data Structures",
            "Digital Logic Design", "Environmental Science", "Engineering Economics");
      case "4":
        return List.of("Computer Organization and Architecture", "Design and Analysis of Algorithms",
            "Data Communication", "Digital Signal Processing", "Organizational Behavior", "Discrete Mathematics");
      case "5":
        return List.of("Operating Systems", "Computer Networks", "Database Management Systems",
            "Theory of Computation", "Computer Graphics", "Advanced Java Programming");
      case "6":
        return List.of("Analog and Digital Communication", "Internet and Web Technologies",
            "Optimization in Engineering", "Software Engineering", "Wireless Sensor Networks",
            "PPT(Aptitude & Resoning)");
      case "7":
        return List.of("Cyber Law and Ethics", "Internet of Things", "Embedded System",
            "Entrepreneurship Development", "E-Commerce and ERP", "Green Technology");
      default:
        return List.of();
    }
  }

  private String getRandomProfessorName() {
    String[] names = {
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
        "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White"
    };
    return names[random.nextInt(names.length)];
  }
}