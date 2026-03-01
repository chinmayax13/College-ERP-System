package com.example.stud_erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long studentId;

  @Column(nullable = false)
  private String studentName;

  @Column(nullable = false)
  private String studentRollNo;

  @Column(nullable = false)
  private String department;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal amount;

  @Column(nullable = false)
  private String semester; // e.g., "1", "2", "3"... "8"

  @Column(nullable = false)
  private String academicYear; // e.g., "2024-2025"

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentType paymentType; // SEMESTER_FEE, ANNUAL_FEE, EXAM_FEE, OTHER

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentStatus status; // PENDING, COMPLETED, FAILED, REFUNDED

  @Column(unique = true)
  private String transactionId;

  @Column
  private String paymentMethod; // ONLINE, CASH, CHEQUE, DD

  @Column
  private String receiptNumber;

  @Column(nullable = false)
  private LocalDateTime paymentDate;

  @Column
  private LocalDateTime dueDate;

  @Column(length = 500)
  private String description;

  @Column
  private String remarks;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  // Constructors
  public Payment() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getStudentId() {
    return studentId;
  }

  public void setStudentId(Long studentId) {
    this.studentId = studentId;
  }

  public String getStudentName() {
    return studentName;
  }

  public void setStudentName(String studentName) {
    this.studentName = studentName;
  }

  public String getStudentRollNo() {
    return studentRollNo;
  }

  public void setStudentRollNo(String studentRollNo) {
    this.studentRollNo = studentRollNo;
  }

  public String getDepartment() {
    return department;
  }

  public void setDepartment(String department) {
    this.department = department;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getSemester() {
    return semester;
  }

  public void setSemester(String semester) {
    this.semester = semester;
  }

  public String getAcademicYear() {
    return academicYear;
  }

  public void setAcademicYear(String academicYear) {
    this.academicYear = academicYear;
  }

  public PaymentType getPaymentType() {
    return paymentType;
  }

  public void setPaymentType(PaymentType paymentType) {
    this.paymentType = paymentType;
  }

  public PaymentStatus getStatus() {
    return status;
  }

  public void setStatus(PaymentStatus status) {
    this.status = status;
  }

  public String getTransactionId() {
    return transactionId;
  }

  public void setTransactionId(String transactionId) {
    this.transactionId = transactionId;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(String paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public String getReceiptNumber() {
    return receiptNumber;
  }

  public void setReceiptNumber(String receiptNumber) {
    this.receiptNumber = receiptNumber;
  }

  public LocalDateTime getPaymentDate() {
    return paymentDate;
  }

  public void setPaymentDate(LocalDateTime paymentDate) {
    this.paymentDate = paymentDate;
  }

  public LocalDateTime getDueDate() {
    return dueDate;
  }

  public void setDueDate(LocalDateTime dueDate) {
    this.dueDate = dueDate;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getRemarks() {
    return remarks;
  }

  public void setRemarks(String remarks) {
    this.remarks = remarks;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  // Enums
  public enum PaymentType {
    SEMESTER_FEE,
    ANNUAL_FEE,
    EXAM_FEE,
    HOSTEL_FEE,
    LIBRARY_FEE,
    LAB_FEE,
    OTHER
  }

  public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
  }
}
