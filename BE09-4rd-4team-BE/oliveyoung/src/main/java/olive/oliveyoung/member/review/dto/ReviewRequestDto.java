package olive.oliveyoung.member.review.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@Data
public class ReviewRequestDto {
    private String content;
    private Double rating;
    private String skinType;
    private String skinConcern;
    private String texture;
    private Long orderItemId;

}

