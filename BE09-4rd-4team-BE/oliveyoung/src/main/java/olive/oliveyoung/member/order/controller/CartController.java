package olive.oliveyoung.member.order.controller;

import olive.oliveyoung.member.order.dto.request.CartItemRequest;
import olive.oliveyoung.member.order.dto.response.CartItemResponse;
import olive.oliveyoung.member.order.service.CartService;
import olive.oliveyoung.member.user.common.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // 1. CREATE: 사용자 장바구니에 물품 넣기
    @PostMapping("/items")
    public ResponseEntity<CartItemResponse> addCartItem(
            @AuthenticationPrincipal CustomUserDetails details,
            @RequestBody CartItemRequest request) {
        String userId = details.getUsername();
        CartItemResponse response = cartService.addCartItem(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. READ: 사용자 장바구니 물품 읽어오기
    @GetMapping("/items")
    public ResponseEntity<List<CartItemResponse>> getCartItems(@AuthenticationPrincipal CustomUserDetails details) {
        String userId = details.getUsername();
        List<CartItemResponse> cartItems = cartService.getCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }

    // 3. UPDATE: 사용자 장바구니 물품 수량 수정하기
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @PathVariable Long cartItemId, @RequestBody Map<String, Integer> quantityMap) {
        Integer quantity = quantityMap.get("quantity");
        LocalDateTime updatedAt = LocalDateTime.now();
        CartItemResponse response = cartService.updateCartItem(cartItemId, quantity, updatedAt);
        return ResponseEntity.ok(response);
    }

    // 4. DELETE: 사용자 장바구니 물품 삭제하기
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long cartItemId) {
        cartService.deleteCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }
}
