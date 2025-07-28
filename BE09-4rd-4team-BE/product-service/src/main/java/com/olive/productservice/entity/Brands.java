package olive.oliveyoung.member.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.SQLOutput;

@Entity
@Table(name = "brands") // 실제 DB 테이블 이름과 일치해야 합니다.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Brands {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
    private Long brandId;

    @Column(name = "brand_name", nullable = false, unique = true)
    private String brandName;
}