package com.olive.reviewservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReviewUpdateDto {
    private Double rating;
    private String content;
    private String skinType;      // 피부타입
    private String skinConcern;   // 피부고민(세정력 등)
    private String texture;       // 자극도
}
