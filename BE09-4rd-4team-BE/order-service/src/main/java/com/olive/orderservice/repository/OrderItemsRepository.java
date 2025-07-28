package com.olive.orderservice.repository;

import olive.oliveyoung.member.order.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Long> {
}
