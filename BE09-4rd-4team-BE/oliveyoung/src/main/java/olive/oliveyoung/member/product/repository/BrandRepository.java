package olive.oliveyoung.member.product.repository;

import olive.oliveyoung.member.product.entity.Brands; // Brands 엔티티 참조
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brands, Long> {
}