package com.example.stud_erp.service;

import com.example.stud_erp.entity.Attendance;
import com.example.stud_erp.entity.ClassSession;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.repository.AttendanceRepository;
import com.example.stud_erp.repository.ClassRepository;
import com.example.stud_erp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private ClassRepository classSessionRepository;

    @Autowired
    private AttendanceRepository attendanceRecordRepository;

    @Autowired
    private StudentRepository studentRepository;

    public ClassSession saveAttendance(String lecturer, String subject, LocalDate attendanceDate, LocalTime time,
            Map<String, String> students) {
        ClassSession classSession = new ClassSession();
        classSession.setLecturer(lecturer);
        classSession.setSubject(subject);
        classSession.setTime(time);

        List<Attendance> attendanceRecords = new ArrayList<>();

        for (Map.Entry<String, String> entry : students.entrySet()) {
            Attendance record = new Attendance();
            record.setStudentName(entry.getKey());
            record.setStatus(entry.getValue());
            record.setAttendanceDate(attendanceDate);
            record.setClassSession(classSession);

            // Find the student by name or another unique identifier
            Student student = studentRepository.findByStudName(entry.getKey());
            if (student != null) {
                record.setStudent(student); // Set the Student entity in the Attendance
            } else {
                throw new IllegalArgumentException("Student not found: " + entry.getKey());
            }

            attendanceRecords.add(record);
        }

        classSession.setAttendance(attendanceRecords);

        return classSessionRepository.save(classSession);
    }

    public ClassSession saveAttendanceWithList(String professorName, String subject, LocalDate attendanceDate,
            LocalTime time, List<Map<String, Object>> attendanceList) {
        ClassSession classSession = new ClassSession();
        classSession.setLecturer(professorName);
        classSession.setSubject(subject);
        classSession.setTime(time);

        List<Attendance> attendanceRecords = new ArrayList<>();

        for (Map<String, Object> attendanceRecord : attendanceList) {
            String studentName = (String) attendanceRecord.get("studentName");
            String status = (String) attendanceRecord.get("status");
            Long studentId = null;

            // Handle studentId which might be Integer or Long
            Object studentIdObj = attendanceRecord.get("studentId");
            if (studentIdObj instanceof Integer) {
                studentId = ((Integer) studentIdObj).longValue();
            } else if (studentIdObj instanceof Long) {
                studentId = (Long) studentIdObj;
            }

            Attendance record = new Attendance();
            record.setStudentName(studentName);
            record.setStatus(status);
            record.setAttendanceDate(attendanceDate);
            record.setClassSession(classSession);

            // Find the student by ID or name
            Student student = null;
            if (studentId != null) {
                student = studentRepository.findById(studentId).orElse(null);
            }
            if (student == null) {
                student = studentRepository.findByStudName(studentName);
            }

            if (student != null) {
                record.setStudent(student);
            } else {
                throw new IllegalArgumentException("Student not found: " + studentName + " (ID: " + studentId + ")");
            }

            attendanceRecords.add(record);
        }

        classSession.setAttendance(attendanceRecords);
        return classSessionRepository.save(classSession);
    }

    public Map<LocalDate, List<Attendance>> getAttendanceByLecturerAndSubject(String lecturer, String subject) {
        List<Attendance> records = attendanceRecordRepository.findByClassSessionLecturerAndClassSessionSubject(lecturer,
                subject);

        return records.stream().collect(Collectors.groupingBy(Attendance::getAttendanceDate));
    }

    public List<ClassSession> getAttendanceHistoryByProfessor(Long professorId) {
        // For now, we'll get by lecturer name since we don't have professor ID in
        // ClassSession
        // This would need to be improved with proper professor entity relationship
        return classSessionRepository.findAll();
    }

    public List<ClassSession> getAttendanceHistoryByLecturerName(String lecturerName) {
        return classSessionRepository.findByLecturer(lecturerName);
    }

    public List<Attendance> getStudentAttendance(Integer studentId) {
        Student student = studentRepository.findById(studentId.longValue()).orElse(null);
        if (student == null) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        return attendanceRecordRepository.findByStudent(student);
    }

    public Map<String, Object> getStudentAttendanceSummary(Integer studentId) {
        List<Attendance> attendanceRecords = getStudentAttendance(studentId);

        // Group by subject and calculate statistics
        Map<String, Map<String, Object>> subjectStats = attendanceRecords.stream()
                .collect(Collectors.groupingBy(
                        record -> record.getClassSession().getSubject(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    Map<String, Object> stats = new java.util.HashMap<>();
                                    long totalClasses = list.size();
                                    long presentClasses = list.stream()
                                            .mapToLong(record -> "P".equals(record.getStatus()) ? 1 : 0).sum();
                                    double percentage = totalClasses > 0 ? (double) presentClasses / totalClasses * 100
                                            : 0;

                                    stats.put("subjectName", list.get(0).getClassSession().getSubject());
                                    stats.put("totalClasses", totalClasses);
                                    stats.put("presentClasses", presentClasses);
                                    stats.put("absentClasses", totalClasses - presentClasses);
                                    stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
                                    return stats;
                                })));

        // Calculate overall statistics
        long totalClasses = attendanceRecords.size();
        long totalPresent = attendanceRecords.stream().mapToLong(record -> "P".equals(record.getStatus()) ? 1 : 0)
                .sum();
        double overallPercentage = totalClasses > 0 ? (double) totalPresent / totalClasses * 100 : 0;

        Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("subjects", subjectStats);
        summary.put("overall", Map.of(
                "totalClasses", totalClasses,
                "presentClasses", totalPresent,
                "absentClasses", totalClasses - totalPresent,
                "percentage", Math.round(overallPercentage * 100.0) / 100.0));

        return summary;
    }

    public List<Attendance> getStudentAttendanceBySemester(Integer studentId, String semesterName) {

        Student student = studentRepository.findById(studentId.longValue()).orElse(null);
        if (student == null) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }

        // Get attendance records and filter by semester-specific subjects
        List<Attendance> allAttendance = attendanceRecordRepository.findByStudent(student);

        System.out.println("   � Total attendance records for student " + studentId + ": " + allAttendance.size());

        // Print details of all attendance records
        for (Attendance att : allAttendance) {
            System.out.println("     - Subject: " + att.getClassSession().getSubject() +
                    ", Date: " + att.getAttendanceDate() +
                    ", Status: " + att.getStatus());
        }

        // Get subjects for the specified semester
        List<String> semesterSubjects = getSemesterSubjects(semesterName);

        System.out.println("📚 Expected subjects for semester " + semesterName + ": " + semesterSubjects);

        // Filter attendance records for subjects in this semester with flexible
        // matching
        List<Attendance> filteredAttendance = allAttendance.stream()
                .filter(attendance -> {
                    String attendanceSubject = attendance.getClassSession().getSubject();
                    boolean matches = semesterSubjects.contains(attendanceSubject) ||
                            semesterSubjects.stream().anyMatch(subject -> normalizeSubjectName(subject)
                                    .equals(normalizeSubjectName(attendanceSubject)));

                    if (matches) {
                        System.out.println("✅ Matched subject: " + attendanceSubject);
                    }
                    return matches;
                })
                .collect(Collectors.toList());

        System.out.println(
                "📊 Filtered attendance records for semester " + semesterName + ": " + filteredAttendance.size());

        return filteredAttendance;
    }

    public Map<String, Object> getStudentAttendanceSummaryBySemester(Integer studentId, String semesterName) {
        List<Attendance> attendanceRecords = getStudentAttendanceBySemester(studentId, semesterName);

        // Group by subject and calculate statistics
        Map<String, Map<String, Object>> subjectStats = attendanceRecords.stream()
                .collect(Collectors.groupingBy(
                        record -> record.getClassSession().getSubject(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    Map<String, Object> stats = new java.util.HashMap<>();
                                    long totalClasses = list.size();
                                    long presentClasses = list.stream()
                                            .mapToLong(record -> "P".equals(record.getStatus()) ? 1 : 0).sum();
                                    double percentage = totalClasses > 0 ? (double) presentClasses / totalClasses * 100
                                            : 0;

                                    stats.put("subjectName", list.get(0).getClassSession().getSubject());
                                    stats.put("subjectCode",
                                            getSubjectCode(list.get(0).getClassSession().getSubject()));
                                    stats.put("totalClasses", totalClasses);
                                    stats.put("presentClasses", presentClasses);
                                    stats.put("absentClasses", totalClasses - presentClasses);
                                    stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
                                    return stats;
                                })));

        // Calculate overall statistics
        long totalClasses = attendanceRecords.size();
        long totalPresent = attendanceRecords.stream().mapToLong(record -> "P".equals(record.getStatus()) ? 1 : 0)
                .sum();
        double overallPercentage = totalClasses > 0 ? (double) totalPresent / totalClasses * 100 : 0;

        Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("subjects", subjectStats);
        summary.put("semester", semesterName);
        summary.put("overall", Map.of(
                "totalClasses", totalClasses,
                "presentClasses", totalPresent,
                "absentClasses", totalClasses - totalPresent,
                "percentage", Math.round(overallPercentage * 100.0) / 100.0));

        return summary;
    }

    private List<String> getSemesterSubjects(String semester) {
        // Map semester numbers to subject names based on your curriculum
        Map<String, List<String>> semesterSubjectMap = Map.of(
                "1",
                List.of("Mathematics I", "Physics I", "English Communication", "Basic Electrical Engineering",
                        "Basic Mechanical Engineering"),
                "2",
                List.of("Mathematics II", "Programming Fundamentals C", "Basic Civil Engineering",
                        "Engineering Mechanics", "Chemistry", "Basic Electronics Engineering"),
                "3",
                List.of("Object Oriented Programming using JAVA", "Mathematics-III", "Data Structures",
                        "Digital Logic Design", "Environmental Science", "Engineering Economics"),
                "4",
                List.of("Computer Organization and Architecture", "Design and Analysis of Algorithms",
                        "Data Communication", "Digital Signal Processing", "Organizational Behavior",
                        "Discrete Mathematics"),
                "5",
                List.of("Operating Systems", "Computer Networks", "Database Management Systems",
                        "Theory of Computation", "Computer Graphics", "Advanced Java Programming"),
                "6",
                List.of("Analog and Digital Communication", "Internet and Web Technologies",
                        "Optimization in Engineering", "Software Engineering", "Wireless Sensor Networks",
                        "PPT(Aptitude & Resoning)"),
                "7", List.of("Cyber Law and Ethics", "Internet of Things", "Embedded System",
                        "Entrepreneurship Development", "E-Commerce and ERP", "Green Technology"));

        return semesterSubjectMap.getOrDefault(semester, new ArrayList<>());
    }

    private String getSubjectCode(String subjectName) {
        // Map subject names to codes based on your curriculum
        Map<String, String> subjectCodeMap = Map.of(
                "Mathematics I", "MA101",
                "Physics I", "PH101",
                "English Communication", "EN101",
                "Basic Electrical Engineering", "BEE101",
                "Basic Mechanical Engineering", "BME101",
                "Mathematics II", "MA102",
                "Programming Fundamentals C", "CS101",
                "Basic Civil Engineering", "BCE102",
                "Engineering Mechanics", "EM102",
                "Chemistry", "CH102");

        // Add more mappings for other semesters...
        Map<String, String> additionalCodes = Map.of(
                "Basic Electronics Engineering", "BE102",
                "Object Oriented Programming using JAVA", "CS201",
                "Mathematics-III", "MA201",
                "Data Structures", "CS202",
                "Digital Logic Design", "DLD201",
                "Environmental Science", "ES202",
                "Engineering Economics", "EC202",
                "Computer Organization and Architecture", "COA202",
                "Design and Analysis of Algorithms", "DAA203",
                "Data Communication", "DC204");

        String code = subjectCodeMap.get(subjectName);
        if (code == null) {
            code = additionalCodes.get(subjectName);
        }

        // Generate a default code if not found
        if (code == null) {
            String[] words = subjectName.split(" ");
            code = words.length > 0 ? words[0].substring(0, Math.min(3, words[0].length())).toUpperCase() + "101"
                    : "SUB101";
        }

        return code;
    }

    public Map<String, Object> getAvailableSemestersForStudent(Integer studentId) {
        Student student = studentRepository.findById(studentId.longValue()).orElse(null);
        if (student == null) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }

        int studentYear = student.getYear();
        List<Map<String, String>> availableSemesters = new ArrayList<>();

        // Determine max semester based on year
        // Year 1: semesters 1-2, Year 2: semesters 1-4, Year 3: semesters 1-6, Year 4:
        // semesters 1-7
        int maxSemester = studentYear * 2;

        // Create semester data
        Map<String, String> semesterNames = Map.of(
                "1", "1st Semester",
                "2", "2nd Semester",
                "3", "3rd Semester",
                "4", "4th Semester",
                "5", "5th Semester",
                "6", "6th Semester",
                "7", "7th Semester");

        for (int sem = 1; sem <= maxSemester && sem <= 7; sem++) {
            Map<String, String> semesterInfo = new java.util.HashMap<>();
            semesterInfo.put("key", String.valueOf(sem));
            semesterInfo.put("name", semesterNames.get(String.valueOf(sem)));
            availableSemesters.add(semesterInfo);
        }

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("studentYear", studentYear);
        result.put("maxSemester", maxSemester);
        result.put("availableSemesters", availableSemesters);

        return result;
    }

    private String normalizeSubjectName(String subjectName) {
        if (subjectName == null)
            return "";

        // Normalize subject names for flexible matching
        return subjectName.toLowerCase()
                .replaceAll("[^a-z0-9]", "") // Remove special characters and spaces
                .trim();
    }

    public Map<String, Object> getAllSubjectsBySemester() {
        Map<String, Object> allSubjects = new java.util.HashMap<>();

        // Get all semester subject mappings
        for (int semester = 1; semester <= 7; semester++) {
            String semesterKey = String.valueOf(semester);
            List<String> subjects = getSemesterSubjects(semesterKey);

            Map<String, Object> semesterInfo = new java.util.HashMap<>();
            semesterInfo.put("semesterName", semester + getOrdinalSuffix(semester) + " Semester");
            semesterInfo.put("subjects", subjects);

            allSubjects.put(semesterKey, semesterInfo);
        }

        return allSubjects;
    }

    public List<String> getSubjectsBySemester(String semester) {
        return getSemesterSubjects(semester);
    }

    private String getOrdinalSuffix(int number) {
        if (number >= 11 && number <= 13) {
            return "th";
        }
        switch (number % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }

}
