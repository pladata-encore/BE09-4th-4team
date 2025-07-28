package com.olive.userservice.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "refresh_token")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    @Id
    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private Date expiryDate;

    public void updateToken(String newToken, Date newExpiryDate) {
        this.token = newToken;
        this.expiryDate = newExpiryDate;
    }

}
