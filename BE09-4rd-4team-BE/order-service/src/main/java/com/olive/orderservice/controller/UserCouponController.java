package com.olive.orderservice.controller;

import olive.oliveyoung.member.order.dto.request.UserCouponRequest;
import olive.oliveyoung.member.order.dto.response.UserCouponResponse;
import olive.oliveyoung.member.order.service.UserCouponService;
import olive.oliveyoung.member.user.common.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/coupons")
@CrossOrigin(origins = "http://localhost:3000")
public class UserCouponController {

    private final UserCouponService userCouponService;

    public UserCouponController(UserCouponService userCouponService) {
        this.userCouponService = userCouponService;
    }

    // 1. CREATE : 사용자 쿠폰함에 쿠폰 추가하기
    @PostMapping
    public ResponseEntity<UserCouponResponse> addUserCoupon(
            @AuthenticationPrincipal CustomUserDetails details,
            @RequestBody UserCouponRequest request) {
        String userId = details.getUsername();
        Long couponId = request.getCouponId();
        UserCouponResponse response = userCouponService.addUserCoupon(userId, couponId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. READ : 사용자 쿠폰함에 있는 쿠폰 조회하기
    @GetMapping
    public ResponseEntity<List<UserCouponResponse>> getUserCoupons(@AuthenticationPrincipal CustomUserDetails details) {
        String userId = details.getUsername();
        List<UserCouponResponse> coupons = userCouponService.getUserCoupons(userId);
        return ResponseEntity.ok(coupons);
    }

    // 3. Update : 사용자 쿠폰함에 있는 쿠폰 수정하기 (사용 여부 수정)
    @PutMapping
    public ResponseEntity<UserCouponResponse> updateUserCoupon(
            @RequestBody UserCouponRequest request
    )
    {
        Long userCouponId = request.getCouponId();
        UserCouponResponse response = userCouponService.updateUserCoupon(userCouponId);
        return ResponseEntity.ok(response);
    }

    // 4. Delete : 사용자 쿠폰함에 있는 쿠폰 삭제하기
    @DeleteMapping("/{userCouponId}")
    public ResponseEntity<UserCouponResponse> deleteUserCoupon(
            @PathVariable Long userCouponId
    ){
        userCouponService.deleteUserCoupon(userCouponId);
        return ResponseEntity.noContent().build();
    }

}
