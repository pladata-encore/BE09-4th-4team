package com.olive.userservice.service;

import olive.oliveyoung.member.user.dto.request.PasswordUpdateRequest;
import olive.oliveyoung.member.user.dto.request.UserSignUpRequest;
import olive.oliveyoung.member.user.dto.request.UserUpdateRequest;
import olive.oliveyoung.member.user.dto.request.UserWithdrawRequest;
import olive.oliveyoung.member.user.dto.response.UserInfoResponse;

import java.util.Optional;


public interface UserService {

    void signUp(UserSignUpRequest request);

    void withdraw(String username, UserWithdrawRequest request);

    void updatePassword(String userId, PasswordUpdateRequest request);

    void updateUser(String userId, UserUpdateRequest userUpdateRequest);

    Optional<String> getUserByNameAndPhone(String userName, String phone);

    boolean existsByUserName(String userName);

    boolean isUserIdDuplicate(String userId);

    boolean existsByPhone(String phone);
}
