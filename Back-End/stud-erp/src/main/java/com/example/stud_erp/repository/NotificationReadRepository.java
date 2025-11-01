package com.example.stud_erp.repository;

import com.example.stud_erp.entity.NotificationRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationReadRepository extends JpaRepository<NotificationRead, Long> {

  // Check if a specific user has read a specific notification
  Optional<NotificationRead> findByNotificationIdAndUserIdAndUserRole(Long notificationId, String userId,
      String userRole);

  // Get all read records for a specific notification
  List<NotificationRead> findByNotificationId(Long notificationId);

  // Get all notifications read by a specific user
  List<NotificationRead> findByUserIdAndUserRole(String userId, String userRole);

  // Count how many users have read a specific notification
  @Query("SELECT COUNT(nr) FROM NotificationRead nr WHERE nr.notificationId = :notificationId")
  Long countReadsByNotificationId(@Param("notificationId") Long notificationId);
}