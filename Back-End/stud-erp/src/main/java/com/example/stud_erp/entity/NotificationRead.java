package com.example.stud_erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_reads", uniqueConstraints = @UniqueConstraint(columnNames = { "notificationId", "userId",
    "userRole" }))
@Data
public class NotificationRead {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long notificationId; // Reference to the main notification

  @Column(nullable = false)
  private String userId; // Student ID or Professor ID who read it

  @Column(nullable = false)
  private String userRole; // "STUDENT" or "PROFESSOR"

  @Column(nullable = false)
  private LocalDateTime readAt;
}