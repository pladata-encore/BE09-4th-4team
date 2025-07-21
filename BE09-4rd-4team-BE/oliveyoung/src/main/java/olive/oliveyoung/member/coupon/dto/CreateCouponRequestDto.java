package olive.oliveyoung.member.coupon.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CreateCouponRequestDto {
    private String name;
    private Double discount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime validUntil;
    private Long userId; // null이면 전체 사용자 대상 쿠폰
}
