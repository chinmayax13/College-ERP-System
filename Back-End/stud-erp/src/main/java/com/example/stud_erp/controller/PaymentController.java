package com.example.stud_erp.controller;

import com.example.stud_erp.entity.Payment;
import com.example.stud_erp.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

  @Autowired
  private PaymentService paymentService;

  // Create a new payment
  @PostMapping("/create")
  public ResponseEntity<?> createPayment(@RequestBody Payment payment) {
    try {
      Payment createdPayment = paymentService.createPayment(payment);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating payment: " + e.getMessage());
    }
  }

  // Initialize semester fee for a student
  @PostMapping("/initialize-semester-fee")
  public ResponseEntity<?> initializeSemesterFee(
      @RequestParam Long studentId,
      @RequestParam String semester,
      @RequestParam String academicYear,
      @RequestParam(defaultValue = "DAY_SCHOLAR") String residentialType) {
    try {
      Payment payment = paymentService.initializeSemesterFee(studentId, semester, academicYear, residentialType);
      return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error initializing fee: " + e.getMessage());
    }
  }

  // Process a payment (mark as completed)
  @PutMapping("/process/{paymentId}")
  public ResponseEntity<?> processPayment(
      @PathVariable Long paymentId,
      @RequestParam String paymentMethod,
      @RequestParam(required = false) String remarks) {
    try {
      Payment processedPayment = paymentService.processPayment(paymentId, paymentMethod, remarks);
      return ResponseEntity.ok(processedPayment);
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing payment: " + e.getMessage());
    }
  }

  // Get all payments for a student
  @GetMapping("/student/{studentId}")
  public ResponseEntity<?> getPaymentsByStudentId(@PathVariable Long studentId) {
    try {
      List<Payment> payments = paymentService.getPaymentsByStudentId(studentId);
      return ResponseEntity.ok(payments);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching payments: " + e.getMessage());
    }
  }

  // Get pending payments for a student
  @GetMapping("/student/{studentId}/pending")
  public ResponseEntity<?> getPendingPayments(@PathVariable Long studentId) {
    try {
      List<Payment> pendingPayments = paymentService.getPendingPayments(studentId);
      return ResponseEntity.ok(pendingPayments);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error fetching pending payments: " + e.getMessage());
    }
  }

  // Get payment history (completed payments) for a student
  @GetMapping("/student/{studentId}/history")
  public ResponseEntity<?> getPaymentHistory(@PathVariable Long studentId) {
    try {
      List<Payment> paymentHistory = paymentService.getPaymentHistory(studentId);
      return ResponseEntity.ok(paymentHistory);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error fetching payment history: " + e.getMessage());
    }
  }

  // Get payment summary for a student
  @GetMapping("/student/{studentId}/summary")
  public ResponseEntity<?> getPaymentSummary(@PathVariable Long studentId) {
    try {
      Map<String, Object> summary = paymentService.getPaymentSummary(studentId);
      return ResponseEntity.ok(summary);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error fetching payment summary: " + e.getMessage());
    }
  }

  // Get payment by ID
  @GetMapping("/{paymentId}")
  public ResponseEntity<?> getPaymentById(@PathVariable Long paymentId) {
    try {
      Payment payment = paymentService.getPaymentById(paymentId);
      return ResponseEntity.ok(payment);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found: " + e.getMessage());
    }
  }

  // Get payment by transaction ID
  @GetMapping("/transaction/{transactionId}")
  public ResponseEntity<?> getPaymentByTransactionId(@PathVariable String transactionId) {
    try {
      Payment payment = paymentService.getPaymentByTransactionId(transactionId);
      return ResponseEntity.ok(payment);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found: " + e.getMessage());
    }
  }

  // Get fee structure
  @GetMapping("/fee-structure")
  public ResponseEntity<?> getFeeStructure() {
    try {
      Map<String, Object> feeStructure = paymentService.getFeeStructure();
      return ResponseEntity.ok(feeStructure);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error fetching fee structure: " + e.getMessage());
    }
  }

  // Delete payment (admin only)
  @DeleteMapping("/{paymentId}")
  public ResponseEntity<?> deletePayment(@PathVariable Long paymentId) {
    try {
      paymentService.deletePayment(paymentId);
      return ResponseEntity.ok("Payment deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting payment: " + e.getMessage());
    }
  }
}
