package olive.oliveyoung.member.user.dto.request;

import lombok.*;

/* 회원가입 전 회원으로 등록하기 위해 확인하는 request dto */
@Setter
@Getter
@NoArgsConstructor // JSON -> Java Object 변환을 위해 필요
@AllArgsConstructor
@Builder
public class DuplicateCheckRequest {

    private String userName;
    private String phone;

}
