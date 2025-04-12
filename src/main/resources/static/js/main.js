/**
 * HabbitUp - Main Application Script
 * 
 * This file contains the JavaScript functionality for the HabbitUp application.
 * It's organized using a modular pattern to separate concerns and responsibilities.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    UIManager.init();
    CoachConversationManager.init();
    ChatManager.init();
    SettingsManager.init();
    PageIdentifier.init();
});

/**
 * PageIdentifier - Handles the page identification banner
 */
const PageIdentifier = {
    elements: {
        identifier: null
    },
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setPageTitle();
    },
    
    cacheElements() {
        this.elements.identifier = document.querySelector('.page-identifier');
    },
    
    bindEvents() {
        if (!this.elements.identifier) return;
        
        // Minimize the identifier when scrolling down
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.elements.identifier.classList.add('minimized');
            } else {
                this.elements.identifier.classList.remove('minimized');
            }
        });
        
        // Make it interactive - clicking it will show page info
        this.elements.identifier.addEventListener('click', () => {
            const pageId = document.body.getAttribute('data-page-id');
            
            // Create and show a toast notification with page info
            this.showPageInfo(pageId);
        });
    },
    
    setPageTitle() {
        // Update document title based on page ID
        const pageId = document.body.getAttribute('data-page-id');
        let pageTitle = 'HabbitUp';
        
        switch(pageId) {
            case 'chat-dashboard':
                pageTitle = 'HabbitUp - Chat Dashboard';
                break;
            case 'settings':
                pageTitle = 'HabbitUp - Settings';
                break;
            case 'profile':
                pageTitle = 'HabbitUp - Profile';
                break;
            case 'analytics':
                pageTitle = 'HabbitUp - Analytics';
                break;
        }
        
        document.title = pageTitle;
    },
    
    showPageInfo(pageId) {
        // Create a toast notification with page information
        const toast = document.createElement('div');
        toast.classList.add('toast', 'page-info-toast');
        
        let pageInfo = '';
        let pageIcon = '';
        
        switch(pageId) {
            case 'chat-dashboard':
                pageInfo = 'Chat Dashboard - Interact with your coaching assistants';
                pageIcon = 'fas fa-comments';
                break;
            case 'settings':
                pageInfo = 'Settings - Configure your application preferences';
                pageIcon = 'fas fa-cog';
                break;
            case 'profile':
                pageInfo = 'Profile - Manage your personal information';
                pageIcon = 'fas fa-user';
                break;
            case 'analytics':
                pageInfo = 'Analytics - Track your progress and insights';
                pageIcon = 'fas fa-chart-line';
                break;
            default:
                pageInfo = 'HabbitUp - Your personal growth assistant';
                pageIcon = 'fas fa-home';
        }
        
        toast.innerHTML = `
            <div class="toast-icon"><i class="${pageIcon}"></i></div>
            <div class="toast-content">${pageInfo}</div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(toast);
        
        // Add animation
        setTimeout(() => {
            toast.classList.add('visible');
        }, 10);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        // Add click handler to close button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.classList.remove('visible');
                setTimeout(() => toast.remove(), 300);
            });
        }
    }
};

/**
 * UIManager - Handles general UI interactions and animations
 */
const UIManager = {
    init() {
        this.initSidebarToggles();
        this.initFullscreenToggle();
        this.initAnimations();
        this.initPageNavigation();
    },

    initSidebarToggles() {
        const toggleChatHistoryBtn = document.getElementById('toggleChatHistory');
        const toggleUserSidebarBtn = document.getElementById('toggleUserSidebar');
        const chatHistorySidebar = document.querySelector('.chat-history-sidebar');
        const userSidebar = document.querySelector('.user-sidebar');
        
        if (toggleChatHistoryBtn && chatHistorySidebar) {
            toggleChatHistoryBtn.addEventListener('click', () => {
                chatHistorySidebar.classList.toggle('expanded');
            });
        }
        
        if (toggleUserSidebarBtn && userSidebar) {
            toggleUserSidebarBtn.addEventListener('click', () => {
                userSidebar.classList.toggle('expanded');
            });
        }

        // Close sidebars when clicking outside
        document.addEventListener('click', (event) => {
            if (chatHistorySidebar && chatHistorySidebar.classList.contains('expanded')) {
                if (!chatHistorySidebar.contains(event.target) && event.target !== toggleChatHistoryBtn) {
                    chatHistorySidebar.classList.remove('expanded');
                }
            }
            
            if (userSidebar && userSidebar.classList.contains('expanded')) {
                if (!userSidebar.contains(event.target) && event.target !== toggleUserSidebarBtn) {
                    userSidebar.classList.remove('expanded');
                }
            }
        });
    },

    initFullscreenToggle() {
        const expandChatBtn = document.getElementById('expandChatBtn');
        const mainLayout = document.querySelector('.main-layout');
        
        if (expandChatBtn && mainLayout) {
            expandChatBtn.addEventListener('click', () => {
                mainLayout.classList.toggle('fullscreen-chat');
                
                // Toggle button icon
                const icon = expandChatBtn.querySelector('i');
                if (mainLayout.classList.contains('fullscreen-chat')) {
                    icon.classList.remove('fa-expand');
                    icon.classList.add('fa-compress');
                } else {
                    icon.classList.remove('fa-compress');
                    icon.classList.add('fa-expand');
                }
                
                // Add a subtle pulse animation
                const mainChat = document.querySelector('.main-chat');
                if (mainChat) {
                    this.animateElement(mainChat, [
                        { transform: 'scale(0.98)' },
                        { transform: 'scale(1)' }
                    ], {
                        duration: 300,
                        easing: 'ease-out'
                    });
                }
            });
        }
    },

    initAnimations() {
        // Add hover effects to chat input
        const chatInput = document.querySelector('.chat-input input');
        const sendButton = document.querySelector('.chat-input button');
        
        if (chatInput && sendButton) {
            chatInput.addEventListener('focus', () => {
                this.animateElement(sendButton, [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.1)' },
                    { transform: 'scale(1.05)' }
                ], {
                    duration: 400,
                    easing: 'ease-out'
                });
            });
            
            // Handle send message animation
            sendButton.addEventListener('click', () => {
                this.animateElement(sendButton, [
                    { transform: 'scale(1)' },
                    { transform: 'scale(0.8)' },
                    { transform: 'scale(1.1)' },
                    { transform: 'scale(1)' }
                ], {
                    duration: 400,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });
            });
        }
        
        // Add hover effects to sidebar items
        const chatHistoryItems = document.querySelectorAll('.chat-history-item');
        
        chatHistoryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const avatar = item.querySelector('.chat-avatar');
                
                if (avatar) {
                    this.animateElement(avatar, [
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.1)' },
                        { transform: 'scale(1.05)' }
                    ], {
                        duration: 300,
                        easing: 'ease-out'
                    });
                }
            });
        });
    },

    initPageNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const pageId = item.getAttribute('data-page');
                const currentPage = document.body.getAttribute('data-page-id');
                
                // If it's the current page, prevent default and just highlight
                if (pageId === currentPage) {
                    e.preventDefault();
                    this.highlightCurrentPageNav();
                    
                    // Show a toast notification that we're already on this page
                    PageIdentifier.showPageInfo(pageId);
                }
                // Otherwise, the link will navigate naturally
            });
        });
        
        // Highlight the current page in navigation
        this.highlightCurrentPageNav();
    },
    
    highlightCurrentPageNav() {
        const currentPage = document.body.getAttribute('data-page-id');
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const pageId = item.getAttribute('data-page');
            
            if (pageId === currentPage) {
                item.classList.add('active');
                
                // If it's in the sidebar, ensure the sidebar is visible on mobile
                const sidebar = item.closest('.sidebar');
                if (sidebar && window.matchMedia('(max-width: 768px)').matches) {
                    sidebar.classList.add('expanded');
                }
            } else {
                item.classList.remove('active');
            }
        });
    },

    animateElement(element, keyframes, options) {
        if (element && typeof element.animate === 'function') {
            return element.animate(keyframes, options);
        }
        return null;
    }
};

/**
 * CoachConversationManager - Handles creation and management of coach conversations
 */
const CoachConversationManager = {
    // UI Elements
    elements: {
        btn: null,
        modal: null,
        closeBtn: null,
        cancelBtn: null,
        startBtn: null,
        trainerTabs: null,
        nameInput: null
    },

    // State
    state: {
        selectedType: '',
        selectedIcon: '',
        selectedTitle: '',
        coachName: ''
    },

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.elements.btn = document.getElementById('newConversationBtn');
        this.elements.modal = document.getElementById('newConversationModal');
        this.elements.closeBtn = document.querySelector('.close-modal');
        this.elements.cancelBtn = document.getElementById('cancelNewConversation');
        this.elements.startBtn = document.getElementById('startNewConversation');
        this.elements.trainerTabs = document.querySelectorAll('.modal .trainer-tab');
        this.elements.nameInput = document.getElementById('coachName');
    },

    bindEvents() {
        // Open modal when "New Conversation" button is clicked
        if (this.elements.btn && this.elements.modal) {
            this.elements.btn.addEventListener('click', () => this.openModal());
        }
        
        // Close modal events
        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.elements.cancelBtn) {
            this.elements.cancelBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.elements.modal) {
            this.elements.modal.addEventListener('click', (event) => {
                if (event.target === this.elements.modal) {
                    this.closeModal();
                }
            });
            
            // Handle ESC key to close modal
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.elements.modal.classList.contains('active')) {
                    this.closeModal();
                }
            });
        }
        
        // Handle coach name input
        if (this.elements.nameInput) {
            this.elements.nameInput.addEventListener('input', () => {
                this.state.coachName = this.elements.nameInput.value.trim();
                this.updateStartButtonState();
            });
        }
        
        // Handle trainer tab selection
        if (this.elements.trainerTabs.length > 0) {
            this.elements.trainerTabs.forEach(tab => {
                // Mouse click
                tab.addEventListener('click', () => this.selectTrainerTab(tab));
                
                // Keyboard navigation
                tab.addEventListener('keydown', (event) => {
                    // Enter or Space key
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        this.selectTrainerTab(tab);
                    }
                });
            });
        }
        
        // Handle start new conversation
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startNewConversation());
            
            // Allow Enter key on button
            this.elements.startBtn.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !this.elements.startBtn.disabled) {
                    this.startNewConversation();
                }
            });
        }
    },

    openModal() {
        // Store the element that had focus before opening the modal
        this.previouslyFocused = document.activeElement;
        
        // Show the modal
        this.elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        
        // Reset selection
        this.resetSelections();
        
        // Set focus to the name input for accessibility
        setTimeout(() => {
            if (this.elements.nameInput) {
                this.elements.nameInput.focus();
            }
        }, 100);
    },

    closeModal() {
        this.elements.modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Return focus to the element that had focus before the modal was opened
        if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
            this.previouslyFocused.focus();
        }
    },

    resetSelections() {
        this.elements.trainerTabs.forEach(tab => {
            tab.classList.remove('selected');
            tab.setAttribute('aria-pressed', 'false');
        });
        this.state.selectedType = '';
        this.state.selectedIcon = '';
        this.state.selectedTitle = '';
        this.state.coachName = '';
        
        if (this.elements.nameInput) {
            this.elements.nameInput.value = '';
        }
        
        this.elements.startBtn.disabled = true;
        this.elements.startBtn.classList.add('disabled');
    },

    updateStartButtonState() {
        const canEnable = this.state.selectedType && 
                        this.elements.nameInput && 
                        this.elements.nameInput.value.trim();
                        
        if (canEnable) {
            this.elements.startBtn.disabled = false;
            this.elements.startBtn.classList.remove('disabled');
            this.elements.startBtn.setAttribute('aria-disabled', 'false');
            
            // Add a pulse animation to the start button
            UIManager.animateElement(this.elements.startBtn, [
                { transform: 'scale(1)' },
                { transform: 'scale(1.05)' },
                { transform: 'scale(1)' }
            ], {
                duration: 500,
                easing: 'ease-out'
            });
        } else {
            this.elements.startBtn.disabled = true;
            this.elements.startBtn.classList.add('disabled');
            this.elements.startBtn.setAttribute('aria-disabled', 'true');
        }
    },

    selectTrainerTab(tab) {
        // Remove selected class from all tabs
        this.elements.trainerTabs.forEach(t => {
            t.classList.remove('selected');
            t.setAttribute('aria-pressed', 'false');
        });
        
        // Add selected class to clicked tab
        tab.classList.add('selected');
        tab.setAttribute('aria-pressed', 'true');
        
        // Store selected trainer info
        this.state.selectedType = tab.getAttribute('data-trainer');
        this.state.selectedIcon = tab.querySelector('i').className;
        this.state.selectedTitle = tab.querySelector('span').textContent;
        
        // Check if we can enable the start button
        this.updateStartButtonState();
    },

    startNewConversation() {
        // Validate inputs
        if (!this.state.selectedType || !this.state.coachName) return;
        
        // Get coach name from input
        this.state.coachName = this.elements.nameInput.value.trim();
        
        // Close the modal
        this.closeModal();
        
        // Update the UI with the new conversation
        this.updateChatHeader();
        this.addToConversationHistory();
        this.clearChatAndAddWelcomeMessage();
    },

    updateChatHeader() {
        const chatAvatar = document.querySelector('.chat-header .chat-avatar i');
        const chatTitle = document.querySelector('.chat-title');
        
        if (!chatAvatar || !chatTitle) return;
        
        // Clear previous classes from avatar
        chatAvatar.className = '';
        
        // Add new icon class based on selection
        let trainerTitle = '';
        switch(this.state.selectedType) {
            case 'mental':
                chatAvatar.className = 'fas fa-brain';
                trainerTitle = 'Mental Coach';
                break;
            case 'physical':
                chatAvatar.className = 'fas fa-dumbbell';
                trainerTitle = 'Physical Coach';
                break;
            case 'development':
                chatAvatar.className = 'fas fa-book';
                trainerTitle = 'Self-Development Guru';
                break;
        }
        
        // Set the title with the coach name
        chatTitle.textContent = `${this.state.coachName} - ${trainerTitle}`;
        
        // Animate the title change
        UIManager.animateElement(chatTitle, [
            { opacity: 0, transform: 'translateY(-10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
        
        // Animate the avatar change
        UIManager.animateElement(chatAvatar, [
            { transform: 'scale(0)' },
            { transform: 'scale(1.2)' },
            { transform: 'scale(1)' }
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
    },

    addToConversationHistory() {
        const chatHistoryList = document.querySelector('.chat-history-list');
        if (!chatHistoryList) return;
        
        // Remove active class from all existing chats
        const existingChats = chatHistoryList.querySelectorAll('.chat-history-item');
        existingChats.forEach(chat => chat.classList.remove('active'));
        
        // Create new history item
        const newChatItem = this.createHistoryItem();
        
        // Add click event to the new chat item
        this.addClickHandlerToHistoryItem(newChatItem);
        
        // Add the new chat at the beginning of the list (after the "New Conversation" button)
        const newConversationBtn = chatHistoryList.querySelector('.new-conversation');
        if (newConversationBtn) {
            chatHistoryList.insertBefore(newChatItem, newConversationBtn.nextSibling);
        } else {
            chatHistoryList.prepend(newChatItem);
        }
        
        // Apply animation to new chat item
        UIManager.animateElement(newChatItem, [
            { opacity: 0, transform: 'translateY(-10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
    },

    createHistoryItem() {
        // Create new history item
        const newChatItem = document.createElement('div');
        newChatItem.classList.add('chat-history-item', 'active');
        
        // Create avatar container
        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('chat-avatar');
        
        // Create avatar icon
        const avatarIcon = document.createElement('i');
        avatarIcon.className = document.querySelector('.chat-header .chat-avatar i').className;
        avatarContainer.appendChild(avatarIcon);
        
        // Create chat info container
        const chatInfo = document.createElement('div');
        chatInfo.classList.add('chat-info');
        
        // Create title
        const chatName = document.createElement('h4');
        chatName.textContent = this.state.coachName;
        chatInfo.appendChild(chatName);
        
        // Add last message info
        const lastMessage = document.createElement('p');
        lastMessage.textContent = 'New conversation';
        chatInfo.appendChild(lastMessage);
        
        // Create time info
        const timeInfo = document.createElement('div');
        timeInfo.classList.add('chat-time');
        timeInfo.textContent = 'Just now';
        
        // Add all elements to the chat item
        newChatItem.appendChild(avatarContainer);
        newChatItem.appendChild(chatInfo);
        newChatItem.appendChild(timeInfo);
        
        return newChatItem;
    },

    addClickHandlerToHistoryItem(historyItem) {
        const chatHistoryList = document.querySelector('.chat-history-list');
        const chatAvatar = document.querySelector('.chat-header .chat-avatar i');
        const chatTitle = document.querySelector('.chat-title');
        
        historyItem.addEventListener('click', () => {
            // Handle chat selection (deselect others, select this)
            const allChatItems = chatHistoryList.querySelectorAll('.chat-history-item');
            allChatItems.forEach(item => item.classList.remove('active'));
            historyItem.classList.add('active');
            
            // Update chat header
            if (chatAvatar && chatTitle) {
                const avatarIcon = historyItem.querySelector('.chat-avatar i');
                chatAvatar.className = avatarIcon.className;
                
                // Get trainer title based on icon
                let trainerTitle = 'Coach';
                if (avatarIcon.className.includes('fa-brain')) {
                    trainerTitle = 'Mental Coach';
                } else if (avatarIcon.className.includes('fa-dumbbell')) {
                    trainerTitle = 'Physical Coach';
                } else if (avatarIcon.className.includes('fa-book')) {
                    trainerTitle = 'Self-Development Guru';
                }
                
                chatTitle.textContent = `${historyItem.querySelector('h4').textContent} - ${trainerTitle}`;
            }
            
            // On mobile, close the sidebar after selection
            if (window.matchMedia('(max-width: 768px)').matches) {
                const chatHistorySidebar = document.querySelector('.chat-history-sidebar');
                if (chatHistorySidebar) {
                    chatHistorySidebar.classList.remove('expanded');
                }
            }
        });
    },

    clearChatAndAddWelcomeMessage() {
        const chatBody = document.querySelector('.chat-body');
        if (!chatBody) return;
        
        chatBody.innerHTML = '';
        
        // Add welcome message based on trainer type
        let welcomeMessage = '';
        switch(this.state.selectedType) {
            case 'mental':
                welcomeMessage = `Hi there! I'm ${this.state.coachName}, your Mental Coach. How can I help with your mental well-being today?`;
                break;
            case 'physical':
                welcomeMessage = `Hello! I'm ${this.state.coachName}, your Physical Coach. Ready to work on your fitness goals today?`;
                break;
            case 'development':
                welcomeMessage = `Welcome! I'm ${this.state.coachName}, your Self-Development Guru. How can I help you grow and achieve your goals?`;
                break;
        }
        
        // Add the message with a slight delay for better UX
        setTimeout(() => {
            ChatManager.addMessage(welcomeMessage, 'incoming');
        }, 300);
    }
};

/**
 * ChatManager - Handles chat messages and interactions
 */
const ChatManager = {
    elements: {
        chatForm: null,
        chatInput: null,
        chatBody: null
    },

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initChatAnimations();
    },

    cacheElements() {
        this.elements.chatForm = document.querySelector('.chat-input');
        this.elements.chatInput = document.querySelector('.chat-input input');
        this.elements.chatBody = document.querySelector('.chat-body');
    },

    bindEvents() {
        if (this.elements.chatForm && this.elements.chatInput && this.elements.chatBody) {
            this.elements.chatForm.addEventListener('submit', (event) => {
                event.preventDefault();
                
                const message = this.elements.chatInput.value.trim();
                if (!message) return;
                
                // Add user message to chat
                this.addMessage(message, 'outgoing');
                
                // Clear input
                this.elements.chatInput.value = '';
                
                // Simulate AI response
                this.simulateAIResponse();
            });
        }
    },

    addMessage(text, type) {
        if (!this.elements.chatBody) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', type);
        
        const messageP = document.createElement('p');
        messageP.textContent = text;
        
        messageDiv.appendChild(messageP);
        this.elements.chatBody.appendChild(messageDiv);
        
        // Scroll to bottom
        this.elements.chatBody.scrollTop = this.elements.chatBody.scrollHeight;
        
        // Apply animations for list items if they exist
        this.applyListItemAnimations();
    },

    simulateAIResponse() {
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        this.elements.chatBody.appendChild(typingIndicator);
        
        // Scroll to bottom
        this.elements.chatBody.scrollTop = this.elements.chatBody.scrollHeight;
        
        // Simulate delay for response
        setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add AI response
            const responses = [
                "I understand. Let's work on that together.",
                "That's a great question. Based on your goals, I would suggest...",
                "I've analyzed your patterns and have some recommendations for you.",
                "Let me help you with that. Have you considered trying this approach?",
                "Based on your progress, I think you're ready for the next step."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage(randomResponse, 'incoming');
        }, 1500);
    },

    initChatAnimations() {
        if (!this.elements.chatBody) return;
        
        // Apply animations initially
        this.applyListItemAnimations();
        
        // Observe for new messages
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    this.applyListItemAnimations();
                    
                    // Scroll to bottom on new message
                    this.elements.chatBody.scrollTop = this.elements.chatBody.scrollHeight;
                    
                    // Add subtle pulse to new message
                    const newMessages = Array.from(mutation.addedNodes).filter(
                        node => node.nodeType === 1 && node.classList.contains('chat-message')
                    );
                    
                    newMessages.forEach(message => {
                        UIManager.animateElement(message, [
                            { transform: 'scale(0.95)', opacity: 0.7 },
                            { transform: 'scale(1)', opacity: 1 }
                        ], {
                            duration: 300,
                            easing: 'ease-out'
                        });
                    });
                }
            });
        });
        
        observer.observe(this.elements.chatBody, { childList: true });
    },

    applyListItemAnimations() {
        const chatMessages = document.querySelectorAll('.chat-message');
        
        chatMessages.forEach(message => {
            const listItems = message.querySelectorAll('li');
            
            listItems.forEach((item, index) => {
                item.style.setProperty('--index', index);
            });
        });
    }
};

/**
 * SettingsManager - Handles user settings and preferences
 */
const SettingsManager = {
    init() {
        this.initToggleSwitches();
        this.initLogoutButton();
    },

    initToggleSwitches() {
        const toggleSwitches = document.querySelectorAll('.toggle-switch input');
        
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const toggleId = this.id;
                
                switch(toggleId) {
                    case 'darkModeToggle':
                        // In a real app, this would toggle dark/light mode
                        console.log('Dark mode:', this.checked);
                        break;
                        
                    case 'notificationsToggle':
                        // In a real app, this would enable/disable notifications
                        console.log('Notifications:', this.checked);
                        break;
                        
                    case 'soundToggle':
                        // In a real app, this would enable/disable sound
                        console.log('Sound:', this.checked);
                        break;
                }
            });
        });
    },

    initLogoutButton() {
        const logoutBtn = document.querySelector('.logout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                // In a real app, this would log the user out
                console.log('Logout requested');
                
                // For demo purposes, redirect to home page
                window.location.href = '/index.html';
            });
        }
    }
}; 