package olive.oliveyoung.admin.api;
import olive.oliveyoung.admin.repository.AdminProductRequestDTO;
import olive.oliveyoung.admin.service.AdminProductService;
import olive.oliveyoung.member.product.entity.Products;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins ="http ://localhost:3000")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @PostMapping
    public ResponseEntity<Products> createProduct(@RequestBody AdminProductRequestDTO dto) {
        Products createdProduct = adminProductService.createProduct(dto);
        return ResponseEntity.ok(createdProduct);
    }
}
