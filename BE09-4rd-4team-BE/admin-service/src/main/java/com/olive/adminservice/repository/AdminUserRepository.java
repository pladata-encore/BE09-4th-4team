package com.olive.adminservice.repository;

import olive.oliveyoung.member.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminUserRepository extends JpaRepository<User, Long> {

    @Query("SELECT COUNT(u) FROM User u")
    Long countUsers();


}
