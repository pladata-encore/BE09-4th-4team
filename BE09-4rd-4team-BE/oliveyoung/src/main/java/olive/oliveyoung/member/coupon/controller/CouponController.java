package olive.oliveyoung.member.coupon.controller;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.coupon.dto.CreateCouponRequestDto;
import olive.oliveyoung.member.coupon.service.CouponService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import olive.oliveyoung.member.coupon.domain.Coupon;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3001"})
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(
            @RequestParam String code,
            @RequestParam Long userId
    ) {
        try {
            Coupon coupon = couponService.validateCoupon(code, userId);
            return ResponseEntity.ok(coupon);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    //쿠폰 생성
    @PostMapping
    public ResponseEntity<?> createCoupon(@RequestBody CreateCouponRequestDto dto) {
        try {
            int adminId = 1; // ⚠️ 인증 구현 시 로그인된 관리자 ID로 대체
            Coupon saved = couponService.createCoupon(dto, adminId);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //쿠폰 목록 조회
    @GetMapping
    public ResponseEntity<?> getAllCoupons() {
        List<Coupon> list = couponService.getAllCoupons();
        return ResponseEntity.ok(Map.of("data", list));
    }


    //쿠폰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.noContent().build(); // 204
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }





}
