package cv.tomasz.CV.service;

import cv.tomasz.CV.model.Coach;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import jakarta.annotation.PostConstruct;

/**
 * Service for managing coach-related operations
 */
@Service
public class CoachService {
    private final ConcurrentHashMap<String, Coach> coaches = new ConcurrentHashMap<>();
    
    /**
     * Initialize with default coaches
     */
    @PostConstruct
    public void init() {
        // Create default coach for Mental Training
        Coach mentalCoach = new Coach(
            "Mental Training",
            "mentalCoach",
            "Help with stress, anxiety, and mindfulness",
            "fas fa-brain"
        );
        createCoach(mentalCoach);
        
        // Create default coach for Physical Training
        Coach physicalCoach = new Coach(
            "Physical Training",
            "physicalCoach",
            "Help with workout routines and fitness goals",
            "fas fa-dumbbell"
        );
        createCoach(physicalCoach);
    }
    
    /**
     * Create a new coach
     * 
     * @param coach The coach to create
     * @return The created coach
     */
    public Coach createCoach(Coach coach) {
        // Store the coach in the hash map with its ID as key
        coaches.put(coach.getId(), coach);
        return coach;
    }
    
    /**
     * Get all coaches
     * 
     * @return List of all coaches
     */
    public List<Coach> getAllCoaches() {
        return new ArrayList<>(coaches.values());
    }
    
    /**
     * Get a coach by ID
     * 
     * @param id The coach ID
     * @return Optional containing the coach if found
     */
    public Optional<Coach> getCoachById(String id) {
        return Optional.ofNullable(coaches.get(id));
    }
    
    /**
     * Delete a coach by ID
     * 
     * @param id The coach ID
     * @return true if the coach was deleted, false otherwise
     */
    public boolean deleteCoach(String id) {
        return coaches.remove(id) != null;
    }
} 