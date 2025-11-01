package com.example.stud_erp.service;

import com.example.stud_erp.dto.NotificationWithReadStatus;
import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.entity.Notification;
import com.example.stud_erp.entity.NotificationRead;
import com.example.stud_erp.model.NotificationRequest;
import com.example.stud_erp.repository.HODRepository;
import com.example.stud_erp.repository.NotificationReadRepository;
import com.example.stud_erp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationReadRepository notificationReadRepository;

    @Autowired
    private HODRepository hodRepository;

    public void sendNotification(NotificationRequest request) {
        // Validate input
        if (request.getSenderId() == null || request.getSenderId().trim().isEmpty()) {
            throw new RuntimeException("Sender ID is required");
        }
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Notification title is required");
        }
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new RuntimeException("Notification message is required");
        }
        if (request.getMessage().length() > 5000) {
            throw new RuntimeException("Message too long. Maximum 5000 characters allowed.");
        }

        // Find HOD sender
        HOD sender = findHODSender(request.getSenderId());

        // Create notification
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setSubject(request.getSubject());
        notification.setSenderName(sender.getName());
        notification.setSenderId(request.getSenderId());
        notification.setRecipientType(request.getRecipientType());
        notification.setTimestamp(LocalDateTime.now());
        notification.setReadStatus(false);
        notification.setRecipientId("BROADCAST");
        notification.setRecipientRole("BROADCAST");

        notificationRepository.save(notification);
    }

    private HOD findHODSender(String senderId) {
        try {
            Long hodId = Long.valueOf(senderId.trim());
            HOD sender = hodRepository.findById(hodId).orElse(null);

            if (sender != null) {
                return sender;
            }

            // If requested HOD not found, try to use any available HOD
            List<HOD> allHods = hodRepository.findAll();
            if (!allHods.isEmpty()) {
                return allHods.get(0); // Use first available HOD
            }

            // If no HODs exist, create a default one
            return createDefaultHOD();

        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid HOD ID format: " + senderId);
        }
    }

    private HOD createDefaultHOD() {
        HOD defaultHOD = new HOD();
        defaultHOD.setName("Default HOD");
        defaultHOD.setDepartment("Administration");
        defaultHOD.setUsername("default_hod");
        defaultHOD.setPassword("default");
        defaultHOD.setEmail("hod@college.edu");
        defaultHOD.setPhone("1234567890");
        return hodRepository.save(defaultHOD);
    }

    // Get notifications for a specific student with read status
    public List<NotificationWithReadStatus> getNotificationsForStudent(String studentId) {
        // Get all notifications for students
        List<Notification> notifications = notificationRepository.findNotificationsForStudents();

        return buildNotificationWithReadStatus(notifications, studentId, "STUDENT");
    }

    // Get notifications for a specific professor with read status
    public List<NotificationWithReadStatus> getNotificationsForProfessor(String professorId) {
        // Get all notifications for professors
        List<Notification> notifications = notificationRepository.findNotificationsForProfessors();

        return buildNotificationWithReadStatus(notifications, professorId, "PROFESSOR");
    }

    private List<NotificationWithReadStatus> buildNotificationWithReadStatus(
            List<Notification> notifications, String userId, String userRole) {

        List<NotificationWithReadStatus> result = new ArrayList<>();

        for (Notification notification : notifications) {
            // Check if this user has read this notification
            boolean hasRead = notificationReadRepository
                    .findByNotificationIdAndUserIdAndUserRole(notification.getId(), userId, userRole)
                    .isPresent();

            // Get total read count for this notification
            Long totalReads = notificationReadRepository.countReadsByNotificationId(notification.getId());

            NotificationWithReadStatus notificationWithStatus = new NotificationWithReadStatus(
                    notification.getId(),
                    notification.getTitle(),
                    notification.getMessage(),
                    notification.getSubject(),
                    notification.getTimestamp(),
                    notification.getSenderName(),
                    notification.getSenderId(),
                    notification.getRecipientType(),
                    hasRead,
                    totalReads);

            result.add(notificationWithStatus);
        }

        return result;
    }

    // Get all notifications sent by a specific sender (HOD) - no duplicates!
    public List<Notification> getSentNotifications(String senderId) {
        return notificationRepository.findUniqueNotificationsBySenderId(senderId);
    }

    // Delete a notification by ID
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

        // Also delete all read records for this notification
        List<NotificationRead> readRecords = notificationReadRepository.findByNotificationId(notificationId);
        notificationReadRepository.deleteAll(readRecords);

        notificationRepository.delete(notification);
    }

    // Update/modify a notification
    public void updateNotification(Long notificationId, NotificationRequest request) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

        // Update the notification fields
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setSubject(request.getSubject());
        // Note: We don't change recipient information or timestamp for updates

        notificationRepository.save(notification);
    }

    // Mark a notification as read by a specific user
    public void markNotificationAsRead(Long notificationId, String userId, String userRole) {
        // Check if notification exists
        if (!notificationRepository.existsById(notificationId)) {
            throw new RuntimeException("Notification not found with id: " + notificationId);
        }

        // Check if user has already read this notification
        if (notificationReadRepository
                .findByNotificationIdAndUserIdAndUserRole(notificationId, userId, userRole)
                .isPresent()) {
            return; // Already marked as read
        }

        // Create read record
        NotificationRead readRecord = new NotificationRead();
        readRecord.setNotificationId(notificationId);
        readRecord.setUserId(userId);
        readRecord.setUserRole(userRole);
        readRecord.setReadAt(LocalDateTime.now());

        notificationReadRepository.save(readRecord);
    }

    // Legacy method - deprecated
    public void markNotificationAsRead(Long notificationId) {
        throw new UnsupportedOperationException(
                "Please use markNotificationAsRead(notificationId, userId, userRole) instead");
    }
}
