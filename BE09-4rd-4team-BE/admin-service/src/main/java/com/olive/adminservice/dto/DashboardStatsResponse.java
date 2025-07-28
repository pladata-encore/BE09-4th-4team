package com.olive.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalSalesAmount;     // 총 매출
    private Long totalOrderCount;      // 총 주문 수
    private Long totalProductCount;    // 총 상품 수
    private Long totalUserCount;       // 총 회원 수
}
