package com.olive.adminservice.repository;

import olive.oliveyoung.admin.dto.TopProductResponse;
import olive.oliveyoung.member.product.entity.Products;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductsRepository extends JpaRepository<Products, Long> {

    @Query(
            value = """
       SELECT new olive.oliveyoung.admin.dto.TopProductResponse(
               p.productId,
               p.productName,
               SUM(oi.quantity),
               SUM(oi.price * oi.quantity)
           )
           FROM OrderItems oi
           JOIN oi.product p
           GROUP BY p.productId, p.productName
           ORDER BY SUM(oi.quantity) DESC
    """,
            countQuery = """
        SELECT COUNT(DISTINCT p.productId)
        FROM OrderItems oi
        JOIN oi.product p
        JOIN oi.order o
        WHERE o.status = 'COMPLETED'
    """
    )
    Page<TopProductResponse> findTopProducts(Pageable pageable);

}
