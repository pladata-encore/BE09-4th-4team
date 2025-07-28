package com.olive.userservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/* 관리자가 사용자 목록에서 특정 사용자 한 명을 클릭하여 상세 정보를 조회할 때 사용하는 response dto */
@Getter
@Builder
public class AdminUserDetailResponse {

    private String userId;
    private String userName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;

    public AdminUserDetailResponse(String userId, String userName, String email, String phone, LocalDateTime createdAt) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.phone = phone;
        this.createdAt = createdAt;
    }

}
