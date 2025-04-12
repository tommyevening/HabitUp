package cv.tomasz.CV.controller;

import cv.tomasz.CV.config.PersonalAgentConfig;
import cv.tomasz.CV.event.AgentResetEvent;
import cv.tomasz.CV.model.AIAgentConfig;
import cv.tomasz.CV.service.AgentConfigService;
import cv.tomasz.CV.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for AI agent API endpoints
 */
@RestController
@RequestMapping("/api/ai-agent")
public class AIAgentController {

    private final AgentConfigService agentConfigService;
    private final ChatService chatService;
    private final PersonalAgentConfig defaultAgentConfig;
    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public AIAgentController(
            AgentConfigService agentConfigService, 
            ChatService chatService,
            PersonalAgentConfig defaultAgentConfig,
            ApplicationEventPublisher eventPublisher) {
        this.agentConfigService = agentConfigService;
        this.chatService = chatService;
        this.defaultAgentConfig = defaultAgentConfig;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping("/config")
    public ResponseEntity<AIAgentConfig> getAgentConfig() {
        return ResponseEntity.ok(agentConfigService.getAgentConfig());
    }

    @PutMapping("/config")
    public ResponseEntity<AIAgentConfig> updateAgentConfig(@RequestBody AIAgentConfig config) {
        return ResponseEntity.ok(agentConfigService.updateAgentConfig(config));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String response = chatService.processMessage(userMessage);
        
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("response", response);
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/custom-responses")
    public ResponseEntity<AIAgentConfig> addCustomResponse(
            @RequestBody Map<String, String> customResponse) {
        String trigger = customResponse.get("trigger");
        String response = customResponse.get("response");
        return ResponseEntity.ok(agentConfigService.addCustomResponse(trigger, response));
    }

    @PutMapping("/personality")
    public ResponseEntity<AIAgentConfig> updatePersonality(@RequestBody Map<String, String> request) {
        String personality = request.get("personality");
        return ResponseEntity.ok(agentConfigService.updatePersonality(personality));
    }

    @PutMapping("/name")
    public ResponseEntity<AIAgentConfig> updateAgentName(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        return ResponseEntity.ok(agentConfigService.updateAgentName(name));
    }
    
    @PostMapping("/additional-setting")
    public ResponseEntity<AIAgentConfig> updateAdditionalSetting(@RequestBody Map<String, Object> setting) {
        String key = (String) setting.get("key");
        Object value = setting.get("value");
        return ResponseEntity.ok(agentConfigService.updateAdditionalSetting(key, value));
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetAgent() {
        agentConfigService.resetAgent();
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "AI agent has been reset to default settings");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get a list of all available predefined agent types
     * 
     * @return Array of agent type names
     */
    @GetMapping("/available-agents")
    public ResponseEntity<String[]> getAvailableAgents() {
        return ResponseEntity.ok(defaultAgentConfig.getAvailableAgents());
    }
    
    /**
     * Set the agent to a predefined type
     * 
     * @param request Map containing agent type
     * @return Updated agent configuration
     */
    @PostMapping("/set-agent-type")
    public ResponseEntity<AIAgentConfig> setAgentType(@RequestBody Map<String, String> request) {
        String agentType = request.get("agentType");
        
        if (agentType == null || agentType.isEmpty()) {
            // Default to the personal coach if no type specified
            agentType = PersonalAgentConfig.PERSONAL_COACH;
        }
        
        AIAgentConfig config = defaultAgentConfig.getAgentConfig(agentType);
        AIAgentConfig updatedConfig = agentConfigService.updateAgentConfig(config);
        
        // Publikujemy zdarzenie resetu agenta
        eventPublisher.publishEvent(new AgentResetEvent(this));
        
        return ResponseEntity.ok(updatedConfig);
    }
} 