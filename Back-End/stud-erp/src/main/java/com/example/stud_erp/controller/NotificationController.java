package com.example.stud_erp.controller;

import com.example.stud_erp.dto.NotificationWithReadStatus;
import com.example.stud_erp.entity.Notification;
import com.example.stud_erp.model.NotificationRequest;
import com.example.stud_erp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest notificationRequest) {
        try {
            notificationService.sendNotification(notificationRequest);
            return ResponseEntity.ok("Notification sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send notification: " + e.getMessage());
        }
    }

    // Get notifications for a specific student with read status
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<NotificationWithReadStatus>> getNotificationsForStudent(@PathVariable String studentId) {
        try {
            List<NotificationWithReadStatus> notifications = notificationService.getNotificationsForStudent(studentId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get notifications for a specific professor with read status
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<NotificationWithReadStatus>> getNotificationsForProfessor(
            @PathVariable String professorId) {
        try {
            List<NotificationWithReadStatus> notifications = notificationService
                    .getNotificationsForProfessor(professorId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all notifications sent by a specific HOD (unique, no duplicates)
    @GetMapping("/sent/{senderId}")
    public ResponseEntity<List<Notification>> getSentNotifications(@PathVariable String senderId) {
        try {
            List<Notification> notifications = notificationService.getSentNotifications(senderId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete a notification by ID
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId) {
        try {
            notificationService.deleteNotification(notificationId);
            return ResponseEntity.ok("Notification deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete notification: " + e.getMessage());
        }
    }

    // Update/modify a notification
    @PutMapping("/{notificationId}")
    public ResponseEntity<String> updateNotification(@PathVariable Long notificationId,
            @RequestBody NotificationRequest notificationRequest) {
        try {
            notificationService.updateNotification(notificationId, notificationRequest);
            return ResponseEntity.ok("Notification updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update notification: " + e.getMessage());
        }
    }

    // Mark a notification as read by a specific user
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markNotificationAsRead(
            @PathVariable Long notificationId,
            @RequestBody Map<String, String> requestBody) {
        try {
            String userId = requestBody.get("userId");
            String userRole = requestBody.get("userRole");

            if (userId == null || userRole == null) {
                return ResponseEntity.badRequest().body("userId and userRole are required");
            }

            notificationService.markNotificationAsRead(notificationId, userId, userRole);
            return ResponseEntity.ok("Notification marked as read.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mark notification as read: " + e.getMessage());
        }
    }
}
