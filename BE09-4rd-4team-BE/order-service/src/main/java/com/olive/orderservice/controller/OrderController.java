package com.olive.orderservice.controller;

import olive.oliveyoung.member.order.dto.request.OrderRequest;
import olive.oliveyoung.member.order.dto.response.OrderResponse;
import olive.oliveyoung.member.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. CREATE: 배송/주문 정보 생성하기
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody OrderRequest request
    ){
        String userId = user.getUsername();
        OrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.ok(response);
    }

    // 2. Read: 배송/주문 정보 조회하기
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(@AuthenticationPrincipal UserDetails user) {
        String userId = user.getUsername();
        List<OrderResponse> orders = orderService.getOrders(userId);
        return ResponseEntity.ok(orders);
    }
}
