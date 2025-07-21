package olive.oliveyoung.member.order.repository;

import olive.oliveyoung.member.order.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Long> {
}
