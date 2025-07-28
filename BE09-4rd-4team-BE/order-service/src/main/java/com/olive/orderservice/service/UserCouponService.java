package com.olive.orderservice.service;

import olive.oliveyoung.member.coupon.domain.Coupon;
import olive.oliveyoung.member.coupon.repository.CouponRepository;
import olive.oliveyoung.member.order.dto.response.UserCouponResponse;
import olive.oliveyoung.member.order.entity.UserCoupons;
import olive.oliveyoung.member.order.repository.UserCouponsRepository;
import olive.oliveyoung.member.user.domain.User;
import olive.oliveyoung.member.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserCouponService {

    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final UserCouponsRepository userCouponsRepository;

    public UserCouponService(UserRepository userRepository,
                             CouponRepository couponRepository,
                             UserCouponsRepository userCouponsRepository) {
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
        this.userCouponsRepository = userCouponsRepository;
    }

    // 쿠폰 추가
    public UserCouponResponse addUserCoupon(String userId, Long couponId) {

        // 1. 사용자 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자는 존재하지 않습니다."));

        // 2. 쿠폰 조회
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("해당 쿠폰은 존재하지 않습니다."));

        UserCoupons userCoupon = new UserCoupons();
        userCoupon.setUser(user);
        userCoupon.setCoupon(coupon);

        UserCoupons savedCoupon = userCouponsRepository.save(userCoupon);

        return UserCouponResponse.from(savedCoupon);
    }

    // 쿠폰 조회
    public List<UserCouponResponse> getUserCoupons(String userId) {

        // 1. 사용자 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자는 존재하지 않습니다."));

        // 2. 해당 사용자가 보유한 쿠폰 목록 조회
        List<UserCoupons> userCoupons = userCouponsRepository.findByUser(user);

        // 3. 응답 형태로 변환
        return userCoupons.stream()
                .map(UserCouponResponse::from)
                .collect(Collectors.toList());


    }

    // 쿠폰 사용여부 수정
    public UserCouponResponse updateUserCoupon(Long userCouponId) {

        // 1. 쿠폰 조회
        UserCoupons userCoupon = userCouponsRepository.findById(userCouponId)
                .orElseThrow(() -> new RuntimeException("해당 쿠폰을 보유하고 있지 않습니다."));

        // 2. 쿠폰 사용여부 수정
        userCoupon.setUsed(true);

        // 3. 저장
        userCouponsRepository.save(userCoupon);

        // 4. 응답 형태로 변환
        return UserCouponResponse.from(userCoupon);
    }

    //  쿠폰 삭제
    public void deleteUserCoupon(Long userCouponId) {

        // 1. 쿠폰 조회
        UserCoupons userCoupon = userCouponsRepository.findById(userCouponId)
                .orElseThrow(() -> new RuntimeException("해당 쿠폰을 보유하고 있지 않습니다."));

        // 2. 삭제
        userCouponsRepository.delete(userCoupon);
    }
}
