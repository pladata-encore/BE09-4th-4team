package olive.oliveyoung.member.user.controller;

import olive.oliveyoung.member.user.common.ApiResponse;
import olive.oliveyoung.member.user.common.CustomUserDetails; // CustomUserDetails import 추가
import olive.oliveyoung.member.user.domain.User;
import olive.oliveyoung.member.user.dto.request.DuplicateCheckRequest;
import olive.oliveyoung.member.user.dto.request.UserSignUpRequest;
import olive.oliveyoung.member.user.dto.request.UserUpdateRequest;
import olive.oliveyoung.member.user.dto.request.UserWithdrawRequest;
import olive.oliveyoung.member.user.dto.response.UserCheckBeforeSignUpResponse;
import olive.oliveyoung.member.user.dto.response.UserInfoResponse;
import olive.oliveyoung.member.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/* 회원가입, 회원 정보 수정, 회원 탈퇴 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    /**
     * 회원가입 전 회원 중복 체크 - 전화번호로 체크
     */
    @PostMapping("/user/checkduplicate")
    public ResponseEntity<ApiResponse<UserCheckBeforeSignUpResponse>> checkDuplicate(@RequestBody DuplicateCheckRequest request) {
        Optional<String> duplicatedUserId = userService.getUserByNameAndPhone(request.getUserName(), request.getPhone());

        UserCheckBeforeSignUpResponse response = new UserCheckBeforeSignUpResponse(
                duplicatedUserId.isPresent(),
                duplicatedUserId.orElse(null)
        );

        System.out.println("response: " + response.getUserId() + " & " + response.isDuplicate());

        return ResponseEntity.ok(ApiResponse.success(response, HttpStatus.OK.value()));
    }


    /**
     * 회원가입 중 회원 아이디 중복 체크 - 전화번호로 체크
     */
    @PostMapping("/user/signup/checkid")
    public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        boolean isDuplicate = userService.isUserIdDuplicate(userId);
        return ResponseEntity.ok(Map.of("duplicate", isDuplicate));
    }

    /**
     * 회원가입
     */
    @PostMapping("/user/signup")
    public ResponseEntity<ApiResponse<Void>> signUp(@RequestBody UserSignUpRequest userSignUpRequest) {
        userService.signUp(userSignUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Void>builder()
                        .success(true)
                        .message("회원가입이 완료되었습니다.")
                        .status(HttpStatus.CREATED.value())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    /**
     * 회원 탈퇴
     */
    @DeleteMapping("/mypage/withdrawal")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @AuthenticationPrincipal CustomUserDetails customUserDetails, // CustomUserDetails로 변경
            @RequestBody UserWithdrawRequest request) {

        User user = customUserDetails.getUser(); // CustomUserDetails에서 User 객체 가져오기
        userService.withdraw(user.getUserId(), request);

        String farewellMessage = user.getUserName() + "님, 안녕히 가십시오."; // 사용자 이름 포함 메시지
        String fullMessage = "회원탈퇴가 완료되었습니다. " + farewellMessage; // 기존 메시지와 결합

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message(fullMessage) // 수정된 메시지 사용
                        .status(HttpStatus.OK.value())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    /**
     * 로그인한 사용자가 자신의 정보를 확인
     */
    @GetMapping("/mypage/info")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getUserInfo(
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        User user = customUserDetails.getUser();
        UserInfoResponse userInfoResponse = new UserInfoResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getPhone()
        );
        return ResponseEntity.ok(ApiResponse.success(userInfoResponse, HttpStatus.OK.value()));
    }

    /**
     * 회원 정보 수정
     */
    @PatchMapping("/mypage/modifyinfo")
    public ResponseEntity<ApiResponse<Void>> updateUserInfo(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody UserUpdateRequest userUpdateRequest) {

        userService.updateUser(customUserDetails.getUser().getUserId(), userUpdateRequest);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("회원 정보가 성공적으로 수정되었습니다.")
                        .status(HttpStatus.OK.value())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}

