package cv.tomasz.CV.service.impl;

import cv.tomasz.CV.service.AgentConfigService;
import cv.tomasz.CV.service.PromptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;

/**
 * Default implementation of PromptService
 */
@Service
public class DefaultPromptService implements PromptService {
    
    private final AgentConfigService agentConfigService;
    
    @Autowired
    public DefaultPromptService(AgentConfigService agentConfigService) {
        this.agentConfigService = agentConfigService;
    }
    
    @Override
    public String createSystemPrompt() {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("You are ")
              .append(agentConfigService.getAgentConfig().getAgentName())
              .append(", an AI assistant with a ")
              .append(agentConfigService.getAgentConfig().getPersonality())
              .append(" personality. ");
              
        prompt.append("Your knowledge level is ")
              .append(agentConfigService.getAgentConfig().getKnowledgeLevel())
              .append(" out of 10, and your responsiveness is ")
              .append(agentConfigService.getAgentConfig().getResponsiveness())
              .append(" out of 10. ");
              
        // Add any additional settings as instructions
        if (!agentConfigService.getAgentConfig().getAdditionalSettings().isEmpty()) {
            prompt.append("Additional instructions: ");
            for (Map.Entry<String, Object> setting : agentConfigService.getAgentConfig().getAdditionalSettings().entrySet()) {
                prompt.append(setting.getKey())
                      .append(": ")
                      .append(setting.getValue())
                      .append(". ");
            }
        }
        
        return prompt.toString();
    }
} 