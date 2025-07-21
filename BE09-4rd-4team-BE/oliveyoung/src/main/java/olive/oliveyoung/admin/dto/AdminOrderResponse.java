package olive.oliveyoung.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminOrderResponse {
    private String id;
    private String customer;
    private String date;
    private String total;
    private String payment;
    private String status;
}