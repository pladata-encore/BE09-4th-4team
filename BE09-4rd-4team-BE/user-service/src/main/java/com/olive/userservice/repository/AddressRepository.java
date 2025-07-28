package com.olive.userservice.repository;

import olive.oliveyoung.member.user.domain.Address;
import olive.oliveyoung.member.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    // 유저 기준으로 주소 전체 삭제 (회원 탈퇴용)
    void deleteByUser(User user);

    // 유저의 주소 목록 조회 (필요한 경우)
    List<Address> findByUser(User user);

}
