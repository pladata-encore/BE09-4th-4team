package olive.oliveyoung.member.user.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import olive.oliveyoung.config.jwt.JwtTokenProvider;
import olive.oliveyoung.member.user.domain.RefreshToken;
import olive.oliveyoung.member.user.domain.User;
import olive.oliveyoung.member.user.dto.request.LoginRequest;
import olive.oliveyoung.member.user.dto.response.LoginResponse;
import olive.oliveyoung.member.user.dto.response.TokenResponse;
import olive.oliveyoung.member.user.repository.RefreshTokenRepository;
import olive.oliveyoung.member.user.repository.UserRepository;
import olive.oliveyoung.member.user.service.AuthService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;


    @Transactional
    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        User user = userRepository.findByUserId(loginRequest.getUserId())
                .orElseThrow(() -> new BadCredentialsException("올바르지 않은 아이디 혹은 비밀번호"));

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("올바르지 않은 아이디 혹은 비밀번호");
        }

        // AccessToken에 담을 Claims 생성
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_no", user.getUserNo());
        claims.put("user_id", user.getUserId());
        claims.put("user_name", user.getUserName());
        claims.put("role", user.getRole().name());

        String accessToken = jwtTokenProvider.generateAccessToken(claims);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId(), user.getRole().name());

        RefreshToken tokenEntity = RefreshToken.builder()
                .userId(user.getUserId())
                .token(refreshToken)
                .expiryDate(
                        new Date(System.currentTimeMillis()
                                + jwtTokenProvider.getRefreshExpiration())
                )
                .build();

        refreshTokenRepository.save(tokenEntity);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userName(user.getUserName())
                .userNo(user.getUserNo())
                .build();
    }

    @Transactional
    @Override
    public TokenResponse refresh(HttpServletRequest request) {
        String refreshToken = jwtTokenProvider.resolveToken(request); // HttpServletRequest에서 토큰 추출
        
        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("유효하지 않은 리프레시 토큰입니다.");
        }

        String userId = jwtTokenProvider.getUserIdFromJWT(refreshToken);
        
        RefreshToken storedRefreshToken = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new BadCredentialsException("리프레시 토큰을 찾을 수 없습니다. 다시 로그인해주세요."));

        if (!storedRefreshToken.getToken().equals(refreshToken)) {
            throw new BadCredentialsException("저장된 리프레시 토큰과 일치하지 않습니다.");
        }

        // 새로운 Access Token 생성
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", userId);
        claims.put("user_name", jwtTokenProvider.getUserNameFromJWT(refreshToken));
        claims.put("role", jwtTokenProvider.getRoleFromJWT(refreshToken).name());
        // User user = userRepository.findByUserId(userId).orElseThrow(() -> new BadCredentialsException("사용자를 찾을 수 없습니다."));
        // claims.put("user_no", user.getUserNo());
        // claims.put("user_name", user.getUserName());

        String newAccessToken = jwtTokenProvider.generateAccessToken(claims);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userId, jwtTokenProvider.getRoleFromJWT(refreshToken).name());

        // Refresh Token 업데이트
        storedRefreshToken.updateToken(newRefreshToken, new Date(System.currentTimeMillis() + jwtTokenProvider.getRefreshExpiration()));
        refreshTokenRepository.save(storedRefreshToken);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    @Override
    public void logout(HttpServletRequest request) {
        String refreshToken = jwtTokenProvider.resolveToken(request);

        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("유효하지 않은 리프레시 토큰입니다.");
        }

        String userId = jwtTokenProvider.getUserIdFromJWT(refreshToken);
        refreshTokenRepository.deleteByUserId(userId);
    }
}


