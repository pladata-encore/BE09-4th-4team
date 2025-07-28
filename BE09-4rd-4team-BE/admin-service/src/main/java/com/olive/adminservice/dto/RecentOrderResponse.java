package com.olive.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import olive.oliveyoung.member.order.entity.DeliveryStatus;

import java.time.LocalDateTime;

@Getter
@Setter
public class RecentOrderResponse {
    private Long orderId;
    private String userName;
    private LocalDateTime createdAt;
    private Long totalAmount;
    private DeliveryStatus status;

    public RecentOrderResponse(Long orderId, String userName, LocalDateTime createdAt, Long totalAmount, DeliveryStatus status) {
        this.orderId = orderId;
        this.userName = userName;
        this.createdAt = createdAt;
        this.totalAmount = totalAmount;
        this.status = status;
    }
}
