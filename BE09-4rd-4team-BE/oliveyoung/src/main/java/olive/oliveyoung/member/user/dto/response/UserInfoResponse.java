package olive.oliveyoung.member.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import olive.oliveyoung.member.user.domain.Role;

/* 로그인한 사용자가 자신의 정보를 볼 때 사용하는 response dto */
@Getter
@AllArgsConstructor
@Builder
public class UserInfoResponse {
    private String userId;
    private String userName;
    private String email;
    private String phone;
}
