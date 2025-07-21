package olive.oliveyoung.member.user.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import olive.oliveyoung.member.user.common.ApiResponse;
import olive.oliveyoung.member.user.common.CustomUserDetails;
import olive.oliveyoung.member.user.dto.request.AddressRequest;
import olive.oliveyoung.member.user.dto.response.AddressResponse;
import olive.oliveyoung.member.user.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
// ci cd 잘되는지 확인할게요
@Slf4j
@RestController
@RequestMapping("/api/mypage/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // 배송지 추가
    @PostMapping("/register")
    public ApiResponse<Void> addAddress(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody AddressRequest addressRequest) {
        String userId = customUserDetails.getUsername();
        addressService.addAddress(userId, addressRequest);
        return ApiResponse.success(null, HttpStatus.CREATED.value());
    }

    // 배송지 목록 조회
    @GetMapping
    public ApiResponse<List<AddressResponse>> getAddresses(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        String userId = customUserDetails.getUsername();
        List<AddressResponse> addresses = addressService.getAddresses(userId);
        return ApiResponse.success(addresses, HttpStatus.OK.value());
    }

    // 배송지 수정
    @PutMapping("/{addressId}")
    public ApiResponse<Void> updateAddress(@AuthenticationPrincipal CustomUserDetails customUserDetails, @PathVariable Long addressId, @RequestBody AddressRequest addressRequest) {
        String userId = customUserDetails.getUsername();
        addressService.updateAddress(userId, addressId, addressRequest);
        return ApiResponse.success(null, HttpStatus.OK.value());
    }

    // 배송지 삭제
    @DeleteMapping("/{addressId}")
    public ApiResponse<Void> deleteAddress(@AuthenticationPrincipal CustomUserDetails customUserDetails, @PathVariable Long addressId) {
        String userId = customUserDetails.getUsername();
        addressService.deleteAddress(userId, addressId);
        return ApiResponse.success(null, HttpStatus.OK.value());
    }

    // 기본 배송지 설정
    @PatchMapping("/default/{addressId}")
    public ApiResponse<Void> setDefaultAddress(@AuthenticationPrincipal CustomUserDetails customUserDetails, @PathVariable Long addressId) {
        String userId = customUserDetails.getUsername();
        addressService.setDefaultAddress(userId, addressId);
        return ApiResponse.success(null, HttpStatus.OK.value());
    }


}
