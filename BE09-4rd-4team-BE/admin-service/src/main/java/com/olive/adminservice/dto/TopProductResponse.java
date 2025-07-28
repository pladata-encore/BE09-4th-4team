package com.olive.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class TopProductResponse {
    private Long productId;
    private String productName;
    private Long totalQuantity;
    private Long totalRevenue;

    public TopProductResponse(Long productId, String productName, Long totalSales, Long totalRevenue) {
        this.productId = productId;
        this.productName = productName;
        this.totalQuantity = totalSales;
        this.totalRevenue = totalRevenue;
    }
}


