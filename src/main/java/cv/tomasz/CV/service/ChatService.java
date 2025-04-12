package cv.tomasz.CV.service;

import java.util.List;
import com.theokanning.openai.completion.chat.ChatMessage;

/**
 * Service interface for handling chat interactions
 */
public interface ChatService {
    
    /**
     * Process a user message and return a response
     * 
     * @param userMessage The message from the user
     * @return The AI response
     */
    String processMessage(String userMessage);
    
    /**
     * Get the chat history
     * 
     * @return List of chat messages
     */
    List<ChatMessage> getChatHistory();
    
    /**
     * Clear the chat history
     */
    void clearChatHistory();
} 