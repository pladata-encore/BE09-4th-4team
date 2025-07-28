package com.olive.reviewservice.service;

import olive.oliveyoung.member.review.dto.ReviewRequestDto;
import olive.oliveyoung.member.review.dto.ReviewResponseDto;
import olive.oliveyoung.member.review.dto.ReviewUpdateDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReviewService {
    Long createReview(Long productId, ReviewRequestDto dto, Long userNo);         // 등록
    String updateReview(Long reviewId, ReviewUpdateDto dto, Long userNo);         // 수정
    String deleteReview(Long reviewId, Long userNo);                              // 삭제
    List<ReviewResponseDto> getReviewsByProduct(Long productId);                  // 상품별 조회
    List<ReviewResponseDto> getReviewsByUserNo(Long userNo);                      // 유저별 조회 (PK 기반)
    double getAverageRating(Long productId);                                      // 평점
}



