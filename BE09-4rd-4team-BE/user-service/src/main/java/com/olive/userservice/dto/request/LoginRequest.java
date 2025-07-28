package com.olive.userservice.dto.request;

import lombok.*;
// argocd를 위한 수정
/* 로그인할 때 쓰는 request dto */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginRequest {
    private String userId;
    private String password;
}
