package olive.oliveyoung.member.product.dto;

import olive.oliveyoung.member.product.entity.Products;
import olive.oliveyoung.member.product.entity.Badges;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProductResponseDTO {

    private Long productId;
    private String imageUrl;
    private String productName;
    private Integer originalPrice;
    private Integer discountedPrice;
    private List<String> badgeNames;
    private String brandName;
    private Integer stock;
    private String categoryName;
    private String description;
    private LocalDateTime createdAt;
    private Integer salesCount;
    private String state;
    private String discountRate;

    private List<String> thumbnailImages;
    private List<String> descriptionImages;

    public ProductResponseDTO(Products product) {
        this.productId = product.getProductId();
        this.imageUrl = product.getImageUrl();
        this.productName = product.getProductName();
        this.originalPrice = product.getOriginalPrice();
        this.discountedPrice = product.getDiscountedPrice();
        this.stock = product.getStock();
        this.categoryName = product.getCategoryName();
        this.description = product.getDescription();
        this.createdAt = product.getCreatedAt();
        this.salesCount = product.getSalesCount();
        this.state = product.getState();

        if (product.getDiscountRate() != null) {
            this.discountRate = product.getDiscountRate() + "%";
        } else {
            this.discountRate = "0%";
        }

        if (product.getBrand() != null) {
            this.brandName = product.getBrand().getBrandName();
        }

        if (product.getBadges() != null && !product.getBadges().isEmpty()) {
            this.badgeNames = product.getBadges().stream()
                    .map(Badges::getName)
                    .collect(Collectors.toList());
        } else {
            this.badgeNames = List.of();
        }

        // thumbnailImages: 콤마로 구분된 문자열 -> List<String>
        if (product.getThumbnailImages() != null && !product.getThumbnailImages().isBlank()) {
            this.thumbnailImages = Arrays.stream(product.getThumbnailImages().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        } else {
            this.thumbnailImages = List.of();
        }

        // descriptionImages: 콤마로 구분된 문자열 -> List<String>
        if (product.getDescriptionImages() != null && !product.getDescriptionImages().isBlank()) {
            this.descriptionImages = Arrays.stream(product.getDescriptionImages().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        } else {
            this.descriptionImages = List.of();
        }
    }

    public ProductResponseDTO() {}
}