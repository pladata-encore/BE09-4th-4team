package olive.oliveyoung.member.product.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequestDTO {
    private String keyword;
    private Long brandId;
    private String categoryName;
    private Integer minPrice;
    private Integer maxPrice;
    private String sortBy;
    private String sortDirection;
}