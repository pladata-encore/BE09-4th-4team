package olive.oliveyoung.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatResponse {
    private String title;   // 예: 총 매출, 총 주문
    private String value;   // 예: ₩ 24,389,000
    private String change;  // 예: +12.5%
    private String type;    // 예: sales, orders, products, users (아이콘 선택용)
}