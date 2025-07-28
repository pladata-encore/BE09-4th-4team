package olive.oliveyoung.member.product.controller;

import olive.oliveyoung.member.product.service.ProductService;
import olive.oliveyoung.member.product.dto.ProductResponseDTO;
import olive.oliveyoung.member.product.dto.ProductSearchRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Arrays;
// import java.util.Collections; // 만약 빈 리스트를 반환할 때 Collections.emptyList()를 사용한다면 필요

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정 (프론트엔드 포트에 맞게)
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET http://localhost:8080/api/products/skintoner/{productIdentifier}
//    @GetMapping("/skintoner/{productIdentifier}")
//    public ResponseEntity<ProductResponseDTO> getSkinTonerProductByIdentifier(@PathVariable String productIdentifier) {
//        return productService.getSkinTonerProductByIdentifier(productIdentifier)
//                .map(productDTO -> new ResponseEntity<>(productDTO, HttpStatus.OK))
//                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
//    }

    // 1. 모든 상품 목록 조회 API (정렬 포함)
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection
    ) {
        if (sortBy != null && !isValidSortColumn(sortBy)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (sortDirection != null && !isValidSortDirection(sortDirection)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<ProductResponseDTO> productDTOs = productService.getAllProducts(sortBy, sortDirection);
        return new ResponseEntity<>(productDTOs, HttpStatus.OK);
    }

    // 2. 특정 상품 상세 조회 API
    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long productId) {
        return productService.getProductById(productId)
                .map(dto -> ResponseEntity.ok(dto))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. 상품 검색 및 필터링 API (검색 조건 및 정렬 포함)
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@ModelAttribute ProductSearchRequestDTO searchRequest) {
        if (searchRequest.getSortBy() != null && !isValidSortColumn(searchRequest.getSortBy())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (searchRequest.getSortDirection() != null && !isValidSortDirection(searchRequest.getSortDirection())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<ProductResponseDTO> productDTOs = productService.searchProducts(searchRequest);
        return new ResponseEntity<>(productDTOs, HttpStatus.OK);
    }

    // 4. 상품 카테고리별 상품 조회 API
    @GetMapping("/category")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(
            @RequestParam(name = "categoryName") String categoryName) {
        // categoryName으로 상품을 조회하는 서비스 메서드를 호출
        List<ProductResponseDTO> products = productService.getProductsByCategory(categoryName);

        // 결과가 비어있을 경우 204 No Content를 반환하거나, 빈 리스트를 OK(200)와 함께 반환할 수 있습니다.
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
            // 또는 return ResponseEntity.ok(Collections.emptyList()); // 200 OK with empty list (import java.util.Collections 필요)
        }
        return ResponseEntity.ok(products); // 상품 목록이 있을 경우 200 OK와 함께 반환
    }

    // 5. 상품 상태별 상품 조회 API
    @GetMapping("/state")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByState(
            @RequestParam(name = "productState") String productState) {
        if (!isValidProductState(productState)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<ProductResponseDTO> products = productService.getProductsByState(productState);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    // 정렬 컬럼 유효성 검사를 위한 헬퍼 메서드 (수정 없음)
    private boolean isValidSortColumn(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return true;
        }
        return Arrays.asList(
                "popular",
                "new",
                "sold",
                "lowprice",
                "discount",
                "productid",
                "name", // DTO에는 productName이 있지만, sortProperty는 DB 컬럼명이나 엔티티 필드명을 따름
                "createdat",
                "salescount",
                "sellingprice", // Products 엔티티에 sellingPrice 필드가 있는지 확인
                "originalprice",
                "stock",
                "viewcount", // Products 엔티티에 viewCount 필드가 있는지 확인
                "discountedprice",
                "discountrate"
        ).contains(sortBy.toLowerCase());
    }

    // 정렬 방향 유효성 검사를 위한 헬퍼 메서드 (수정 없음)
    private boolean isValidSortDirection(String sortDirection) {
        if (sortDirection == null || sortDirection.isEmpty()) {
            return true;
        }
        return sortDirection.equalsIgnoreCase("asc") || sortDirection.equalsIgnoreCase("desc");
    }

    // 새로운 헬퍼 메서드: 상품 상태 유효성 검사 (추가)
    private boolean isValidProductState(String state) {
        if (state == null || state.isEmpty()) {
            return false; // 상태 값은 필수
        }
        return Arrays.asList("판매중", "품절임박", "품절").contains(state);
    }
}