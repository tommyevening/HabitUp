package cv.tomasz.CV.service;

/**
 * Service interface for generating AI prompts
 */
public interface PromptService {
    
    /**
     * Create a system prompt based on the current agent configuration
     * 
     * @return System prompt for the AI model
     */
    String createSystemPrompt();
} 