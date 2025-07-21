package olive.oliveyoung.member.user.dto.request;

import lombok.*;

/* 비밀번호를 수정할 때 쓰는 request dto */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordUpdateRequest {
    private String password;
    private String newPassword;
}
