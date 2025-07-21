package olive.oliveyoung.member.user.service.impl;



import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import olive.oliveyoung.member.order.repository.OrderRepository;
import olive.oliveyoung.member.review.repository.ReviewRepository;
import olive.oliveyoung.member.user.dto.response.UserInfoResponse;
import olive.oliveyoung.member.user.repository.AddressRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import olive.oliveyoung.member.user.domain.Role;
import olive.oliveyoung.member.user.domain.User;
import olive.oliveyoung.member.user.dto.request.PasswordUpdateRequest;
import olive.oliveyoung.member.user.dto.request.UserSignUpRequest;
import olive.oliveyoung.member.user.dto.request.UserUpdateRequest;
import olive.oliveyoung.member.user.dto.request.UserWithdrawRequest;
import olive.oliveyoung.member.user.repository.RefreshTokenRepository;
import olive.oliveyoung.member.user.repository.UserRepository;
import olive.oliveyoung.member.user.service.UserService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ReviewRepository reviewRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;

    /**
     * 회원가입 전 회원 중복 체크 - 회원 이름, 회원 전화번호
     */
    @Override
    public Optional<String> getUserByNameAndPhone(String userName, String phone) {
        return userRepository.findByUserNameAndPhone(userName, phone)
                .map(User::getUserId);
    }

    /**
     * 회원가입 전 회원 중복 체크 - 회원 이름
     * 미사용
     */
    @Override
    public boolean existsByUserName(String userName) {
        return userRepository.existsByUserName(userName);
    }

    /**
     * 회원가입 전 회원 중복 체크 - 회원 전화번호
     * 미사용
     */
    @Override
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    /**
     * 회원가입 중 아이디 중복 체크
     */
    @Override
    public boolean isUserIdDuplicate(String userId) {
        return userRepository.existsByUserId(userId);
    }

    /**
     * 회원가입
     *
     * @return
     */
    @Transactional
    @Override
    public void signUp(UserSignUpRequest request) {
        // 아이디 중복 체크
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 전화번호 중복 체크
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("이미 사용 중인 전화번호입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // User 엔티티 생성
        User user = User.builder()
                .userId(request.getUserId())
                .password(encodedPassword)
                .userName(request.getUserName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(Role.USER) // 기본 권한 설정 (Role enum이 있다고 가정)
                .build();

        // DB에 저장
        userRepository.save(user);

    }

    /**
     * 회원 탈퇴
     */
    @Transactional
    @Override
    public void withdraw(String userId, UserWithdrawRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadCredentialsException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        // Refresh Token 삭제
        refreshTokenRepository.deleteByUserId(userId);

        // 연관 엔티티 순서대로 삭제
        reviewRepository.deleteByUser(user);
        orderRepository.deleteByUser(user);
        addressRepository.deleteByUser(user);

        // 사용자 삭제
        userRepository.delete(user);
    }

    /**
     * 회원 비밀번호 수정
     */
    @Transactional
    @Override
    public void updatePassword(String userId, PasswordUpdateRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadCredentialsException("사용자를 찾을 수 없습니다."));

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 암호화 및 업데이트
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.updatePassword(encodedNewPassword); // User 엔티티에 비밀번호 업데이트 메서드 추가 필요

        userRepository.save(user);
    }

    /**
     * 회원 정보 수정
     */
    @Transactional
    @Override
    public void updateUser(String userId, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadCredentialsException("사용자를 찾을 수 없습니다."));

        // PATCH 요청에 맞춰 null이 아닌 필드만 업데이트
        if (userUpdateRequest.getUserName() != null) {
            user.setUserName(userUpdateRequest.getUserName());
        }
        if (userUpdateRequest.getEmail() != null) {
            user.setEmail(userUpdateRequest.getEmail());
        }
        if (userUpdateRequest.getPhone() != null) {
            user.setPhone(userUpdateRequest.getPhone());
        }

        userRepository.save(user);
    }


}

