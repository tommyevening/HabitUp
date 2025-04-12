// HabbitUp - Index.js
document.addEventListener('DOMContentLoaded', function() {
    // Debug modal positioning
    setTimeout(() => {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            console.log('Auth modal found, checking styles');
            const modalStyles = window.getComputedStyle(authModal);
            console.log('Modal position:', modalStyles.position);
            console.log('Modal display:', modalStyles.display);
            
            const modalContent = authModal.querySelector('.modal-content');
            if (modalContent) {
                const contentStyles = window.getComputedStyle(modalContent);
                console.log('Modal content position:', contentStyles.position);
                console.log('Modal content margin:', contentStyles.margin);
            }
        }
    }, 500);
    
    // Check if chat container exists on this page
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        // Initialize the chat form event handler
        const chatForm = chatContainer.querySelector('.chat-input');
        if (chatForm) {
            chatForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const input = this.querySelector('input');
                const message = input.value.trim();
                
                if (message) {
                    // Add user message to chat
                    const chatBody = chatContainer.querySelector('.chat-body');
                    const messageEl = document.createElement('div');
                    messageEl.className = 'chat-message outgoing';
                    messageEl.textContent = message;
                    chatBody.appendChild(messageEl);
                    chatBody.scrollTop = chatBody.scrollHeight;
                    
                    // Clear input
                    input.value = '';
                    
                    // Simulate response (in a real app, this would call an API)
                    simulateChatResponse(chatBody);
                }
            });
        }
    }
    
    // Connect the hero register button to the auth modal
    const heroRegisterBtn = document.getElementById('hero-register-btn');
    if (heroRegisterBtn) {
        heroRegisterBtn.addEventListener('click', function() {
            // If showAuthModal function exists (from auth.js)
            if (typeof showAuthModal === 'function') {
                showAuthModal('register');
            } else {
                // Fallback: manually show the auth modal with register panel
                const authModal = document.getElementById('authModal');
                const loginPanel = document.getElementById('loginPanel');
                const registerPanel = document.getElementById('registerPanel');
                
                if (authModal && loginPanel && registerPanel) {
                    loginPanel.style.display = 'none';
                    registerPanel.style.display = 'block';
                    authModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            }
        });
    }
    
    // Connect the hero learn button to scroll to features section
    const heroLearnBtn = document.getElementById('hero-learn-btn');
    if (heroLearnBtn) {
        heroLearnBtn.addEventListener('click', function() {
            const featuresSection = document.querySelector('.features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Simulate chat response
    function simulateChatResponse(chatBody) {
        // Create typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message incoming';
        typingIndicator.innerHTML = '<div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>';
        
        // Add typing indicator
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // After a delay, replace with actual message
        setTimeout(() => {
            chatBody.removeChild(typingIndicator);
            const responseEl = document.createElement('div');
            responseEl.className = 'chat-message incoming';
            responseEl.textContent = "I'm here to help you build better habits. How can I assist you today?";
            chatBody.appendChild(responseEl);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1500);
    }
}); 