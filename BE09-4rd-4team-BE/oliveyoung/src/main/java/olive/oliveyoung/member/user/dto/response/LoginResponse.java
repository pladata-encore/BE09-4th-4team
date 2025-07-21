package olive.oliveyoung.member.user.dto.response;

// 로그인 응답 전용

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String userName;
    private Long userNo;
}


