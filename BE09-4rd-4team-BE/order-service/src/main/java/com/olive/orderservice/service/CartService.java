package com.olive.orderservice.service;

import olive.oliveyoung.member.order.dto.request.CartItemRequest;
import olive.oliveyoung.member.order.dto.response.CartItemResponse;
import olive.oliveyoung.member.order.entity.CartItems;
import olive.oliveyoung.member.order.entity.Carts;
import olive.oliveyoung.member.order.repository.CartItemRepository;
import olive.oliveyoung.member.order.repository.CartRepository;
import olive.oliveyoung.member.product.entity.Products;
import olive.oliveyoung.member.product.repository.ProductRepository;
import olive.oliveyoung.member.user.domain.User;
import olive.oliveyoung.member.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartService(UserRepository userRepository,
                       ProductRepository productRepository,
                       CartRepository cartRepository,
                       CartItemRepository cartItemRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    // 장바구니에 상품 추가
    public CartItemResponse addCartItem(String userId, CartItemRequest request) {

        // 1. 사용자 찾기
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자는 존재하지 않습니다."));

        // 2. 상품 찾기
        Products product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("해당 상품은 존재하지 않습니다."));

        // 3. 사용자의 창바구니 찾기
        Carts cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Carts.create(user)));

        // 4. 기존 장바구니에 같은 상품이 담겨 있는지 확인
        Optional<CartItems> optionalItem = cartItemRepository.findByCartAndProduct(cart, product);

        CartItems savedItem;
        if (optionalItem.isPresent()) {
            // 4-1. 같은 상품이 있을 시, 수량만 증가
            CartItems existingItem = optionalItem.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            savedItem = cartItemRepository.save(existingItem);
        } else {
            // 4-2. 같은 상품이 없을 시, 새로 추가
            CartItems newItem = new CartItems();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            savedItem = cartItemRepository.save(newItem);
        }

        return CartItemResponse.from(savedItem);
    }

    // 사용자별 장바구니 조회
    public List<CartItemResponse> getCartItems(String userId) {

        // 1. 유저 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자는 존재하지 않습니다."));

        // 2. 장바구니 조회
        Optional<Carts> optionalCart = cartRepository.findByUser(user);

        if (optionalCart.isEmpty()) {
            return new ArrayList<>(); // 장바구니 없음 → 빈 리스트 반환
        }

        // 3. 해당 장바구니의 모든 상품 정보 가져오기
        Carts cart = optionalCart.get();
        List<CartItems> cartItems = cartItemRepository.findByCart(cart);

        // 4. 응답 DTO로 변환
        return cartItems == null ? new ArrayList<>() : cartItems.stream()
                .map(CartItemResponse::from)
                .collect(Collectors.toList());
    }

    // 장바구니 상품 개수 변경
    public CartItemResponse updateCartItem(Long cartItemId, Integer quantity, LocalDateTime updatedAt) {

        // 1. cartItemId로 해당 항목 조회
        CartItems cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("해당 장바구니 항목이 존재하지 않습니다."));

        // 2. 수량 및 업데이트 시간 수정
        cartItem.setQuantity(quantity);
        cartItem.getCart().setUpdatedAt(updatedAt);

        // 3. 저장
        cartItemRepository.save(cartItem);

        // 4. 응답 DTO로 변환
        return CartItemResponse.from(cartItem);
    }

    // 장바구니 상품 삭제
    public void deleteCartItem(Long cartItemId) {

        // 1. cartItemId로 해당 항목 조회
        CartItems cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("해당 장바구니 항목이 존재하지 않습니다."));

        // 2. 삭제
        cartItemRepository.delete(cartItem);
    }
}
