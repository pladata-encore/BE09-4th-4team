package olive.oliveyoung.member.order.service;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.order.entity.DeliveryStatus;
import olive.oliveyoung.member.order.entity.Orders;
import olive.oliveyoung.member.order.repository.OrderRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderStatusScheduler {

    private final OrderRepository orderRepository;

    @Async
    public void changeStatusAfterDelay(String orderId) {
        try {
            Thread.sleep(15000); // 15초 대기

            Orders order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("해당 주문을 찾을 수 없습니다."));

            order.setStatus(DeliveryStatus.COMPLETED);
            orderRepository.save(order);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}