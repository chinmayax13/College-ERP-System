package com.example.stud_erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private String subject;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String senderName;

    // The ID of the sender (HOD) who sent this notification
    @Column(nullable = true) // Making it nullable for existing data
    private String senderId;

    @Column(nullable = false)
    private String recipientType; // e.g., "ALL_STUDENTS", "ALL_PROFESSORS", "ALL"

    // For individual recipient tracking (when specific user reads notification)
    @Column(nullable = true)
    private String recipientId; // Only set when tracking individual read status

    @Column(nullable = true)
    private String recipientRole; // e.g., "STUDENT", "PROFESSOR"

    @Column(nullable = false)
    private boolean readStatus = false;
}
