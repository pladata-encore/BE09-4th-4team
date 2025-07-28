package com.olive.userservice.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long addressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private User user;

    @Column(nullable = false)
    private String addressName; // 배송지명

    @Column(nullable = false, length = 15)
    private String recipientName; // 받는 분

    @Column(nullable = false)
    private String phone; // 연락처

    @Column(nullable = false, length = 127)
    private String streetAddress; // 도로명 주소

    @Column(length = 50)
    private String detailAddress; // 상세 주소

    @Column(nullable = false)
    private boolean isDefault; // 기본 배송지 여부

    // 연관관계 편의 메서드
    public void setUser(User user) {
        this.user = user;
    }


    // 수정 메서드
    public void updateAddress(String addressName, String recipientName, String phone, String streetAddress , String detailAddress, boolean isDefault) {
        this.addressName = addressName;
        this.recipientName = recipientName;
        this.phone = phone;
        this.streetAddress = streetAddress;
        this.detailAddress = detailAddress;
        this.isDefault = isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }
}
