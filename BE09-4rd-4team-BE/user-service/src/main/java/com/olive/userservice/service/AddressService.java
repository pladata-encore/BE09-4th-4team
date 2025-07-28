package com.olive.userservice.service;

import olive.oliveyoung.member.user.dto.request.AddressRequest;
import olive.oliveyoung.member.user.dto.response.AddressResponse;

import java.util.List;

public interface AddressService {
    void addAddress(String userId, AddressRequest addressRequest);

    List<AddressResponse> getAddresses(String userId);

    void updateAddress(String userId, Long addressId, AddressRequest addressRequest);

    void deleteAddress(String userId, Long addressId);

    void setDefaultAddress(String userId, Long addressId);
}
