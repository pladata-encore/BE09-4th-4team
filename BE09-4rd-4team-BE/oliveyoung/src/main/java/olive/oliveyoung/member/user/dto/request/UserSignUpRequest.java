package olive.oliveyoung.member.user.dto.request;

import lombok.*;

/* 회원가입 시 전송하는 request dto */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSignUpRequest {

    private String userId;
    private String password;
    private String userName;
    private String email;
    private String phone;
}
