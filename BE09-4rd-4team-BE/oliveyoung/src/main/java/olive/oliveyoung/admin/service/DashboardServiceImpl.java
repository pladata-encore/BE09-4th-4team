package olive.oliveyoung.admin.service;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.admin.dto.DashboardStatResponse;
import olive.oliveyoung.admin.dto.DashboardStatsResponse;
import olive.oliveyoung.admin.dto.RecentOrderResponse;
import olive.oliveyoung.admin.dto.TopProductResponse;
import olive.oliveyoung.admin.repository.OrdersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrdersRepository ordersRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        return ordersRepository.getDashboardStats();
    }


    @Override
    public List<RecentOrderResponse> getRecentOrders() {
        return List.of();
    }

    @Override
    public List<TopProductResponse> getTopProducts() {
        return List.of();
    }
}
