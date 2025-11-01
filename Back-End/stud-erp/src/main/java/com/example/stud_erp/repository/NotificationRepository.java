package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Legacy methods for backward compatibility (will be deprecated)
    List<Notification> findByRecipientIdAndRecipientRoleOrderByTimestampDesc(String recipientId, String recipientRole);

    List<Notification> findBySenderNameOrderByTimestampDesc(String senderName);

    List<Notification> findBySenderIdOrderByTimestampDesc(String senderId);

    // New methods for optimized notification system

    // Get all notifications that should be visible to a specific student
    @Query("SELECT n FROM Notification n WHERE " +
            "(n.recipientType = 'ALL_STUDENTS' OR n.recipientType = 'ALL') " +
            "ORDER BY n.timestamp DESC")
    List<Notification> findNotificationsForStudents();

    // Get all notifications that should be visible to a specific professor
    @Query("SELECT n FROM Notification n WHERE " +
            "(n.recipientType = 'ALL_PROFESSORS' OR n.recipientType = 'ALL') " +
            "ORDER BY n.timestamp DESC")
    List<Notification> findNotificationsForProfessors();

    // Get all unique notifications sent by a specific sender (no duplicates)
    @Query("SELECT n FROM Notification n WHERE n.senderId = :senderId " +
            "AND (n.recipientId = 'BROADCAST' OR n.recipientId IS NULL) " +
            "ORDER BY n.timestamp DESC")
    List<Notification> findUniqueNotificationsBySenderId(@Param("senderId") String senderId);
}
