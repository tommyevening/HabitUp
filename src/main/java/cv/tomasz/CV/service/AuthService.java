package cv.tomasz.CV.service;

import cv.tomasz.CV.model.User;
import cv.tomasz.CV.model.dto.AuthResponse;
import cv.tomasz.CV.model.dto.LoginRequest;
import cv.tomasz.CV.model.dto.RegisterRequest;
import cv.tomasz.CV.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public AuthResponse register(RegisterRequest request) {
        // Validate that passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return AuthResponse.failure("Passwords do not match");
        }
        
        // Check if terms are accepted
        if (!request.isTerms()) {
            return AuthResponse.failure("You must accept the terms and conditions");
        }
        
        // Check if user with this email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.failure("A user with this email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        
        // Save user
        user = userRepository.save(user);
        
        // Generate token for the new user
        String token = generateToken();
        
        return AuthResponse.success("Registration successful", token, user.getId());
    }
    
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return AuthResponse.failure("Invalid email or password");
        }
        
        User user = userOpt.get();
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.failure("Invalid email or password");
        }
        
        if (!user.isActive()) {
            return AuthResponse.failure("Your account is inactive");
        }
        
        // Update last login time
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate token
        String token = generateToken();
        
        return AuthResponse.success("Login successful", token, user.getId());
    }
    
    private String generateToken() {
        // In a real application, this would use JWT or another token mechanism
        return UUID.randomUUID().toString();
    }
} 