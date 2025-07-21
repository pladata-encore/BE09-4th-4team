package olive.oliveyoung.member.order.repository;

import olive.oliveyoung.member.order.entity.Carts;
import olive.oliveyoung.member.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Carts, Long> {

    Optional<Carts> findByUser(User user);
}
