package olive.oliveyoung.member.product.service;

import olive.oliveyoung.member.product.entity.Products;
import olive.oliveyoung.member.product.repository.ProductRepository;
import olive.oliveyoung.member.product.dto.ProductResponseDTO;
import olive.oliveyoung.member.product.dto.ProductSearchRequestDTO;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ✅ 이제 문자열 prefix 처리 불필요!
    // 숫자 ID로 직접 조회
    public Optional<ProductResponseDTO> getProductById(Long productId) {
        return productRepository.findById(productId)
                .map(ProductResponseDTO::new);
    }



    // ✅ 정렬 헬퍼
    private Sort createSort(String sortBy, String sortDirection) {
        Sort.Direction direction = Sort.Direction.ASC;
        if (sortDirection != null && sortDirection.equalsIgnoreCase("desc")) {
            direction = Sort.Direction.DESC;
        }

        String sortProperty = "productId"; // 기본값

        if (sortBy != null && !sortBy.isEmpty()) {
            switch (sortBy.toLowerCase()) {
                case "popular":
                    sortProperty = "salesCount";
                    break;
                case "new":
                    sortProperty = "createdAt";
                    break;
                case "sold":
                    sortProperty = "salesCount";
                    break;
                case "lowprice":
                    sortProperty = "discountedPrice";
                    direction = Sort.Direction.ASC;
                    break;
                case "highprice":
                    sortProperty = "discountedPrice";
                    direction = Sort.Direction.DESC;
                    break;
                case "discount":
                    sortProperty = "discountRate";
                    break;
                case "productid":
                    sortProperty = "productId";
                    break;
                case "productname":
                    sortProperty = "productName";
                    break;
                default:
                    sortProperty = sortBy;
                    break;
            }
        }

        return Sort.by(direction, sortProperty);
    }

    // 전체 상품 조회
    public List<ProductResponseDTO> getAllProducts(String sortBy, String sortDirection) {
        Sort sort = createSort(sortBy, sortDirection);
        List<Products> products = productRepository.findAll(sort);
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 키워드 검색
    public List<ProductResponseDTO> searchProducts(ProductSearchRequestDTO searchRequest) {
        Sort sort = createSort(searchRequest.getSortBy(), searchRequest.getSortDirection());
        List<Products> products;

        if (searchRequest.getKeyword() != null && !searchRequest.getKeyword().isEmpty()) {
            products = productRepository.findByProductNameContainingIgnoreCase(searchRequest.getKeyword(), sort);
        } else {
            products = productRepository.findAll(sort);
        }

        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 카테고리별 상품 조회
    public List<ProductResponseDTO> getProductsByCategory(String categoryName) {
        List<Products> products = productRepository.findByCategoryName(categoryName);
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 상품 상태별 조회
    public List<ProductResponseDTO> getProductsByState(String productState) {
        List<Products> products = productRepository.findByState(productState);
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }
}