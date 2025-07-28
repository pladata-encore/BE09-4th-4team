package com.olive.reviewservice.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import olive.oliveyoung.member.review.entity.Review;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Builder
public class ReviewResponseDto {
    private Long reviewId;
    private String userName;
    private Long productId;
    private Double rating;
    private String skinType;
    private String skinConcern;
    private String texture;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String brandName;
    private String productName;
    private String imageUrl;
    private Integer discountedPrice;


    public static ReviewResponseDto from(Review review) {
        return ReviewResponseDto.builder()
                .reviewId(review.getReviewId())
                .userName(review.getUser().getUserName())
                .productId(review.getProduct().getProductId())
                .rating(review.getRating())
                .skinType(review.getSkinType())
                .skinConcern(review.getSkinConcern())
                .texture(review.getTexture())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .brandName(review.getProduct().getBrand().getBrandName())
                .productName(review.getProduct().getProductName())
                .imageUrl(review.getProduct().getImageUrl())
                .build();
    }
}
