package olive.oliveyoung.member.order.repository;

import olive.oliveyoung.member.order.entity.UserCoupons;
import olive.oliveyoung.member.user.domain.User;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCouponsRepository extends JpaRepositoryImplementation<UserCoupons, Long> {
    List<UserCoupons> findByUser(User user);
}
