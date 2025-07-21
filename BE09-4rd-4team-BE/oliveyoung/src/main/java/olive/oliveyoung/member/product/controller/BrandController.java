// oliveyoung/member/product/controller/BrandController.java
package olive.oliveyoung.member.product.controller;

import olive.oliveyoung.member.product.repository.BrandRepository;
import olive.oliveyoung.member.product.dto.BrandResponseDTO; // BrandResponseDTO 임포트
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:3000")
public class BrandController {

    private final BrandRepository brandRepository;

    public BrandController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    // 반환 타입을 List<BrandResponseDTO>로 변경
    @GetMapping
    public ResponseEntity<List<BrandResponseDTO>> getAllBrands() {
        List<BrandResponseDTO> brandDTOs = brandRepository.findAll()
                .stream()
                .map(BrandResponseDTO::new) // Brands 엔티티를 BrandResponseDTO로 변환
                .collect(Collectors.toList());
        return new ResponseEntity<>(brandDTOs, HttpStatus.OK);
    }
}