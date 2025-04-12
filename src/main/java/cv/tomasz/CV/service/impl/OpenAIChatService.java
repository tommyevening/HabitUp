package cv.tomasz.CV.service.impl;

import cv.tomasz.CV.config.OpenAIConfig;
import cv.tomasz.CV.event.AgentResetEvent;
import cv.tomasz.CV.service.AgentConfigService;
import cv.tomasz.CV.service.ChatService;
import cv.tomasz.CV.service.PromptService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

/**
 * ChatService implementation using OpenAI API
 */
@Service
public class OpenAIChatService implements ChatService {
    
    private final List<ChatMessage> chatHistory = new ArrayList<>();
    private final OpenAiService openAiService;
    private final OpenAIConfig openAIConfig;
    private final AgentConfigService agentConfigService;
    private final PromptService promptService;
    
    private static final int MAX_HISTORY_SIZE = 10;

    @Autowired
    public OpenAIChatService(
            OpenAiService openAiService, 
            OpenAIConfig openAIConfig,
            AgentConfigService agentConfigService,
            PromptService promptService) {
        this.openAiService = openAiService;
        this.openAIConfig = openAIConfig;
        this.agentConfigService = agentConfigService;
        this.promptService = promptService;
    }
    
    @Override
    public String processMessage(String userMessage) {
        // First check for custom responses
        if (agentConfigService.getAgentConfig().hasCustomResponse(userMessage)) {
            return agentConfigService.getAgentConfig().getCustomResponse(userMessage);
        }
        
        // Create system message with agent configuration
        ChatMessage systemMessage = new ChatMessage("system", promptService.createSystemPrompt());
        
        // Add user message to history
        ChatMessage userChatMessage = new ChatMessage("user", userMessage);
        chatHistory.add(userChatMessage);
        
        // Create request with limited history
        List<ChatMessage> requestMessages = new ArrayList<>();
        requestMessages.add(systemMessage);
        
        int historySize = chatHistory.size();
        int startIndex = Math.max(0, historySize - MAX_HISTORY_SIZE);
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
            return createFallbackResponse();
        }
    }
    
    @Override
    public List<ChatMessage> getChatHistory() {
        return chatHistory;
    }
    
    @Override
    public void clearChatHistory() {
        chatHistory.clear();
    }
    
    /**
     * Handle agent reset event by clearing chat history
     * 
     * @param event The agent reset event
     */
    @EventListener
    public void handleAgentResetEvent(AgentResetEvent event) {
        clearChatHistory();
    }
    
    private String createFallbackResponse() {
        return "I'm having trouble connecting to my AI services right now. " +
               "I'm " + agentConfigService.getAgentConfig().getAgentName() + " with " + 
               agentConfigService.getAgentConfig().getPersonality() + " personality. " +
               "Please try again later.";
    }
} 