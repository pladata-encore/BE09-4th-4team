package olive.oliveyoung.member.order.repository;

import olive.oliveyoung.member.order.entity.CartItems;
import olive.oliveyoung.member.order.entity.Carts;
import olive.oliveyoung.member.product.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItems, Long> {
    Optional<CartItems> findByCartAndProduct(Carts cart, Products product);

    List<CartItems> findByCart(Carts cart);
}
