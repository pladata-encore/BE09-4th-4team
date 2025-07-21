package olive.oliveyoung.member.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.user.common.ApiResponse;
import olive.oliveyoung.member.user.dto.request.LoginRequest;
import olive.oliveyoung.member.user.dto.response.LoginResponse;
import olive.oliveyoung.member.user.dto.response.TokenResponse;
import olive.oliveyoung.member.user.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/* 로그인, 토큰 생성/검증, 로그아웃 처리 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     *  로그인
     */
     @PostMapping("/login")
     public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
         LoginResponse loginResponse = authService.login(loginRequest);
         return ResponseEntity.ok(ApiResponse.success(loginResponse, HttpStatus.OK.value()));
     }

    /**
     * 토큰 재발급
     */
   @PostMapping("/refresh")
   public ResponseEntity<ApiResponse<TokenResponse>> refresh(HttpServletRequest request) {
              TokenResponse tokenResponse = authService.refresh(request);
              return ResponseEntity.ok(ApiResponse.success(tokenResponse, HttpStatus.OK.value()));
   }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
             authService.logout(request);
             return ResponseEntity.ok(ApiResponse.success(null, HttpStatus.OK.value()));
    }


}

