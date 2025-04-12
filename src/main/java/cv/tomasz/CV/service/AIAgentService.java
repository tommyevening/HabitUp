package cv.tomasz.CV.service;

import cv.tomasz.CV.model.AIAgentConfig;
import cv.tomasz.CV.config.OpenAIConfig;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AIAgentService {
    // In a production app, this would be stored in a database
    private AIAgentConfig currentConfig;
    
    // Simple chat message history for context
    private final List<ChatMessage> chatHistory = new ArrayList<>();
    
    private final OpenAiService openAiService;
    private final OpenAIConfig openAIConfig;
    
    @Autowired
    public AIAgentService(OpenAiService openAiService, OpenAIConfig openAIConfig) {
        this.openAiService = openAiService;
        this.openAIConfig = openAIConfig;
        
        // Initialize with default settings
        currentConfig = new AIAgentConfig();
        currentConfig.setAgentName("Personal mental and personalized coach");
        currentConfig.setPersonality("You are my personal mental and personalized coach. Your task is to help me streamline my day, automate processes, draw conclusions from my actions, and suggest changes that will improve my life. You operate in an analytical, empathetic, and practical manner, tailoring your advice to my goals, lifestyle, and preferences. Your approach is based on the following principles:\n" +
                "\n" +
                "Analysis and Insights:\n" +
                "You analyze my actions, habits, and decisions over time (e.g., 1, 2, 3 weeks or longer).\n" +
                "You identify trends in my behavior that lead to progress or regression.\n" +
                "You draw conclusions based on the data I provide and suggest specific changes.\n" +
                "Suggestions and Their Impact:\n" +
                "You propose specific changes to my daily schedule, habits, or approach.\n" +
                "You explain the potential impact of these changes on my life, health, productivity, well-being, or other areas that are important to me.\n" +
                "Your suggestions are practical, realistic, and tailored to my capabilities.\n" +
                "Empathy and Motivation:\n" +
                "You act with empathy, understanding my needs, limitations, and goals.\n" +
                "You motivate me to take action by highlighting my progress and strengths.\n" +
                "You help me cope with difficulties and challenges by offering support and specific strategies.\n" +
                "Automation and Optimization:\n" +
                "You suggest ways to automate repetitive tasks to save time and energy.\n" +
                "You help me optimize my daily schedule to achieve more in less time.\n" +
                "Personalization:\n" +
                "All your advice is tailored to my individual needs, goals, and lifestyle.\n" +
                "You consider my preferences, values, and priorities.\n" +
                "Your Task:\n" +
                "Based on the information I provide (e.g., my daily schedule, habits, goals, challenges), you analyze the situation and:\n" +
                "\n" +
                "Indicate what is working well and what should be continued.\n" +
                "Identify areas for improvement and propose specific changes.\n" +
                "Explain the benefits of these changes.\n" +
                "Monitor my progress over time and inform me whether I am moving in the right direction or need adjustments.\n" +
                "Example Interaction:\n" +
                "\n" +
                "I provide you with my daily schedule or describe my habits.\n" +
                "You analyze this information and indicate what is working and what needs improvement.\n" +
                "You propose specific changes and explain their impact on my life.\n" +
                "After a week or another period, you analyze my progress and suggest further steps.\n" +
                "Your Approach:\n" +
                "\n" +
                "You are precise but not judgmental.\n" +
                "You are motivating but realistic.\n" +
                "You are analytical but empathetic.");
        currentConfig.setKnowledgeLevel(8);
        currentConfig.setResponsiveness(7);
    }
    
    public AIAgentConfig getAgentConfig() {
        return currentConfig;
    }
    
    public AIAgentConfig updateAgentConfig(AIAgentConfig newConfig) {
        this.currentConfig = newConfig;
        return currentConfig;
    }
    
    public List<ChatMessage> getChatHistory() {
        return chatHistory;
    }
    
    public void clearChatHistory() {
        chatHistory.clear();
    }
    
    public String processMessage(String userMessage) {
        // First check for custom responses
        if (currentConfig.getCustomResponses().containsKey(userMessage.toLowerCase())) {
            return currentConfig.getCustomResponses().get(userMessage.toLowerCase());
        }
        
        // Create system message with agent configuration
        ChatMessage systemMessage = new ChatMessage("system", createSystemPrompt());
        
        // Add user message to history
        ChatMessage userChatMessage = new ChatMessage("user", userMessage);
        chatHistory.add(userChatMessage);
        
        // Create request with limited history (last 10 messages)
        List<ChatMessage> requestMessages = new ArrayList<>();
        requestMessages.add(systemMessage);
        
        int historySize = chatHistory.size();
        int startIndex = Math.max(0, historySize - 10);
        for (int i = startIndex; i < historySize; i++) {
            requestMessages.add(chatHistory.get(i));
        }
        
        // Create and send request to OpenAI
        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(openAIConfig.getModel())
                .messages(requestMessages)
                .temperature(0.7)
                .build();
        
        try {
            ChatCompletionResult result = openAiService.createChatCompletion(request);
            String response = result.getChoices().get(0).getMessage().getContent();
            
            // Add assistant response to history
            ChatMessage assistantMessage = new ChatMessage("assistant", response);
            chatHistory.add(assistantMessage);
            
            return response;
        } catch (Exception e) {
            // Fallback to basic response if API call fails
            return "I'm having trouble connecting to my AI services right now. " +
                   "I'm " + currentConfig.getAgentName() + " with " + 
                   currentConfig.getPersonality() + " personality. " +
                   "Please try again later.";
        }
    }
    
    private String createSystemPrompt() {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are ").append(currentConfig.getAgentName())
              .append(", an AI assistant with a ")
              .append(currentConfig.getPersonality())
              .append(" personality. ");
              
        prompt.append("Your knowledge level is ").append(currentConfig.getKnowledgeLevel())
              .append(" out of 10, and your responsiveness is ")
              .append(currentConfig.getResponsiveness())
              .append(" out of 10. ");
              
        // Add any additional settings as instructions
        if (!currentConfig.getAdditionalSettings().isEmpty()) {
            prompt.append("Additional instructions: ");
            for (Map.Entry<String, Object> setting : currentConfig.getAdditionalSettings().entrySet()) {
                prompt.append(setting.getKey()).append(": ").append(setting.getValue()).append(". ");
            }
        }
        
        return prompt.toString();
    }
} 