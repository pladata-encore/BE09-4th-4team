package olive.oliveyoung.admin.service;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.product.entity.Brands;
import olive.oliveyoung.member.product.repository.BrandRepository;
import org.springframework.stereotype.Service;
import olive.oliveyoung.admin.repository.AdminProductRequestDTO;
import olive.oliveyoung.member.product.entity.Products;
import olive.oliveyoung.member.product.repository.ProductRepository;


@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;

    public Products createProduct(AdminProductRequestDTO dto) {
        Brands brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new IllegalArgumentException("해당 브랜드가 존재하지 않습니다."));

        Products product = Products.builder()
                .productName(dto.getProductName())
                .categoryName(dto.getCategoryName())
                .stock(dto.getStock())
                .originalPrice(dto.getOriginalPrice())
                .discountedPrice(dto.getDiscountedPrice() != null ? dto.getDiscountedPrice() : 0)
                .imageUrl(dto.getImageUrl())
                .description(dto.getDescription())
                .state(dto.getState())
                .brand(brand)
                .build();
        return productRepository.save(product);
    }
}
