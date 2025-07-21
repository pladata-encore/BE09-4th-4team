package olive.oliveyoung.member.review.repository;

import olive.oliveyoung.member.review.entity.Review;
import olive.oliveyoung.member.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_ProductId(Long productId);
    List<Review> findByUser_UserNo(Long userNo);
    long countByUser_UserNo(Long userNo);
    Optional<Review> findByReviewIdAndUser_UserNo(Long reviewId, Long userNo);
    void deleteByUser(User user);

}
