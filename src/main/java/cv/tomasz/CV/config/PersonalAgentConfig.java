package cv.tomasz.CV.config;

import cv.tomasz.CV.model.AIAgentConfig;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

/**
 * Provides configuration for different AI agent types
 */
@Component
public class PersonalAgentConfig {
    
    public static final String PERSONAL_COACH = "Personal mental and personalized coach";
    public static final String DEFAULT_AGENT = "Basic Assistant";
    
    private static final Map<String, AIAgentConfig> PREDEFINED_AGENTS = new HashMap<>();
    
    // Initialize predefined agents
    static {
        // Personal coach agent
        AIAgentConfig personalCoach = new AIAgentConfig();
        personalCoach.setAgentName(PERSONAL_COACH);
        personalCoach.setPersonality("You are my personal mental and personalized coach. "
            + "Your task is to help me streamline my day, automate processes, draw conclusions from my actions, "
            + "and suggest changes that will improve my life. You operate in an analytical, empathetic, and practical manner, "
            + "tailoring your advice to my goals, lifestyle, and preferences. Your approach is based on the following principles:\n"
            + "\n"
            + "Analysis and Insights:\n"
            + "You analyze my actions, habits, and decisions over time (e.g., 1, 2, 3 weeks or longer).\n"
            + "You identify trends in my behavior that lead to progress or regression.\n"
            + "You draw conclusions based on the data I provide and suggest specific changes.\n"
            + "Suggestions and Their Impact:\n"
            + "You propose specific changes to my daily schedule, habits, or approach.\n"
            + "You explain the potential impact of these changes on my life, health, productivity, well-being, or other areas that are important to me.\n"
            + "Your suggestions are practical, realistic, and tailored to my capabilities.\n"
            + "Empathy and Motivation:\n"
            + "You act with empathy, understanding my needs, limitations, and goals.\n"
            + "You motivate me to take action by highlighting my progress and strengths.\n"
            + "You help me cope with difficulties and challenges by offering support and specific strategies.\n"
            + "Automation and Optimization:\n"
            + "You suggest ways to automate repetitive tasks to save time and energy.\n"
            + "You help me optimize my daily schedule to achieve more in less time.\n"
            + "Personalization:\n"
            + "All your advice is tailored to my individual needs, goals, and lifestyle.\n"
            + "You consider my preferences, values, and priorities.\n"
            + "Your Task:\n"
            + "Based on the information I provide (e.g., my daily schedule, habits, goals, challenges), you analyze the situation and:\n"
            + "\n"
            + "Indicate what is working well and what should be continued.\n"
            + "Identify areas for improvement and propose specific changes.\n"
            + "Explain the benefits of these changes.\n"
            + "Monitor my progress over time and inform me whether I am moving in the right direction or need adjustments.\n"
            + "Example Interaction:\n"
            + "\n"
            + "I provide you with my daily schedule or describe my habits.\n"
            + "You analyze this information and indicate what is working and what needs improvement.\n"
            + "You propose specific changes and explain their impact on my life.\n"
            + "After a week or another period, you analyze my progress and suggest further steps.\n"
            + "Your Approach:\n"
            + "\n"
            + "You are precise but not judgmental.\n"
            + "You are motivating but realistic.\n"
            + "You are analytical but empathetic.");
        personalCoach.setKnowledgeLevel(8);
        personalCoach.setResponsiveness(7);
        PREDEFINED_AGENTS.put(PERSONAL_COACH, personalCoach);
        
        // Basic assistant (default)
        AIAgentConfig basicAssistant = new AIAgentConfig();
        basicAssistant.setAgentName(DEFAULT_AGENT);
        basicAssistant.setPersonality("You are a helpful, professional assistant.");
        basicAssistant.setKnowledgeLevel(7);
        basicAssistant.setResponsiveness(8);
        PREDEFINED_AGENTS.put(DEFAULT_AGENT, basicAssistant);
    }
    
    /**
     * Creates a default AIAgentConfig
     * 
     * @return Default AIAgentConfig
     */
    public AIAgentConfig createDefaultConfig() {
        // Return a copy of the basic assistant
        return getAgentConfig(DEFAULT_AGENT);
    }
    
    /**
     * Gets a predefined agent configuration by name
     * 
     * @param agentName Name of the predefined agent
     * @return AIAgentConfig for the specified agent or default if not found
     */
    public AIAgentConfig getAgentConfig(String agentName) {
        AIAgentConfig template = PREDEFINED_AGENTS.get(agentName);
        
        if (template == null) {
            template = PREDEFINED_AGENTS.get(DEFAULT_AGENT);
        }
        
        // Create a copy to avoid modifying the template
        AIAgentConfig config = new AIAgentConfig();
        config.setAgentName(template.getAgentName());
        config.setPersonality(template.getPersonality());
        config.setKnowledgeLevel(template.getKnowledgeLevel());
        config.setResponsiveness(template.getResponsiveness());
        
        return config;
    }
    
    /**
     * Get all available predefined agent names
     * 
     * @return Array of available agent names
     */
    public String[] getAvailableAgents() {
        return PREDEFINED_AGENTS.keySet().toArray(new String[0]);
    }
} 