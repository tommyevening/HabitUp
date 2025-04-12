package cv.tomasz.CV.controller;

import cv.tomasz.CV.model.Coach;
import cv.tomasz.CV.service.CoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for coach-related API endpoints
 */
@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    private final CoachService coachService;

    @Autowired
    public CoachController(CoachService coachService) {
        this.coachService = coachService;
    }

    /**
     * Create a new coach
     * 
     * @param coachData Map containing coach data
     * @return The created coach
     */
    @PostMapping
    public ResponseEntity<Coach> createCoach(@RequestBody Map<String, String> coachData) {
        String name = coachData.get("name");
        String type = coachData.get("type");
        String description = coachData.get("description");
        String avatar = coachData.get("avatar");
        
        Coach coach = new Coach(name, type, description, avatar);
        Coach createdCoach = coachService.createCoach(coach);
        
        return new ResponseEntity<>(createdCoach, HttpStatus.CREATED);
    }

    /**
     * Get all coaches
     * 
     * @return List of all coaches
     */
    @GetMapping
    public ResponseEntity<List<Coach>> getAllCoaches() {
        List<Coach> coaches = coachService.getAllCoaches();
        return ResponseEntity.ok(coaches);
    }

    /**
     * Get a coach by ID
     * 
     * @param id The coach ID
     * @return The coach if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Coach> getCoachById(@PathVariable String id) {
        return coachService.getCoachById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a coach by ID
     * 
     * @param id The coach ID
     * @return Status message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCoach(@PathVariable String id) {
        boolean deleted = coachService.deleteCoach(id);
        
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Coach deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Coach not found"));
        }
    }
} 