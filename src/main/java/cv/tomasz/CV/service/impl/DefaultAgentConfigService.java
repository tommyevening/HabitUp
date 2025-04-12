package cv.tomasz.CV.service.impl;

import cv.tomasz.CV.config.PersonalAgentConfig;
import cv.tomasz.CV.event.AgentResetEvent;
import cv.tomasz.CV.model.AIAgentConfig;
import cv.tomasz.CV.service.AgentConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

/**
 * Default implementation of AgentConfigService
 */
@Service
public class DefaultAgentConfigService implements AgentConfigService {
    
    private AIAgentConfig currentConfig;
    private final PersonalAgentConfig defaultAgentConfig;
    private final ApplicationEventPublisher eventPublisher;
    
    @Autowired
    public DefaultAgentConfigService(
            PersonalAgentConfig defaultAgentConfig, 
            ApplicationEventPublisher eventPublisher) {
        this.defaultAgentConfig = defaultAgentConfig;
        this.eventPublisher = eventPublisher;
        this.currentConfig = defaultAgentConfig.getAgentConfig(PersonalAgentConfig.PERSONAL_COACH);
    }
    
    @Override
    public AIAgentConfig getAgentConfig() {
        return currentConfig;
    }
    
    @Override
    public AIAgentConfig updateAgentConfig(AIAgentConfig newConfig) {
        this.currentConfig = newConfig;
        return currentConfig;
    }
    
    @Override
    public AIAgentConfig addCustomResponse(String trigger, String response) {
        currentConfig.addCustomResponse(trigger, response);
        return currentConfig;
    }
    
    @Override
    public AIAgentConfig updatePersonality(String personality) {
        currentConfig.setPersonality(personality);
        return currentConfig;
    }
    
    @Override
    public AIAgentConfig updateAgentName(String name) {
        currentConfig.setAgentName(name);
        return currentConfig;
    }
    
    @Override
    public AIAgentConfig updateAdditionalSetting(String key, Object value) {
        if (key != null && value != null) {
            currentConfig.addAdditionalSetting(key, value);
        }
        return currentConfig;
    }
    
    @Override
    public AIAgentConfig resetAgent() {
        currentConfig = defaultAgentConfig.getAgentConfig(PersonalAgentConfig.PERSONAL_COACH);
        eventPublisher.publishEvent(new AgentResetEvent(this));
        return currentConfig;
    }
} 