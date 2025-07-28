package com.olive.userservice.repository;

import olive.oliveyoung.member.user.domain.Role;
import olive.oliveyoung.member.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserId(String userId);

    boolean existsByUserName(String userName);

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<User> findByUserNameAndPhone(String userName, String phone);

    List<User> findByRole(Role role); // 관리자용 필터

}