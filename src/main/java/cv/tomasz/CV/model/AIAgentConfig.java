package cv.tomasz.CV.model;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration for the AI agent
 */
public class AIAgentConfig {
    private String agentName;
    private String personality;
    private int knowledgeLevel;
    private int responsiveness;
    private final Map<String, String> customResponses = new HashMap<>();
    private final Map<String, Object> additionalSettings = new HashMap<>();

    /**
     * Get the agent name
     * 
     * @return The agent name
     */
    public String getAgentName() {
        return agentName;
    }

    /**
     * Set the agent name
     * 
     * @param agentName The agent name to set
     */
    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    /**
     * Get the agent personality
     * 
     * @return The personality description
     */
    public String getPersonality() {
        return personality;
    }

    /**
     * Set the agent personality
     * 
     * @param personality The personality description to set
     */
    public void setPersonality(String personality) {
        this.personality = personality;
    }

    /**
     * Get the knowledge level (0-10 scale)
     * 
     * @return The knowledge level
     */
    public int getKnowledgeLevel() {
        return knowledgeLevel;
    }

    /**
     * Set the knowledge level (0-10 scale)
     * 
     * @param knowledgeLevel The knowledge level to set
     * @throws IllegalArgumentException if level is outside 0-10 range
     */
    public void setKnowledgeLevel(int knowledgeLevel) {
        if (knowledgeLevel < 0 || knowledgeLevel > 10) {
            throw new IllegalArgumentException("Knowledge level must be between 0 and 10");
        }
        this.knowledgeLevel = knowledgeLevel;
    }

    /**
     * Get the responsiveness level (0-10 scale)
     * 
     * @return The responsiveness level
     */
    public int getResponsiveness() {
        return responsiveness;
    }

    /**
     * Set the responsiveness level (0-10 scale)
     * 
     * @param responsiveness The responsiveness level to set
     * @throws IllegalArgumentException if level is outside 0-10 range
     */
    public void setResponsiveness(int responsiveness) {
        if (responsiveness < 0 || responsiveness > 10) {
            throw new IllegalArgumentException("Responsiveness must be between 0 and 10");
        }
        this.responsiveness = responsiveness;
    }

    /**
     * Get custom responses map (unmodifiable view)
     * 
     * @return Map of custom responses
     */
    public Map<String, String> getCustomResponses() {
        return Collections.unmodifiableMap(customResponses);
    }

    /**
     * Add a custom response
     * 
     * @param trigger The trigger phrase
     * @param response The response text
     */
    public void addCustomResponse(String trigger, String response) {
        if (trigger != null && response != null) {
            this.customResponses.put(trigger.toLowerCase(), response);
        }
    }
    
    /**
     * Set multiple custom responses at once
     * 
     * @param customResponses Map of custom responses
     */
    public void setCustomResponses(Map<String, String> customResponses) {
        this.customResponses.clear();
        if (customResponses != null) {
            for (Map.Entry<String, String> entry : customResponses.entrySet()) {
                addCustomResponse(entry.getKey(), entry.getValue());
            }
        }
    }

    /**
     * Get additional settings map (unmodifiable view)
     * 
     * @return Map of additional settings
     */
    public Map<String, Object> getAdditionalSettings() {
        return Collections.unmodifiableMap(additionalSettings);
    }

    /**
     * Add or update an additional setting
     * 
     * @param key The setting key
     * @param value The setting value
     */
    public void addAdditionalSetting(String key, Object value) {
        if (key != null && value != null) {
            this.additionalSettings.put(key, value);
        }
    }
    
    /**
     * Set multiple additional settings at once
     * 
     * @param additionalSettings Map of additional settings
     */
    public void setAdditionalSettings(Map<String, Object> additionalSettings) {
        this.additionalSettings.clear();
        if (additionalSettings != null) {
            for (Map.Entry<String, Object> entry : additionalSettings.entrySet()) {
                addAdditionalSetting(entry.getKey(), entry.getValue());
            }
        }
    }
    
    /**
     * Check if a custom response exists for the given trigger
     * 
     * @param trigger The trigger phrase to check
     * @return True if a custom response exists
     */
    public boolean hasCustomResponse(String trigger) {
        return trigger != null && customResponses.containsKey(trigger.toLowerCase());
    }
    
    /**
     * Get a custom response for the given trigger
     * 
     * @param trigger The trigger phrase
     * @return The custom response or null if not found
     */
    public String getCustomResponse(String trigger) {
        return trigger != null ? customResponses.get(trigger.toLowerCase()) : null;
    }
} 