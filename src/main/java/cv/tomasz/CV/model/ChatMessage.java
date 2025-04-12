package cv.tomasz.CV.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a chat message in the conversation
 */
public class ChatMessage {
    private String message;
    private String sender;
    private final LocalDateTime timestamp;
    
    /**
     * Default constructor - initializes with current timestamp
     */
    public ChatMessage() {
        this.timestamp = LocalDateTime.now();
    }
    
    /**
     * Constructor with message and sender
     * 
     * @param message The message content
     * @param sender The message sender
     * @throws IllegalArgumentException if message or sender is null
     */
    public ChatMessage(String message, String sender) {
        this();
        setMessage(message);
        setSender(sender);
    }
    
    /**
     * Get the message content
     * 
     * @return The message content
     */
    public String getMessage() {
        return message;
    }
    
    /**
     * Set the message content
     * 
     * @param message The message content
     * @throws IllegalArgumentException if message is null
     */
    public void setMessage(String message) {
        if (message == null) {
            throw new IllegalArgumentException("Message cannot be null");
        }
        this.message = message;
    }
    
    /**
     * Get the message sender
     * 
     * @return The sender
     */
    public String getSender() {
        return sender;
    }
    
    /**
     * Set the message sender
     * 
     * @param sender The sender
     * @throws IllegalArgumentException if sender is null
     */
    public void setSender(String sender) {
        if (sender == null) {
            throw new IllegalArgumentException("Sender cannot be null");
        }
        this.sender = sender;
    }
    
    /**
     * Get the message timestamp
     * 
     * @return The timestamp
     */
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatMessage that = (ChatMessage) o;
        return Objects.equals(message, that.message) &&
               Objects.equals(sender, that.sender) &&
               Objects.equals(timestamp, that.timestamp);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(message, sender, timestamp);
    }
    
    @Override
    public String toString() {
        return "ChatMessage{" +
                "message='" + message + '\'' +
                ", sender='" + sender + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
} 