package com.olive.adminservice.api;

import lombok.RequiredArgsConstructor;
import olive.oliveyoung.admin.dto.DashboardStatResponse;
import olive.oliveyoung.admin.dto.DashboardStatsResponse;
import olive.oliveyoung.admin.dto.RecentOrderResponse;
import olive.oliveyoung.admin.dto.TopProductResponse;
import olive.oliveyoung.admin.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins ="http ://localhost:3000")
@RequiredArgsConstructor


public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<RecentOrderResponse>> getRecentOrders() {
        return ResponseEntity.ok(dashboardService.getRecentOrders());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductResponse>> getTopProducts() {
        return ResponseEntity.ok(dashboardService.getTopProducts());
    }
}
