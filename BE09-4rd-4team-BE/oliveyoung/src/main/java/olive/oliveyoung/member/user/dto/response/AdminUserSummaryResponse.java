package olive.oliveyoung.member.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

/* 관리자 페이지에서 여러 명의 사용자 목록을 보기 위한 response dto */
@Getter
@AllArgsConstructor
@Builder
public class AdminUserSummaryResponse {

    private String userId;
    private String userName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
}
