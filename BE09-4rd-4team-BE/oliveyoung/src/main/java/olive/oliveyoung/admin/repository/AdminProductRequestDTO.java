package olive.oliveyoung.admin.repository;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AdminProductRequestDTO {
    private String productName;
    private String categoryName;
    private Integer stock;
    private Integer originalPrice;
    private Integer discountedPrice; // <- 할인 가격 필드 추가!
    private String imageUrl;
    private String description;
    private String state;
    private Long brandId;
}

