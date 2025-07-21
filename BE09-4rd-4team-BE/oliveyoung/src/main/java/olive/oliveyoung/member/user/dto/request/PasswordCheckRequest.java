package olive.oliveyoung.member.user.dto.request;

import lombok.*;

/* 회원정보 수정 전 비밀번호 확인을 위한 Request */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordCheckRequest {
    String password;
}
