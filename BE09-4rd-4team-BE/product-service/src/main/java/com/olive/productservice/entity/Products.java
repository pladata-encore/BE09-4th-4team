package olive.oliveyoung.member.product.entity;

import jakarta.persistence.*;
import jdk.jfr.Description;
import lombok.*;

import olive.oliveyoung.member.review.entity.Review;

import java.time.LocalDateTime; // LocalDateTime 임포트
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"badges", "brand", "reviews"})
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "original_price", nullable = false)
    private Integer originalPrice;

    @Column(name = "discounted_price", nullable = false)
    private Integer discountedPrice;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false) // 생성 시간은 변경되지 않음
    private LocalDateTime createdAt;

    @Column(name = "sales_count", nullable = false)
    private Integer salesCount;

    @Column(name = "discount_rate")
    private Integer discountRate;

    @Column(name = "state")
    private String state;

    @Column(name = "thumbnail_images")
    private String thumbnailImages;

    @Column(name = "description_images")
    private String descriptionImages;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "product_badges",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "badge_id")
    )
    private List<Badges> badges = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brands brand;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    // Entity가 처음 저장될 때(Persist) 자동으로 호출되어 필드를 초기화한다.
    @PrePersist // 엔티티가 저장되기 전에 실행
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (salesCount == null) {
            salesCount = 0; // 초기 판매량 0
        }
        if (originalPrice != null && originalPrice > 0) {
            double calculatedRate = ((double)(originalPrice - discountedPrice) / originalPrice) * 100.0;
            this.discountRate = (int) Math.round(calculatedRate);
        } else {
            this.discountRate = 0;
        }
    }

    @PreUpdate // 엔티티가 업데이트되기 전에 실행
    protected void onUpdate() {
        if (originalPrice != null && originalPrice > 0) {
            double calculatedRate = ((double)(originalPrice - discountedPrice) / originalPrice) * 100.0;
            this.discountRate = (int) Math.round(calculatedRate);
        } else {
            this.discountRate = 0; 
        }
    }

}