package olive.oliveyoung.member.user.common;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String errorCode;
    private String message;
    private int status;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(T data, int status) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> failure(String errorCode, String message, int status) {
        return ApiResponse.<T>builder()
                .success(false)
                .errorCode(errorCode)
                .message(message)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
