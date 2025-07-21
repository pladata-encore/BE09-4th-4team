package olive.oliveyoung.member.user.dto.request;

import lombok.*;

/* 로그인한 회원이 자신의 정보를 수정할 때 쓰는 request dto */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {

    private String userName;
    private String phone;
    private String email;

}
