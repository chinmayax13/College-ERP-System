package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

  // Find all payments by student ID
  List<Payment> findByStudentIdOrderByPaymentDateDesc(Long studentId);

  // Find payments by student ID and status
  List<Payment> findByStudentIdAndStatus(Long studentId, Payment.PaymentStatus status);

  // Find payments by student ID and semester
  List<Payment> findByStudentIdAndSemester(Long studentId, String semester);

  // Find payments by student ID and academic year
  List<Payment> findByStudentIdAndAcademicYear(Long studentId, String academicYear);

  // Find payment by transaction ID
  Optional<Payment> findByTransactionId(String transactionId);

  // Find payment by receipt number
  Optional<Payment> findByReceiptNumber(String receiptNumber);

  // Find pending payments by student ID
  @Query("SELECT p FROM Payment p WHERE p.studentId = :studentId AND p.status = 'PENDING' ORDER BY p.dueDate ASC")
  List<Payment> findPendingPaymentsByStudentId(@Param("studentId") Long studentId);

  // Find completed payments by student ID
  @Query("SELECT p FROM Payment p WHERE p.studentId = :studentId AND p.status = 'COMPLETED' ORDER BY p.paymentDate DESC")
  List<Payment> findCompletedPaymentsByStudentId(@Param("studentId") Long studentId);

  // Calculate total amount paid by student
  @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.studentId = :studentId AND p.status = 'COMPLETED'")
  Double getTotalAmountPaidByStudent(@Param("studentId") Long studentId);

  // Calculate total pending amount by student
  @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.studentId = :studentId AND p.status = 'PENDING'")
  Double getTotalPendingAmountByStudent(@Param("studentId") Long studentId);

  // Find all payments by department
  List<Payment> findByDepartment(String department);

  // Check if payment exists for student, semester and academic year
  boolean existsByStudentIdAndSemesterAndAcademicYear(Long studentId, String semester, String academicYear);
}
