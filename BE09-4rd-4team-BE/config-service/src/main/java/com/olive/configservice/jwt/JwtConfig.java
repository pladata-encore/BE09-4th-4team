package com.olive.configservice.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/* JWT 관련 환경변수 모음 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtConfig {
    private String secret;
    private long expiration;
    private long refreshExpiration;
    private String header;
    private String prefix;


}

