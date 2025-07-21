// oliveyoung/member/product/dto/BrandResponseDTO.java
package olive.oliveyoung.member.product.dto;

import olive.oliveyoung.member.product.entity.Brands; // Brands 엔티티 참조
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrandResponseDTO {
    private Long brandId;
    private String brandName;

    public BrandResponseDTO(Brands brandEntity) {
        this.brandId = brandEntity.getBrandId();
        this.brandName = brandEntity.getBrandName();
    }
}