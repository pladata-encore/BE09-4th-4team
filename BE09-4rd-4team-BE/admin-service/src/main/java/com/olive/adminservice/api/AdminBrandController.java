package com.olive.adminservice.api;

import olive.oliveyoung.member.product.repository.BrandRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/brands") // 실제로 어떤 경로든 무관, 정확하게 맞춰야 함
@CrossOrigin(origins ="http://localhost:3000")

// 발표용 이스터에그 테스트 주석
public class AdminBrandController {


    private final BrandRepository brandRepository;

    public AdminBrandController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @GetMapping
    public List<BrandResponse> getBrands() {
        return brandRepository.findAll().stream()
                .map(b -> new BrandResponse(b.getBrandId(), b.getBrandName()))
                .toList();
    }
    public record BrandResponse(Long brand_id, String brand_name) {}
}
