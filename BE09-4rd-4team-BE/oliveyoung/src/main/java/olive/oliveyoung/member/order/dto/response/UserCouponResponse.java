package olive.oliveyoung.member.order.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import olive.oliveyoung.member.order.entity.UserCoupons;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserCouponResponse {

    private Long couponId;
    private Long userCouponId;
    private String couponName;
    private Double Discount;
    private boolean isUsed;
    private LocalDateTime createdAt;
    private LocalDateTime validUntil;

    public static UserCouponResponse from(UserCoupons coupon) {

        UserCouponResponse res = new UserCouponResponse();
        res.setCouponId(coupon.getCoupon().getId());
        res.setUserCouponId(coupon.getUserCouponId());
        res.setCouponName(coupon.getCoupon().getName());
        res.setDiscount(coupon.getCoupon().getDiscount());
        res.setUsed(coupon.isUsed());
        res.setCreatedAt(coupon.getCoupon().getCreatedAt());
        res.setValidUntil(coupon.getCoupon().getValidUntil());
        return res;
    }
}
