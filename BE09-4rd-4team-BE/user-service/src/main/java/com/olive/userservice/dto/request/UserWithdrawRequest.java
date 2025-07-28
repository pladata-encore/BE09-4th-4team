package com.olive.userservice.dto.request;

import lombok.*;

/* 로그인 한 회원이 자신의 계정을 삭제할 때 쓰는 request dto -> 프론트 단에서도 회원탈퇴 후 비밀번호 인증으로 넘어가는 화면 필요 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserWithdrawRequest {
    private String password;
}
