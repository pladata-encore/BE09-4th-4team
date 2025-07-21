package olive.oliveyoung.member.user.controller;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.user.common.ApiResponse;
import olive.oliveyoung.member.user.common.CustomUserDetails;
import olive.oliveyoung.member.user.domain.User;
import olive.oliveyoung.member.user.dto.request.PasswordCheckRequest;
import olive.oliveyoung.member.user.dto.request.PasswordUpdateRequest;
import olive.oliveyoung.member.user.repository.UserRepository;
import olive.oliveyoung.member.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import static com.fasterxml.jackson.databind.type.LogicalType.Map;

/* 비밀번호 변경 등 보안 로직 분리 */
@RestController
@RequiredArgsConstructor
public class UserSecurityController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    /**
     * 비밀번호 변경
     */
    @PatchMapping("/api/mypage/modifypwd")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody PasswordUpdateRequest request) {

        userService.updatePassword(customUserDetails.getUser().getUserId(), request);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("비밀번호가 성공적으로 변경되었습니다.")
                        .status(HttpStatus.OK.value())
                        .build()
        );
    }

    /**
     * 회원정보 수정 전 비밀번호 확인
     */
    @PostMapping("/api/mypage/passwordcheck")
    public ResponseEntity<ApiResponse<String>> checkPassword(
            @RequestBody PasswordCheckRequest request,
            Authentication authentication) {

        String userId = authentication.getName();

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("UNAUTHORIZED", "비밀번호가 일치하지 않습니다.", 401));
        }

        return ResponseEntity.ok(ApiResponse.success("비밀번호가 확인되었습니다.", 200));
    }


}
