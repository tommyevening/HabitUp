package cv.tomasz.CV.event;

import org.springframework.context.ApplicationEvent;

/**
 * Event emitted when agent is reset
 */
public class AgentResetEvent extends ApplicationEvent {
    
    /**
     * Create a new AgentResetEvent
     * 
     * @param source The source of the event
     */
    public AgentResetEvent(Object source) {
        super(source);
    }
} 