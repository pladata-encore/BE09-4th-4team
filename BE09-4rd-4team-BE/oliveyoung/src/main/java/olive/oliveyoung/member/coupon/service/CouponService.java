package olive.oliveyoung.member.coupon.service;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.coupon.domain.Coupon;
import olive.oliveyoung.member.coupon.dto.CreateCouponRequestDto;
import olive.oliveyoung.member.coupon.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    // 쿠폰 코드 유효성 검사
    public Coupon validateCoupon(String couponCode, Long userId) {
        Coupon coupon = couponRepository.findByName(couponCode)
                .orElseThrow(() -> new IllegalArgumentException("❌ 존재하지 않는 쿠폰입니다."));

        if (coupon.getIsUsed()) {
            throw new IllegalStateException("❌ 이미 사용된 쿠폰입니다.");
        }

        if (coupon.getValidUntil().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("❌ 쿠폰 유효기간이 지났습니다.");
        }

        if (coupon.getUserId() != null && !coupon.getUserId().equals(userId)) {
            throw new IllegalStateException("❌ 해당 유저의 쿠폰이 아닙니다.");
        }

        return coupon;
    }

    // 쿠폰 사용 처리
    public void markCouponAsUsed(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 쿠폰을 찾을 수 없습니다."));

        coupon.setIsUsed(true);
        couponRepository.save(coupon);
    }

    // 쿠폰 등록
    public Coupon createCoupon(CreateCouponRequestDto dto, int adminId) {
        Coupon coupon = new Coupon();
        coupon.setName(dto.getName());
        coupon.setDiscount(dto.getDiscount());
        coupon.setValidUntil(dto.getValidUntil());
        coupon.setUserId(dto.getUserId()); // null 허용
        coupon.setIsUsed(false);
        coupon.setCreatedAt(LocalDateTime.now());

        return couponRepository.save(coupon);
    }

    //쿠폰 전체 조회
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    //쿠폰 삭제
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("❌ 해당 쿠폰이 존재하지 않습니다."));
        couponRepository.delete(coupon);
    }



}
