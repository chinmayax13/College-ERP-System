package com.example.stud_erp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationWithReadStatus {
  private Long id;
  private String title;
  private String message;
  private String subject;
  private LocalDateTime timestamp;
  private String senderName;
  private String senderId;
  private String recipientType;
  private boolean readStatus; // Whether the current user has read this notification
  private Long totalReads; // Total number of users who have read this notification

  // Constructor
  public NotificationWithReadStatus(Long id, String title, String message, String subject,
      LocalDateTime timestamp, String senderName, String senderId,
      String recipientType, boolean readStatus, Long totalReads) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.subject = subject;
    this.timestamp = timestamp;
    this.senderName = senderName;
    this.senderId = senderId;
    this.recipientType = recipientType;
    this.readStatus = readStatus;
    this.totalReads = totalReads;
  }

  // Default constructor
  public NotificationWithReadStatus() {
  }
}