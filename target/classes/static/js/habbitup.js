// HabbitUp - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Scroll header effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Chat animation
    initChatAnimation();
    
    // Note: Modal handlers are now in auth.js
    // No need to duplicate event listeners here
    
    // Handle form submissions that are not auth-related
    const forms = document.querySelectorAll('form:not(.auth-form)');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Exclude chat forms which are handled in index.js
            if (!form.classList.contains('chat-input')) {
                e.preventDefault();
                // Handle form submission logic here
                console.log('Form submitted');
                
                // Reset form
                form.reset();
            }
        });
    });
});

function initChatAnimation() {
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) return;
    
    const messages = [
        { text: "Good morning! How are you feeling today?", type: "incoming" },
        { text: "I've been feeling tired lately and struggling to stay consistent with my workout routine.", type: "outgoing" },
        { text: "I'm analyzing your activity patterns. I notice you've been most active between 7-9am this month. Would you like me to suggest a morning routine that builds on this natural rhythm?", type: "incoming" },
        { text: "That sounds perfect, actually. What do you suggest?", type: "outgoing" },
    ];
    
    const chatBody = chatContainer.querySelector('.chat-body');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message incoming';
    typingIndicator.innerHTML = '<div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>';
    
    let messageIndex = 0;
    
    // Function to add a single message
    function addMessage(message) {
        // Show typing indicator for incoming messages
        if (message.type === 'incoming') {
            chatBody.appendChild(typingIndicator);
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Simulate typing delay
            setTimeout(() => {
                chatBody.removeChild(typingIndicator);
                const messageEl = document.createElement('div');
                messageEl.className = `chat-message ${message.type}`;
                messageEl.textContent = message.text;
                chatBody.appendChild(messageEl);
                chatBody.scrollTop = chatBody.scrollHeight;
                
                // Continue with next message
                messageIndex++;
                if (messageIndex < messages.length) {
                    setTimeout(() => {
                        addMessage(messages[messageIndex]);
                    }, 1000);
                } else {
                    // When all messages are done, show the chat input box and add typing animation
                    const chatInput = chatContainer.querySelector('.chat-input');
                    if (chatInput) {
                        chatInput.style.display = 'flex';
                        // Focus the input
                        const inputField = chatInput.querySelector('input');
                        if (inputField) {
                            setTimeout(() => {
                                inputField.focus();
                            }, 500);
                        }
                    }
                }
            }, 1500);
        } else {
            // Immediately show outgoing messages
            const messageEl = document.createElement('div');
            messageEl.className = `chat-message ${message.type}`;
            messageEl.textContent = message.text;
            chatBody.appendChild(messageEl);
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Continue with next message after a short delay
            messageIndex++;
            if (messageIndex < messages.length) {
                setTimeout(() => {
                    addMessage(messages[messageIndex]);
                }, 1000);
            }
        }
    }
    
    // Start the conversation after a short delay
    setTimeout(() => {
        addMessage(messages[messageIndex]);
    }, 1000);
    
    // Handle user input in the demo
    const chatInputForm = chatContainer.querySelector('.chat-input');
    if (chatInputForm) {
        chatInputForm.style.display = 'none'; // Hide initially
        
        chatInputForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const message = input.value.trim();
            
            if (message) {
                // Add user message
                const messageEl = document.createElement('div');
                messageEl.className = 'chat-message outgoing';
                messageEl.textContent = message;
                chatBody.appendChild(messageEl);
                chatBody.scrollTop = chatBody.scrollHeight;
                
                // Clear input
                input.value = '';
                
                // Show assistant response
                setTimeout(() => {
                    chatBody.appendChild(typingIndicator);
                    chatBody.scrollTop = chatBody.scrollHeight;
                    
                    setTimeout(() => {
                        chatBody.removeChild(typingIndicator);
                        const responseEl = document.createElement('div');
                        responseEl.className = 'chat-message incoming';
                        responseEl.textContent = "Based on your activity data and preferences, I've created a personalized morning routine. It includes a 20-minute workout optimized for your energy levels. Would you like me to schedule this for tomorrow at 7:30am?";
                        chatBody.appendChild(responseEl);
                        chatBody.scrollTop = chatBody.scrollHeight;
                    }, 2000);
                }, 500);
            }
        });
    }
}

// Typing animation for hero section
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-animation');
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, Math.random() * 50 + 50);
            }
        };
        
        typeWriter();
    });
} 