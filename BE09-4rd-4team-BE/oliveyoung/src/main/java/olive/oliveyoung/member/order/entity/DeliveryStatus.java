package olive.oliveyoung.member.order.entity;

public enum DeliveryStatus {
    // 주문접수 -> 결제완료 -> 배송준비중 -> 배송중 -> 배송완료
    RECEIVED, PAID, READY, SHIPPING, COMPLETED
}
