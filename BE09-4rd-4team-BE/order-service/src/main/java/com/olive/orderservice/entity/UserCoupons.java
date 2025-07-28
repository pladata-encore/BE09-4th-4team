package com.olive.orderservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import olive.oliveyoung.member.coupon.domain.Coupon;
import olive.oliveyoung.member.user.domain.User;

@Entity
@Table(
        name = "user_coupons",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_no", "coupon_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCoupons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_coupon_id")
    private Long userCouponId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @Column(name = "is_used")
    private boolean isUsed = false;
}
