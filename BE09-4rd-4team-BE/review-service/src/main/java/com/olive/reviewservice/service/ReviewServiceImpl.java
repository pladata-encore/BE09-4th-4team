package com.olive.reviewservice.service;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.order.entity.OrderItems;
import olive.oliveyoung.member.order.repository.OrderItemsRepository;
import olive.oliveyoung.member.product.entity.Products;
import olive.oliveyoung.member.product.repository.ProductRepository;
import olive.oliveyoung.member.review.dto.ReviewRequestDto;
import olive.oliveyoung.member.review.dto.ReviewResponseDto;
import olive.oliveyoung.member.review.dto.ReviewUpdateDto;
import olive.oliveyoung.member.review.entity.Review;
import olive.oliveyoung.member.review.repository.ReviewRepository;
import olive.oliveyoung.member.user.domain.User;
import olive.oliveyoung.member.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemsRepository orderItemsRepository;

    /**
     * 리뷰 등록
     */
    @Override
    @Transactional
    public Long createReview(Long productId, ReviewRequestDto dto, Long userNo) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Products product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(dto.getRating())
                .content(dto.getContent())
                .skinType(dto.getSkinType())
                .skinConcern(dto.getSkinConcern())
                .texture(dto.getTexture())
                .build();

        Long reviewId = reviewRepository.save(review).getReviewId();

        // 주문아이템 hasReview true 처리
        if (dto.getOrderItemId() != null) {
            OrderItems orderItem = orderItemsRepository.findById(dto.getOrderItemId())
                    .orElseThrow(() -> new RuntimeException("주문 아이템을 찾을 수 없습니다."));
            orderItem.setHasReview(true);
            orderItemsRepository.save(orderItem);
        }

        return reviewId;
    }

    /**
     * 리뷰 삭제
     */
    @Override
    @Transactional
    public String deleteReview(Long reviewId, Long userNo) {
        Review review = reviewRepository.findByReviewIdAndUser_UserNo(reviewId, userNo)
                .orElseThrow(() -> new RuntimeException("해당 사용자의 리뷰를 찾을 수 없습니다."));
        reviewRepository.delete(review);
        return review.getProduct().getProductId() + "번 상품의 리뷰가 삭제되었습니다.";
    }

    /**
     * 리뷰 수정
     */
    @Override
    @Transactional
    public String updateReview(Long reviewId, ReviewUpdateDto dto, Long userNo) {
        Review review = reviewRepository.findByReviewIdAndUser_UserNo(reviewId, userNo)
                .orElseThrow(() -> new RuntimeException("해당 사용자의 리뷰를 찾을 수 없습니다."));

        review.setRating(dto.getRating());
        review.setContent(dto.getContent());
        review.setSkinType(dto.getSkinType());
        review.setSkinConcern(dto.getSkinConcern());
        review.setTexture(dto.getTexture());

        return review.getProduct().getProductId() + "번 상품의 리뷰가 수정되었습니다.";
    }

    /**
     * 상품별 리뷰 조회
     */
    @Override
    public List<ReviewResponseDto> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * 유저별 리뷰 조회 (userNo 기반)
     */
    @Override
    public List<ReviewResponseDto> getReviewsByUserNo(Long userNo) {
        return reviewRepository.findByUser_UserNo(userNo).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * 평균 평점
     */
    @Override
    public double getAverageRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProduct_ProductId(productId);
        if (reviews.isEmpty()) return 0.0;

        double total = reviews.stream().mapToDouble(Review::getRating).sum();
        double average = total / reviews.size();
        average = Math.round(average * 10.0) / 10.0;
        return Math.min(average, 5.0);
    }

    /**
     * Entity -> DTO 변환
     */
    private ReviewResponseDto toResponseDto(Review review) {
        Products product = review.getProduct();
        return ReviewResponseDto.builder()
                .reviewId(review.getReviewId())
                .userName(review.getUser().getUserName())
                .productId(product.getProductId())
                .rating(review.getRating())
                .texture(review.getTexture())
                .skinType(review.getSkinType())
                .content(review.getContent())
                .skinConcern(review.getSkinConcern())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .productName(product.getProductName())
                .imageUrl(product.getImageUrl())
                .brandName(product.getBrand().getBrandName())
                .build();
    }
}
