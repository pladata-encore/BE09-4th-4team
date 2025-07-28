package com.olive.configservice.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.user.domain.Role;
import olive.oliveyoung.member.user.domain.User; // User import 추가
import olive.oliveyoung.member.user.repository.UserRepository; // UserRepository import 추가
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtConfig jwtConfig;
    private final UserRepository userRepository; // UserRepository 주입

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtConfig.getSecret());
        secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // 1. Access Token 생성
    public String generateAccessToken(Map<String, Object> claims) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getExpiration());

        return Jwts.builder()
                .claims(claims)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    // 2. Refresh Token 생성
    public String generateRefreshToken(String userId, String role) {
        Date now = new Date();
        long refreshExpirationMillis = jwtConfig.getRefreshExpiration();
//        System.out.println("Refresh Token Expiration (ms): " + refreshExpirationMillis);
        Date expiryDate = new Date(now.getTime() + refreshExpirationMillis);

        return Jwts.builder()
                .subject(userId)
                .claim("role", role)
                .claim("user_id", userId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    // 3. 토큰 유효성 검증 (예외 던짐)
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            throw new BadCredentialsException("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            throw new BadCredentialsException("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            throw new BadCredentialsException("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            throw new BadCredentialsException("JWT claims string is empty", e);
        }
    }

    // 4. Claims 추출
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // 5. Claims 기반 정보 추출
    public Long getUserNoFromJWT(String token) {
        return getClaims(token).get("user_no", Long.class);
    }

    public String getUserIdFromJWT(String token) {
        return getClaims(token).get("user_id", String.class);
    }

    public String getUserNameFromJWT(String token) {
        return getClaims(token).get("name", String.class);
    }

    public Role getRoleFromJWT(String token) {
        try {
            String roleStr = getClaims(token).get("role", String.class);
            return Role.valueOf(roleStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid role in token", e);
        }
    }

    // 토큰에서 User 객체 가져오기 (새로 추가)
    public User getUserFromJWT(String token) {
        String userId = getUserIdFromJWT(token);
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadCredentialsException("User not found in token"));
    }

    public Long getRefreshExpiration() {
        return jwtConfig.getRefreshExpiration();
    }

    // HttpServletRequest에서 토큰 추출
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(jwtConfig.getHeader());
        if (bearerToken != null && bearerToken.startsWith(jwtConfig.getPrefix() + " ")) {
            return bearerToken.substring(jwtConfig.getPrefix().length() + 1);
        }
        return null;
    }
}
