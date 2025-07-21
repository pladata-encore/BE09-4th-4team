package olive.oliveyoung.member.user.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import olive.oliveyoung.member.user.common.ApiResponse;
import olive.oliveyoung.member.user.dto.request.UserSignUpRequest;
import olive.oliveyoung.member.user.dto.response.AdminUserDetailResponse;
import olive.oliveyoung.member.user.dto.response.AdminUserSummaryResponse;
import olive.oliveyoung.member.user.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// argocd를 위한 수정
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
@Slf4j
public class AdminController {

    private final AdminService adminService;

    /**
     * 관리자: 전체 사용자 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserSummaryResponse>>> getAllUsers() {
        List<AdminUserSummaryResponse> users = adminService.getAllUsersForAdmin();
        return ResponseEntity.ok(ApiResponse.success(users, HttpStatus.OK.value()));
    }

    /**
     * 관리자: 특정 사용자 상세 정보 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<AdminUserDetailResponse>> getUserDetail(@PathVariable String userId) {
        AdminUserDetailResponse userDetail = adminService.getUserDetailForAdmin(userId);
        return ResponseEntity.ok(ApiResponse.success(userDetail, HttpStatus.OK.value()));
    }

    /**
     * 관리자 계정 생성 (초기 설정용)
     */
    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<Void>> createAdminUser(@RequestBody UserSignUpRequest request){
        log.info("createAdminUser======>  {} ", request);
        adminService.createAdminUser(request.getUserId(), request.getPassword(), request.getUserName(), request.getEmail(), request.getPhone());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Void>builder()
                        .success(true)
                        .message("관리자 계정이 성공적으로 생성되었습니다.")
                        .status(HttpStatus.CREATED.value())
                        .build());
    }
}
