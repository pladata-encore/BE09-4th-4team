package com.olive.userservice.service.impl;

import olive.oliveyoung.member.user.domain.Role;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.user.domain.User;
import olive.oliveyoung.member.user.dto.response.AdminUserDetailResponse;
import olive.oliveyoung.member.user.dto.response.AdminUserSummaryResponse;
import olive.oliveyoung.member.user.repository.AdminRepository;
import olive.oliveyoung.member.user.repository.UserRepository;
import olive.oliveyoung.member.user.service.AdminService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final PasswordEncoder passwordEncoder;
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    /**
     * 관리자: 전체 사용자 목록 조회
     */
    @Override
    public List<AdminUserSummaryResponse> getAllUsersForAdmin() {
        return userRepository.findByRole(Role.ADMIN).stream()
                .map(user -> new AdminUserSummaryResponse(
                        user.getUserId(),
                        user.getUserName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }



    /**
     * 관리자: 특정 사용자 상세 정보 조회
     */
    @Override
    public AdminUserDetailResponse getUserDetailForAdmin(String userId) {
        if ("admin".equals(userId)) {
            throw new BadCredentialsException("관리자 계정입니다");
        }

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadCredentialsException("사용자를 찾을 수 없습니다."));

        return new AdminUserDetailResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getPhone(),
                user.getCreatedAt()
        );
    }


    /**
     * 관리자 계정 생성
     */
    @Override
    @Transactional
    public void createAdminUser(String userId, String password, String userName, String email, String phone) {
        if (adminRepository.existsByUserId(userId)) {
            throw new IllegalArgumentException("이미 사용 중인 관리자 ID입니다.");
        }

        String encodedPassword = passwordEncoder.encode(password);

        User adminUser = User.builder()
                .userId(userId)
                .password(encodedPassword)
                .userName(userName)
                .email(email)
                .phone(phone)
                .role(Role.ADMIN) // 관리자 권한 부여
                .build();

        adminRepository.save(adminUser);
    }

}
