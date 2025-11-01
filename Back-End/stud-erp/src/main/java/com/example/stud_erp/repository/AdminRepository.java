package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

  Admin findByUsername(String username);

  Admin findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  Optional<Admin> findByUsernameAndPassword(String username, String password);
}
