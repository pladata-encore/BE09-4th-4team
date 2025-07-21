package olive.oliveyoung.member.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class AddressRequest {
    private String addressName; // 배송지명
    private String recipientName; // 받는 분
    private String phone; // 연락처
    private String streetAddress; // 도로명 주소
    private String detailAddress; // 상세 주소
    @JsonProperty("isDefault")
    private boolean isDefault; // 기본 배송지 여부
}
