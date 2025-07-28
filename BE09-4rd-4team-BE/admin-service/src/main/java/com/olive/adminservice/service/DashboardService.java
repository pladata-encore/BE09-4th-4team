package com.olive.adminservice.service;

import olive.oliveyoung.admin.dto.DashboardStatResponse;
import olive.oliveyoung.admin.dto.DashboardStatsResponse;
import olive.oliveyoung.admin.dto.RecentOrderResponse;
import olive.oliveyoung.admin.dto.TopProductResponse;

import java.util.List;

public interface DashboardService {

    DashboardStatsResponse getDashboardStats();

    List<RecentOrderResponse> getRecentOrders();
    List<TopProductResponse> getTopProducts();
}