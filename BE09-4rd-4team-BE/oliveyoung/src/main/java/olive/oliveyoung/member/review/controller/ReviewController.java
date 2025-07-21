package olive.oliveyoung.member.review.controller;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.review.dto.ReviewRequestDto;
import olive.oliveyoung.member.review.dto.ReviewResponseDto;
import olive.oliveyoung.member.review.dto.ReviewUpdateDto;
import olive.oliveyoung.member.review.service.ReviewService;
import olive.oliveyoung.member.user.common.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 등록
    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<?> createReview(@PathVariable Long productId,
                                          @RequestBody ReviewRequestDto dto,
                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long reviewId = reviewService.createReview(productId, dto, userDetails.getUserNo());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "data", Map.of("reviewId", reviewId)));
    }

    // 리뷰 수정
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId,
                                          @RequestBody ReviewUpdateDto dto,
                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        reviewService.updateReview(reviewId, dto, userDetails.getUserNo());
        return ResponseEntity.ok(new ApiResponse<>(true, "리뷰가 수정되었습니다."));
    }

    // 리뷰 삭제
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId,
                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        reviewService.deleteReview(reviewId, userDetails.getUserNo());
        return ResponseEntity.ok(new ApiResponse<>(true, "리뷰가 삭제되었습니다."));
    }

    // 상품별 리뷰 목록 조회
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<?> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewResponseDto> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(new ApiResponse<>(true, reviews));
    }

    // 유저별 리뷰 목록 조회 (userNo 기반)
    @GetMapping("/users/{userNo}/reviews")
    public ResponseEntity<?> getReviewsByUser(@PathVariable Long userNo) {
        List<ReviewResponseDto> reviews = reviewService.getReviewsByUserNo(userNo);
        return ResponseEntity.ok(new ApiResponse<>(true, reviews));
    }

    // 평균 평점 조회
    @GetMapping("/products/{productId}/reviews/average-rating")
    public ResponseEntity<?> getAverageRating(@PathVariable Long productId) {
        double averageRating = reviewService.getAverageRating(productId);
        return ResponseEntity.ok(new ApiResponse<>(true, new AverageRatingResponse(averageRating)));
    }

    // 로그인 사용자의 리뷰 목록 조회
    @GetMapping("/users/me/reviews")
    public ResponseEntity<?> getMyReviews(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("인증 정보가 없습니다. (토큰을 확인하세요)");
        }
        Long userNo = userDetails.getUserNo();
        List<ReviewResponseDto> reviews = reviewService.getReviewsByUserNo(userNo);
        return ResponseEntity.ok(new ApiResponse<>(true, reviews));
    }

    // 내부 응답 DTO (동일)
    static class AverageRatingResponse {
        private final double averageRating;
        public AverageRatingResponse(double averageRating) {
            this.averageRating = averageRating;
        }
        public double getAverageRating() { return averageRating; }
    }

    static class ApiResponse<T> {
        private final boolean success;
        private final T data;
        public ApiResponse(boolean success, T data) {
            this.success = success;
            this.data = data;
        }
        public boolean isSuccess() { return success; }
        public T getData() { return data; }
    }
}

