package com.olive.reviewservice.entity;

import jakarta.persistence.*;
import lombok.*;
import olive.oliveyoung.member.product.entity.Products;
import olive.oliveyoung.member.user.domain.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;


@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "product"})
@EntityListeners(AuditingEntityListener.class)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;

    @Column(nullable = false)
    private Double rating;

    @Lob
    private String content;

    @Column(name = "skin_type")
    private String skinType;

    @Column(name = "skin_concern")
    private String skinConcern;

    @Column(name = "texture")
    private String texture;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @PrePersist
    protected void onCreate() {
        this.date = LocalDateTime.now();
    }

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

