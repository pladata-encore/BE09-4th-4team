package olive.oliveyoung.member.product.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Badges {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;


    // Product 엔티티와의 양방향 관계가 필요하다면 여기에 @ManyToMany 추가 (선택 사항, 복잡해질 수 있으므로 초기에는 단방향도 고려)
    // @ManyToMany(mappedBy = "badges")
    // private List<Products> products;
}