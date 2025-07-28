package olive.oliveyoung.member.product.repository;

// import olive.oliveyoung.admin.domain.Product; // 이 임포트는 사용되지 않으므로 제거합니다.
import olive.oliveyoung.member.product.entity.Products; // Products 엔티티를 사용합니다.
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Products, Long> {

    @Query("SELECT p FROM Products p JOIN FETCH p.brand LEFT JOIN FETCH p.badges")
    List<Products> findAll(Sort sort);

    @Query("SELECT p FROM Products p JOIN FETCH p.brand LEFT JOIN FETCH p.badges WHERE p.productId = :productId")
    Optional<Products> findById(Long productId);

    List<Products> findByProductNameContainingIgnoreCase(String keyword, Sort sort);

    // Product 엔티티 대신 Products 엔티티를 반환하도록 수정
    List<Products> findByCategoryName(String categoryName);

    // 상품 상태별 상품 조회를 위한 메서드
    List<Products> findByState(String productState);

}