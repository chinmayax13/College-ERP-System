package com.example.stud_erp.model;

import lombok.Data;

@Data
public class NotificationRequest {
  private String title;
  private String message;
  private String subject;
  private String recipientType; // e.g., "ALL_STUDENTS", "ALL_PROFESSORS"
  private String senderId; // HOD's ID
}
