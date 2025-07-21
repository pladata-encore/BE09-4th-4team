package olive.oliveyoung.member.user.service;

import olive.oliveyoung.member.user.dto.response.AdminUserDetailResponse;
import olive.oliveyoung.member.user.dto.response.AdminUserSummaryResponse;

import java.util.List;
// argocd test를 위한 수정
public interface AdminService {

    List<AdminUserSummaryResponse> getAllUsersForAdmin();

    AdminUserDetailResponse getUserDetailForAdmin(String userId);

    void createAdminUser(String userId, String password, String userName, String email, String phone);

}
