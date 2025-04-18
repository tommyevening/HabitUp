package cv.tomasz.CV.model.dto;

public class AuthResponse {
    
    private boolean success;
    private String message;
    private String token;
    private Long userId;
    
    // Constructors
    
    public AuthResponse() {
    }
    
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public AuthResponse(boolean success, String message, String token, Long userId) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
    }
    
    // Static factory methods for common responses
    
    public static AuthResponse success(String message, String token, Long userId) {
        return new AuthResponse(true, message, token, userId);
    }
    
    public static AuthResponse failure(String message) {
        return new AuthResponse(false, message);
    }
    
    // Getters and setters
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
} 