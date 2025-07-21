package olive.oliveyoung.admin.repository;


import olive.oliveyoung.admin.dto.DashboardStatResponse;
import olive.oliveyoung.admin.dto.DashboardStatsResponse;
import olive.oliveyoung.admin.dto.RecentOrderResponse;
import olive.oliveyoung.member.order.entity.Orders;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, String> {

    @Query("""
    SELECT new olive.oliveyoung.admin.dto.DashboardStatsResponse(
        SUM(oi.price * oi.quantity),
        COUNT(DISTINCT o),
        (SELECT COUNT(p) FROM Products p),
        (SELECT COUNT(u) * 1L FROM User u)
    )
    FROM Orders o
    JOIN o.orderItems oi
""")
    DashboardStatsResponse getDashboardStats();


}
