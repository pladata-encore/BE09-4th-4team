package olive.oliveyoung.member.order.repository;

import olive.oliveyoung.member.order.entity.Orders;
import olive.oliveyoung.member.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, String> {
    List<Orders> findAllByUser(User user);

    void deleteByUser(User user);
}
