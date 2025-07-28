package com.olive.orderservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import olive.oliveyoung.member.order.entity.DeliveryStatus;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private String orderId;
    private LocalDateTime createdAt;
    private DeliveryStatus status;
    private List<OrderItemResponse> orderItems;
}
