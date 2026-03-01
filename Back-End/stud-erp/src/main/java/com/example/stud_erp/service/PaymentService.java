package com.example.stud_erp.service;

import com.example.stud_erp.entity.Payment;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.exception.ResourceNotFoundException;
import com.example.stud_erp.repository.PaymentRepository;
import com.example.stud_erp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

  @Autowired
  private PaymentRepository paymentRepository;

  @Autowired
  private StudentRepository studentRepository;

  // Fee structure per semester
  private static final BigDecimal COURSE_FEE_PER_SEMESTER = new BigDecimal("54000");
  private static final BigDecimal HOSTEL_FEE_PER_SEMESTER = new BigDecimal("45000");

  private static final Map<String, BigDecimal> DAY_SCHOLAR_FEE = new HashMap<>();
  private static final Map<String, BigDecimal> HOSTELLER_FEE = new HashMap<>();

  static {
    // Day Scholar Fee (Course fee only) - ₹54,000 per semester
    for (int i = 1; i <= 8; i++) {
      DAY_SCHOLAR_FEE.put(String.valueOf(i), COURSE_FEE_PER_SEMESTER);
    }

    // Hosteller Fee (Course fee + Hostel fee) - ₹99,000 per semester
    BigDecimal hostellerTotal = COURSE_FEE_PER_SEMESTER.add(HOSTEL_FEE_PER_SEMESTER);
    for (int i = 1; i <= 8; i++) {
      HOSTELLER_FEE.put(String.valueOf(i), hostellerTotal);
    }
  }

  // Create a new payment
  @Transactional
  public Payment createPayment(Payment payment) {
    // Fetch student details
    Student student = studentRepository.findById(payment.getStudentId())
        .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + payment.getStudentId()));

    // Set student details in payment
    payment.setStudentName(student.getStudName());
    payment.setStudentRollNo(String.valueOf(student.getStudRollNo()));
    payment.setDepartment(student.getMajor());

    // Generate unique transaction ID
    if (payment.getTransactionId() == null || payment.getTransactionId().isEmpty()) {
      payment.setTransactionId(generateTransactionId());
    }

    // Generate receipt number if payment is completed
    if (payment.getStatus() == Payment.PaymentStatus.COMPLETED &&
        (payment.getReceiptNumber() == null || payment.getReceiptNumber().isEmpty())) {
      payment.setReceiptNumber(generateReceiptNumber());
    }

    // Set payment date if not provided
    if (payment.getPaymentDate() == null) {
      payment.setPaymentDate(LocalDateTime.now());
    }

    return paymentRepository.save(payment);
  }

  // Initialize pending payments for a student for a semester
  @Transactional
  public Payment initializeSemesterFee(Long studentId, String semester, String academicYear, String residentialType) {
    // Find student by their database ID
    Student student = studentRepository.findById(studentId)
        .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

    // Check if payment already exists
    if (paymentRepository.existsByStudentIdAndSemesterAndAcademicYear(studentId, semester, academicYear)) {
      throw new IllegalStateException("Payment already initialized for this semester");
    }

    // Determine fee based on residential type
    BigDecimal feeAmount;
    String feeDescription;
    if ("HOSTELLER".equalsIgnoreCase(residentialType)) {
      feeAmount = HOSTELLER_FEE.getOrDefault(semester, new BigDecimal("99000"));
      feeDescription = "Semester " + semester + " Fee (Hosteller - Course + Hostel) for " + academicYear;
    } else {
      feeAmount = DAY_SCHOLAR_FEE.getOrDefault(semester, new BigDecimal("54000"));
      feeDescription = "Semester " + semester + " Fee (Day Scholar) for " + academicYear;
    }

    Payment payment = new Payment();
    payment.setStudentId(studentId);
    payment.setStudentName(student.getStudName());
    payment.setStudentRollNo(String.valueOf(student.getStudRollNo()));
    payment.setDepartment(student.getMajor());
    payment.setSemester(semester);
    payment.setAcademicYear(academicYear);
    payment.setPaymentType(Payment.PaymentType.SEMESTER_FEE);
    payment.setStatus(Payment.PaymentStatus.PENDING);
    payment.setAmount(feeAmount);
    payment.setDescription(feeDescription);
    payment.setDueDate(calculateDueDate(semester));
    payment.setPaymentDate(LocalDateTime.now());

    return paymentRepository.save(payment);
  }

  // Process a payment (mark as completed)
  @Transactional
  public Payment processPayment(Long paymentId, String paymentMethod, String remarks) {
    Payment payment = paymentRepository.findById(paymentId)
        .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

    if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
      throw new IllegalStateException("Payment already completed");
    }

    payment.setStatus(Payment.PaymentStatus.COMPLETED);
    payment.setPaymentMethod(paymentMethod);
    payment.setPaymentDate(LocalDateTime.now());
    payment.setRemarks(remarks);
    payment.setReceiptNumber(generateReceiptNumber());

    return paymentRepository.save(payment);
  }

  // Get all payments by student ID
  public List<Payment> getPaymentsByStudentId(Long studentId) {
    return paymentRepository.findByStudentIdOrderByPaymentDateDesc(studentId);
  }

  // Get pending payments by student ID
  public List<Payment> getPendingPayments(Long studentId) {
    return paymentRepository.findPendingPaymentsByStudentId(studentId);
  }

  // Get completed payments (payment history)
  public List<Payment> getPaymentHistory(Long studentId) {
    return paymentRepository.findCompletedPaymentsByStudentId(studentId);
  }

  // Get payment by ID
  public Payment getPaymentById(Long paymentId) {
    return paymentRepository.findById(paymentId)
        .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
  }

  // Get payment by transaction ID
  public Payment getPaymentByTransactionId(String transactionId) {
    return paymentRepository.findByTransactionId(transactionId)
        .orElseThrow(() -> new ResourceNotFoundException("Payment not found with transaction ID: " + transactionId));
  }

  // Get payment summary for a student
  public Map<String, Object> getPaymentSummary(Long studentId) {
    Map<String, Object> summary = new HashMap<>();

    Double totalPaid = paymentRepository.getTotalAmountPaidByStudent(studentId);
    Double totalPending = paymentRepository.getTotalPendingAmountByStudent(studentId);

    List<Payment> pendingPayments = getPendingPayments(studentId);
    List<Payment> completedPayments = getPaymentHistory(studentId);

    summary.put("totalPaid", totalPaid != null ? totalPaid : 0.0);
    summary.put("totalPending", totalPending != null ? totalPending : 0.0);
    summary.put("pendingPaymentsCount", pendingPayments.size());
    summary.put("completedPaymentsCount", completedPayments.size());
    summary.put("pendingPayments", pendingPayments);
    summary.put("recentPayments", completedPayments.stream().limit(5).toList());

    return summary;
  }

  // Get fee structure
  public Map<String, Object> getFeeStructure() {
    Map<String, Object> feeStructure = new HashMap<>();
    feeStructure.put("dayScholar", new HashMap<>(DAY_SCHOLAR_FEE));
    feeStructure.put("hosteller", new HashMap<>(HOSTELLER_FEE));
    feeStructure.put("courseFee", COURSE_FEE_PER_SEMESTER);
    feeStructure.put("hostelFee", HOSTEL_FEE_PER_SEMESTER);
    return feeStructure;
  }

  // Delete payment (admin only)
  @Transactional
  public void deletePayment(Long paymentId) {
    Payment payment = getPaymentById(paymentId);
    paymentRepository.delete(payment);
  }

  // Helper method to generate transaction ID
  private String generateTransactionId() {
    return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
  }

  // Helper method to generate receipt number
  private String generateReceiptNumber() {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
    String date = LocalDateTime.now().format(formatter);
    String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    return "RCP" + date + random;
  }

  // Helper method to calculate due date based on semester
  private LocalDateTime calculateDueDate(String semester) {
    LocalDateTime now = LocalDateTime.now();
    int semesterNum = Integer.parseInt(semester);

    // Odd semesters (1,3,5,7) - due date is August 31st
    // Even semesters (2,4,6,8) - due date is January 31st
    if (semesterNum % 2 == 1) {
      return LocalDateTime.of(now.getYear(), 8, 31, 23, 59);
    } else {
      return LocalDateTime.of(now.getYear(), 1, 31, 23, 59);
    }
  }
}
