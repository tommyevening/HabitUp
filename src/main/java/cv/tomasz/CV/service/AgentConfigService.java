package cv.tomasz.CV.service;

import cv.tomasz.CV.model.AIAgentConfig;
import java.util.Map;

/**
 * Service interface for managing AI agent configuration
 */
public interface AgentConfigService {
    
    /**
     * Get the current agent configuration
     * 
     * @return The current AIAgentConfig
     */
    AIAgentConfig getAgentConfig();
    
    /**
     * Update the agent configuration
     * 
     * @param newConfig The new configuration to apply
     * @return The updated configuration
     */
    AIAgentConfig updateAgentConfig(AIAgentConfig newConfig);
    
    /**
     * Add a custom response to the agent
     * 
     * @param trigger The trigger phrase
     * @param response The response to give
     * @return The updated configuration
     */
    AIAgentConfig addCustomResponse(String trigger, String response);
    
    /**
     * Update agent personality
     * 
     * @param personality The new personality description
     * @return The updated configuration
     */
    AIAgentConfig updatePersonality(String personality);
    
    /**
     * Update agent name
     * 
     * @param name The new agent name
     * @return The updated configuration
     */
    AIAgentConfig updateAgentName(String name);
    
    /**
     * Add or update an additional setting
     * 
     * @param key The setting key
     * @param value The setting value
     * @return The updated configuration
     */
    AIAgentConfig updateAdditionalSetting(String key, Object value);
    
    /**
     * Reset the agent to default settings
     * 
     * @return The reset configuration
     */
    AIAgentConfig resetAgent();
} 