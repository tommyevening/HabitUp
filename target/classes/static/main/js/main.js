// Global variables
let chatBody;
let conversations = {}; // Store chat conversations for each coach
let currentCoachId = null; // Track the currently active coach

// Force clear localStorage on load to fix existing issues
localStorage.removeItem('habbitUpConversations');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Main.js - DOM Content Loaded");
    
    // Initialize cursor follower
    initCursorFollower();
    
    // Initialize smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize skill bars animation
    initSkillBars();
    
    // Initialize animated content
    initAnimations();
    
    // Initialize existing coaches by loading conversation data from files
    initExistingCoaches();
    
    // Initialize chat functionality
    initChat();
    
    // Initialize coach creation functionality
    initCoachCreation();
    
    // Initialize insights charts
    initInsightsCharts();
    
    // Initialize trend charts
    initTrendCharts();
    
    // Add direct click handlers for all chat history items
    setupDirectChatHistoryListeners();
});

// Execute immediate modal function for testing
console.log("Main.js loaded - running immediate functions");

// Immediately check for the createCoachBtn
(function() {
    console.log("Immediate function running");
    setTimeout(() => {
        const createCoachBtn = document.getElementById('createCoachBtn');
        const createCoachModal = document.getElementById('createCoachModal');
        
        console.log("Immediate check for elements:", {
            createCoachBtn: createCoachBtn,
            createCoachModal: createCoachModal
        });
        
        if (createCoachBtn && createCoachModal) {
            console.log("Elements found, adding immediate event listener");
            createCoachBtn.addEventListener('click', function() {
                console.log("Immediate listener - button clicked");
                createCoachModal.style.display = 'flex';
                setTimeout(() => {
                    createCoachModal.classList.add('active');
                }, 10);
            });
        }
    }, 500); // Small delay to ensure DOM is processed
})();

// Custom cursor follower
function initCursorFollower() {
    const cursor = document.querySelector('.cursor-follower');
    
    // Show cursor when mouse enters the document
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    // Hide cursor when mouse leaves the document
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        
        // Check if cursor is over a button or link
        const targetElement = e.target;
        if (targetElement.tagName === 'A' || 
            targetElement.tagName === 'BUTTON' || 
            targetElement.closest('a') || 
            targetElement.closest('button') ||
            targetElement.classList.contains('notification-popup') ||
            targetElement.closest('.notification-popup')) {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1.5)`;
            cursor.style.borderColor = 'var(--accent-secondary)';
        } else {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1)`;
            cursor.style.borderColor = 'var(--accent-primary)';
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Update active link in navigation
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Scroll to the target element
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
}

// Mobile menu toggle functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Skill bars animation with IntersectionObserver
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                progressBar.style.width = `${progress}%`;
                // Unobserve after animation is triggered
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Animations for content sections
function initAnimations() {
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.section-title, .about-card, .project-card, .contact-method');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.8s ease forwards';
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        // Reset initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
    
    // Show notification popup after a delay
    setTimeout(() => {
        const notification = document.querySelector('.notification-popup');
        if (notification) {
            notification.classList.add('show');
        }
    }, 3000);
}

// Initialize existing coaches and their conversations
async function initExistingCoaches() {
    console.log('Initializing existing coaches...');
    const chatHistoryItems = document.querySelectorAll('.chat-history-item');
    console.log(`Found ${chatHistoryItems.length} existing chat history items`);
    
    // First try to load from localStorage (for persistent conversations)
    const storedData = loadCoachDataFromStorage();
    if (storedData) {
        console.log('Loaded stored conversations from localStorage:', storedData);
        conversations = storedData;
        
        // Attach data-coach-id attributes and event listeners to existing chat items
        chatHistoryItems.forEach((item, index) => {
            const coachId = `existing-coach-${index}`;
            if (conversations[coachId]) {
                item.setAttribute('data-coach-id', coachId);
                
                // Update UI elements if needed
                const nameElement = item.querySelector('.chat-info h4');
                const avatarElement = item.querySelector('.chat-avatar i');
                
                if (nameElement && conversations[coachId].name) {
                    nameElement.textContent = conversations[coachId].name;
                }
                
                if (avatarElement && conversations[coachId].avatar) {
                    avatarElement.className = conversations[coachId].avatar;
                }
                
                // Add click event listener
                item.addEventListener('click', async function() {
                    console.log(`Clicked on coach: ${coachId}`);
                    document.querySelectorAll('.chat-history-item').forEach(i => 
                        i.classList.remove('active'));
                    this.classList.add('active');
                    currentCoachId = coachId;
                    await displayConversation(coachId);
                });
            }
        });
        
        // Set first coach as active if none is already active
        if (!currentCoachId && chatHistoryItems.length > 0) {
            const firstCoachId = chatHistoryItems[0].getAttribute('data-coach-id');
            if (firstCoachId) {
                currentCoachId = firstCoachId;
                chatHistoryItems[0].classList.add('active');
                displayConversation(currentCoachId);
            }
        }
        
        return; // Skip the rest of initialization if we loaded from localStorage
    }
    
    // If localStorage data isn't available, load from JSON files
    const coachFileMappings = [
        { index: 0, file: 'mental-training.json' },
        { index: 1, file: 'physical-training.json' },
        { index: 2, file: 'self-development.json' }
    ];
    
    // Load all coach data files
    for (const mapping of coachFileMappings) {
        const chatItem = chatHistoryItems[mapping.index];
        if (!chatItem) continue;
        
        try {
            // Load coach data from file
            const coachData = await loadCoachData(mapping.file);
            const coachId = `existing-coach-${mapping.index}`;
            
            if (coachData) {
                // Store conversation data
                conversations[coachId] = {
                    name: coachData.name,
                    avatar: coachData.avatar,
                    messages: coachData.messages || []
                };
                
                console.log(`Loaded conversation for ${coachId} from file:`, conversations[coachId]);
                
                // Update coach info in the UI if needed
                const nameElement = chatItem.querySelector('.chat-info h4');
                const avatarElement = chatItem.querySelector('.chat-avatar i');
                
                if (nameElement && coachData.name) {
                    nameElement.textContent = coachData.name;
                }
                
                if (avatarElement && coachData.avatar) {
                    avatarElement.className = coachData.avatar;
                }
            } else {
                console.warn(`Failed to load data for coach ${mapping.index}, using defaults`);
                // Create default conversation as fallback
                const coachName = chatItem.querySelector('.chat-info h4').textContent;
                const avatarEl = chatItem.querySelector('.chat-avatar i');
                const avatar = avatarEl ? avatarEl.className : 'fas fa-user';
                
                conversations[coachId] = {
                    name: coachName,
                    avatar: avatar,
                    messages: [
                        {
                            type: "incoming",
                            content: `Hi there! I'm your ${coachName}. How can I help you today?`
                        }
                    ]
                };
            }
            
            // Set data attribute for identification
            chatItem.setAttribute('data-coach-id', coachId);
            
            // Add click event listener
            chatItem.addEventListener('click', async function() {
                console.log(`Clicked on coach: ${coachId}`);
                // Remove active class from all items
                document.querySelectorAll('.chat-history-item').forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Set as current coach and display their conversation
                currentCoachId = coachId;
                await displayConversation(coachId);
            });
        } catch (error) {
            console.error(`Error loading coach data for index ${mapping.index}:`, error);
        }
    }
    
    // Set the first coach as active by default
    if (chatHistoryItems.length > 0) {
        const firstCoachId = chatHistoryItems[0].getAttribute('data-coach-id');
        if (firstCoachId) {
            currentCoachId = firstCoachId;
            chatHistoryItems[0].classList.add('active');
            console.log(`Setting initial active coach: ${currentCoachId}`);
            await displayConversation(currentCoachId);
        }
    }
    
    // Save initial conversations to localStorage
    saveCoachData();
    
    console.log('All coaches initialized with conversations:', conversations);
}

// Load coach data from a JSON file
async function loadCoachData(filename) {
    try {
        console.log(`Loading coach data from file: ${filename}`);
        const response = await fetch(`/main/data/chats/${filename}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Successfully loaded data from ${filename}:`, data);
        return data;
    } catch (error) {
        console.error(`Error loading coach data from ${filename}:`, error);
        return null;
    }
}

// Save coach data to localStorage (temporary solution before server implementation)
function saveCoachData() {
    try {
        localStorage.setItem('habbitUpConversations', JSON.stringify(conversations));
        console.log('Saved conversations to localStorage');
        return true;
    } catch (error) {
        console.error('Error saving coach data:', error);
        return false;
    }
}

// Load coach data from localStorage (temporary solution before server implementation)
function loadCoachDataFromStorage() {
    try {
        const data = localStorage.getItem('habbitUpConversations');
        if (data) {
            const parsed = JSON.parse(data);
            console.log('Loaded conversations from localStorage');
            return parsed;
        }
        return null;
    } catch (error) {
        console.error('Error loading coach data from storage:', error);
        return null;
    }
}

// Chat functionality
function initChat() {
    const chatContainer = document.querySelector('.main-chat');
    
    if (chatContainer) {
        chatBody = chatContainer.querySelector('.chat-body');
        const chatForm = chatContainer.querySelector('.chat-input');
        
        if (chatForm) {
            // Listen for form submission
            chatForm.addEventListener('submit', handleChatInput);
        }
    }
}

// Display the conversation for a specific coach
async function displayConversation(coachId) {
    console.log(`Displaying conversation for coach: ${coachId}`);
    
    // Get coach type from coachId
    let coachFileName = null;
    if (coachId === 'existing-coach-0') {
        coachFileName = 'mental-training.json';
    } else if (coachId === 'existing-coach-1') {
        coachFileName = 'physical-training.json';
    } else if (coachId === 'existing-coach-2') {
        coachFileName = 'self-development.json';
    }
    
    // If conversation doesn't exist yet, try loading it
    if (!conversations[coachId] && coachFileName) {
        console.log(`Conversation not found, attempting to load from ${coachFileName}`);
        try {
            const coachData = await loadCoachData(coachFileName);
            if (coachData) {
                conversations[coachId] = {
                    name: coachData.name,
                    avatar: coachData.avatar,
                    messages: coachData.messages || []
                };
                saveCoachData(); // Save to localStorage for future sessions
                console.log(`Successfully loaded data for ${coachId} from ${coachFileName}`);
            } else {
                console.error(`Failed to load data for ${coachId} from ${coachFileName}`);
                return;
            }
        } catch (error) {
            console.error(`Error loading coach data:`, error);
            return;
        }
    }
    
    // Check again if conversation exists
    if (!conversations[coachId]) {
        console.error(`Conversation not found for coach ID: ${coachId}`);
        return;
    }
    
    // Get coach data
    const coach = conversations[coachId];
    console.log('Coach data:', coach);
    
    // Update chat header
    const chatTitle = document.querySelector('.chat-header .chat-title');
    const chatAvatar = document.querySelector('.chat-header .chat-avatar i');
    
    if (chatTitle) chatTitle.textContent = coach.name;
    if (chatAvatar) chatAvatar.className = coach.avatar;
    
    // Clear chat body
    if (chatBody) {
        console.log('Clearing chat body and loading messages');
        // Add a loading indicator
        chatBody.classList.add('loading');
        chatBody.innerHTML = '';
        
        // Add all messages to the chat
        if (coach.messages && coach.messages.length > 0) {
            coach.messages.forEach(message => {
                addMessageToUI(message.content, message.type, coach.avatar);
            });
        } else {
            console.log('No messages found for this coach');
            // Add a default welcome message
            addMessageToUI(`Hi there! I'm your ${coach.name}. How can I help you today?`, 'incoming', coach.avatar);
        }
        
        // Remove loading indicator
        setTimeout(() => {
            chatBody.classList.remove('loading');
        }, 300);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    } else {
        console.error('Chat body element not found');
    }
}

// Add new message to the conversation
function addMessageToConversation(coachId, content, type) {
    if (!conversations[coachId]) {
        console.error(`Conversation ${coachId} not found`);
        return;
    }
    
    // Add message to stored conversation
    conversations[coachId].messages.push({
        type: type,
        content: content
    });
    
    // Save updated conversations to localStorage
    saveCoachData();
    
    // If this is the active conversation, also add to UI
    if (coachId === currentCoachId) {
        const avatar = conversations[coachId].avatar;
        addMessageToUI(content, type, avatar);
    }
}

// Add a message to the UI
function addMessageToUI(content, type, avatar) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', type);
    
    if (type === 'incoming') {
        // Add avatar for incoming messages
        const messageAvatar = document.createElement('span');
        messageAvatar.className = 'message-avatar';
        const avatarIcon = document.createElement('i');
        avatarIcon.className = avatar;
        messageAvatar.appendChild(avatarIcon);
        messageDiv.appendChild(messageAvatar);
    }
    
    const messageP = document.createElement('p');
    messageP.textContent = content;
    
    messageDiv.appendChild(messageP);
    chatBody.appendChild(messageDiv);
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Handle chat input
function handleChatInput(event) {
    event.preventDefault();
    const chatInput = event.target.querySelector('input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Find active coach index
    const activeCoach = document.querySelector('.chat-history-item.active');
    if (!activeCoach) return;
    
    const index = Array.from(document.querySelectorAll('.chat-history-item')).indexOf(activeCoach);
    console.log(`Adding message to coach index: ${index}`);
    
    // Get coach ID
    const coachId = activeCoach.getAttribute('data-coach-id');
    if (!coachId) return;
    
    // Add user message to UI
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'outgoing');
    const userMessageP = document.createElement('p');
    userMessageP.textContent = message;
    userMessageDiv.appendChild(userMessageP);
    chatBody.appendChild(userMessageDiv);
    
    // Store the message in conversations
    if (conversations[coachId]) {
        conversations[coachId].messages.push({
            type: 'outgoing',
            content: message
        });
    }
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Simulate AI response
    simulateAIResponse(index);
}

// Simulate AI response
function simulateAIResponse(coachIndex) {
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatBody.appendChild(typingIndicator);
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Determine coach type for tailored responses
    let responseSet;
    switch(coachIndex) {
        case 0: // Mental Training
            responseSet = [
                "I understand how stress can affect your mental well-being. Let's practice some mindfulness techniques together.",
                "Your mind needs regular exercise just like your body. Let's develop a mental fitness routine for you.",
                "Remember that thoughts are just thoughts - they don't define you. Let's work on developing a healthier relationship with your thinking patterns.",
                "Mindfulness is about being present without judgment. Let's try a quick grounding exercise right now.",
                "Sleep and mental health are deeply connected. Would you like to work on improving your sleep quality?"
            ];
            break;
        case 1: // Physical Training
            responseSet = [
                "Great progress! Remember that consistency is more important than intensity when starting a fitness routine.",
                "Form is crucial for preventing injuries. Let's make sure you're doing these exercises correctly.",
                "Recovery is just as important as the workout itself. Are you giving your muscles enough time to heal?",
                "Stay hydrated! Drinking enough water significantly impacts your workout performance.",
                "Let's adjust your workout plan based on your progress. What felt challenging this week?"
            ];
            break;
        case 2: // Self Development
            responseSet = [
                "Setting clear, specific goals is the first step toward personal growth. Let's define what success looks like for you.",
                "Creating small, sustainable habits is more effective than making dramatic changes. What small step can you take today?",
                "Self-reflection is powerful. What did you learn about yourself this week?",
                "Your environment significantly impacts your behaviors. How can we optimize your surroundings for success?",
                "Remember that progress isn't linear. Setbacks are normal and part of the growth process."
            ];
            break;
        default:
            responseSet = [
                "I understand. Let's work on that together.",
                "That's a great question. Based on your goals, I would suggest...",
                "I've analyzed your patterns and have some recommendations for you.",
                "Let me help you with that. Have you considered trying this approach?",
                "Based on your progress, I think you're ready for the next step."
            ];
    }
    
    // Get the appropriate coach ID
    const coachId = `existing-coach-${coachIndex}`;
    
    // Simulate delay for response
    setTimeout(() => {
        // Remove typing indicator
        typingIndicator.remove();
        
        // Get a random response
        const randomResponse = responseSet[Math.floor(Math.random() * responseSet.length)];
        
        // Add the response to UI
        const coachAvatar = conversations[coachId]?.avatar || 
                           document.querySelector(`.chat-history-item:nth-child(${coachIndex + 1}) .chat-avatar i`)?.className ||
                           'fas fa-user';
        
        const responseDiv = document.createElement('div');
        responseDiv.classList.add('chat-message', 'incoming');
        
        const messageAvatar = document.createElement('span');
        messageAvatar.className = 'message-avatar';
        const avatarIcon = document.createElement('i');
        avatarIcon.className = coachAvatar;
        messageAvatar.appendChild(avatarIcon);
        responseDiv.appendChild(messageAvatar);
        
        const messageP = document.createElement('p');
        messageP.textContent = randomResponse;
        responseDiv.appendChild(messageP);
        
        chatBody.appendChild(responseDiv);
        
        // Store the response in conversations
        if (conversations[coachId]) {
            conversations[coachId].messages.push({
                type: 'incoming',
                content: randomResponse
            });
        }
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
        
    }, 1500);
}

// Coach creation functionality
function initCoachCreation() {
    console.log('Initializing coach creation functionality');
    const createCoachBtn = document.getElementById('createCoachBtn');
    const createCoachModal = document.getElementById('createCoachModal');
    const closeCoachModal = document.getElementById('closeCoachModal');
    
    console.log('createCoachBtn:', createCoachBtn);
    console.log('createCoachModal:', createCoachModal);
    console.log('closeCoachModal:', closeCoachModal);
    
    const coachCreationForm = document.querySelector('.coach-creation-form');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const coachTypeOptions = document.querySelectorAll('input[name="coachType"]');
    
    // Step navigation elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const prevStepBtn = document.getElementById('prevStepBtn');
    
    console.log('Step elements - step1:', step1, 'step2:', step2, 'nextStepBtn:', nextStepBtn, 'prevStepBtn:', prevStepBtn);
    
    // Show coach creation modal
    if (createCoachBtn && createCoachModal) {
        console.log('Adding click event listener to createCoachBtn');
        createCoachBtn.addEventListener('click', () => {
            console.log('Create Coach button clicked!');
            // Reset to step 1 whenever modal is opened
            if (step1 && step2) {
                step1.style.display = 'block';
                step2.style.display = 'none';
            }
            
            createCoachModal.style.display = 'flex';
            setTimeout(() => {
                createCoachModal.classList.add('active');
            }, 10);
        });
    }
    
    // Close coach creation modal
    if (closeCoachModal && createCoachModal) {
        closeCoachModal.addEventListener('click', () => {
            createCoachModal.classList.remove('active');
            setTimeout(() => {
                createCoachModal.style.display = 'none';
            }, 300);
        });
        
        // Close modal when clicking outside
        createCoachModal.addEventListener('click', (e) => {
            if (e.target === createCoachModal) {
                createCoachModal.classList.remove('active');
                setTimeout(() => {
                    createCoachModal.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Step navigation
    if (nextStepBtn && prevStepBtn && step1 && step2) {
        // Go to step 2
        nextStepBtn.addEventListener('click', () => {
            const coachName = document.getElementById('coachName').value.trim();
            
            // Validate step 1
            if (!coachName) {
                highlightInvalidField('coachName');
                return;
            }
            
            step1.classList.add('step-exit');
            setTimeout(() => {
                step1.style.display = 'none';
                step1.classList.remove('step-exit');
                step2.style.display = 'block';
                step2.classList.add('step-enter');
                setTimeout(() => {
                    step2.classList.remove('step-enter');
                }, 300);
            }, 200);
        });
        
        // Go back to step 1
        prevStepBtn.addEventListener('click', () => {
            step2.classList.add('step-exit');
            setTimeout(() => {
                step2.style.display = 'none';
                step2.classList.remove('step-exit');
                step1.style.display = 'block';
                step1.classList.add('step-enter');
                setTimeout(() => {
                    step1.classList.remove('step-enter');
                }, 300);
            }, 200);
            });
    }
    
    // Handle avatar selection
    if (avatarOptions.length > 0) {
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }
    
    // Handle form submission
    if (coachCreationForm) {
        coachCreationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const coachName = document.getElementById('coachName').value.trim();
            const personalDescription = document.getElementById('personalDescription').value.trim();
            const coachType = document.querySelector('input[name="coachType"]:checked').id;
            const coachAvatar = document.querySelector('.avatar-option.selected i').className;
            
            // Validate form
            if (!personalDescription) {
                highlightInvalidField('personalDescription');
                return;
            }
            
            // Create new coach (in real app, this would make an API call)
            await createNewCoach({
                name: coachName,
                type: coachType,
                description: personalDescription,
                avatar: coachAvatar
            });
            
            // Close modal
            createCoachModal.classList.remove('active');
            setTimeout(() => {
                createCoachModal.style.display = 'none';
                // Reset form
                coachCreationForm.reset();
            }, 300);
        });
    }
}

// Highlight invalid field with a red border
function highlightInvalidField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('invalid');
        field.focus();
        
        field.addEventListener('input', function removeInvalid() {
            field.classList.remove('invalid');
            field.removeEventListener('input', removeInvalid);
        });
    }
}

// Initialize insights charts
function initInsightsCharts() {
    const weeklyProgressChart = document.getElementById('weeklyProgressChart');
    
    if (weeklyProgressChart) {
        const ctx = weeklyProgressChart.getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Mindfulness Minutes',
                    data: [15, 25, 20, 30, 22, 35, 28],
                    borderColor: 'rgba(56, 178, 172, 1)',
                    backgroundColor: 'rgba(56, 178, 172, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(56, 178, 172, 0.3)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(226, 232, 240, 0.1)'
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                        display: false
                    },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6,
                        backgroundColor: 'rgba(56, 178, 172, 1)'
                    }
                }
            }
        });
    }
}

// Update active navigation link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// HabbitUp - Main Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggling
    const chatHistorySidebar = document.querySelector('.chat-history-sidebar');
    const insightsSidebar = document.querySelector('.insights-sidebar');
    const toggleChatHistoryBtn = document.getElementById('toggleChatHistory');
    const toggleInsightsSidebarBtn = document.getElementById('toggleInsightsSidebar');
    const toggleInsightsBtn = document.getElementById('toggleInsightsBtn');
    const expandChatBtn = document.getElementById('expandChatBtn');
    const mainLayout = document.querySelector('.main-layout');
    
    // Daily recommendations elements
    const toggleRecommendationsBtn = document.getElementById('toggleRecommendationsBtn');
    const dailyRecommendations = document.getElementById('dailyRecommendations');
    const closeRecommendations = document.getElementById('closeRecommendations');
    
    // Recommendations toggle
    if (toggleRecommendationsBtn && dailyRecommendations) {
        toggleRecommendationsBtn.addEventListener('click', function() {
            dailyRecommendations.classList.toggle('visible');
            
            // Close insights sidebar if open
            if (insightsSidebar && insightsSidebar.classList.contains('expanded')) {
                insightsSidebar.classList.remove('expanded');
                const overlay = document.getElementById('overlay');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
    }
    
    // Close recommendations
    if (closeRecommendations && dailyRecommendations) {
        closeRecommendations.addEventListener('click', function() {
            dailyRecommendations.classList.remove('visible');
        });
    }
    
    // Close recommendations when clicking elsewhere
    document.addEventListener('click', function(event) {
        if (dailyRecommendations && dailyRecommendations.classList.contains('visible')) {
            if (!dailyRecommendations.contains(event.target) && 
                event.target !== toggleRecommendationsBtn &&
                !toggleRecommendationsBtn.contains(event.target)) {
                dailyRecommendations.classList.remove('visible');
            }
        }
    });
    
    if (toggleChatHistoryBtn) {
        toggleChatHistoryBtn.addEventListener('click', function() {
            chatHistorySidebar.classList.toggle('expanded');
        });
    }
    
    // Toggle right insights sidebar
    if (toggleInsightsBtn) {
        toggleInsightsBtn.addEventListener('click', function() {
            insightsSidebar.classList.toggle('expanded');
            const overlay = document.getElementById('overlay');
            if (overlay) {
                overlay.classList.toggle('active');
            }
            
            // Close recommendations if open
            if (dailyRecommendations && dailyRecommendations.classList.contains('visible')) {
                dailyRecommendations.classList.remove('visible');
            }
        });
    }
    
    if (toggleInsightsSidebarBtn) {
        toggleInsightsSidebarBtn.addEventListener('click', function() {
            insightsSidebar.classList.toggle('expanded');
            const overlay = document.getElementById('overlay');
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }
    
    // Fullscreen button handler
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            toggleFullscreenChat();
        });
        
        // Add keyboard shortcut (Esc) to toggle fullscreen
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                toggleFullscreenChat();
            }
        });
    }
    
    // Function to toggle fullscreen chat mode
    function toggleFullscreenChat() {
        mainLayout.classList.toggle('fullscreen-chat');
        // Change icon based on state
        const icon = fullscreenBtn.querySelector('i');
        if (icon) {
            if (mainLayout.classList.contains('fullscreen-chat')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        }
        
        // Force scroll to bottom of chat after toggling
        const chatBody = document.querySelector('.chat-body');
        if (chatBody) {
            setTimeout(() => {
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 50);
        }
    }
    
    // For mobile - close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
        if (!isSmallScreen) return;
        
        // Close left sidebar if click is outside
        if (chatHistorySidebar && chatHistorySidebar.classList.contains('expanded')) {
            if (!chatHistorySidebar.contains(event.target) && event.target !== toggleChatHistoryBtn) {
                chatHistorySidebar.classList.remove('expanded');
            }
        }
        
        // Close right sidebar if click is outside
        if (insightsSidebar && insightsSidebar.classList.contains('expanded')) {
            if (!insightsSidebar.contains(event.target) && 
                event.target !== toggleInsightsBtn && 
                event.target !== toggleInsightsSidebarBtn &&
                !toggleInsightsBtn.contains(event.target) &&
                !toggleInsightsSidebarBtn.contains(event.target)) {
                insightsSidebar.classList.remove('expanded');
                const overlay = document.getElementById('overlay');
                if (overlay) {
                    overlay.classList.remove('active');
                    }
                }
            }
        });
    
    // Toggle switches
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
});

// Add a new coach to the chat history list
async function createNewCoach(coachData) {
    console.log('Creating new coach with data:', coachData);
    
    try {
        // Get the chat history list container
        const chatHistoryList = document.querySelector('.chat-history-list');
        
        if (!chatHistoryList) {
            console.error('Chat history list container not found');
            return false;
        }
        
        // Create unique coach ID
        const coachId = `coach-${Date.now()}`;
        
        // Initialize conversation for this coach
        conversations[coachId] = {
            name: coachData.name,
            avatar: coachData.avatar,
            coachType: coachData.type,
            messages: [
                {
                    type: 'incoming',
                    content: `Hello! I'm your new ${getCoachTypeLabel(coachData.type)}. How can I help you today?`
                }
            ]
        };
        
        // Create the HTML structure for the new coach
        const coachElement = document.createElement('div');
        coachElement.className = 'chat-history-item';
        coachElement.setAttribute('data-coach-id', coachId);
        
        // Build the HTML structure
        coachElement.innerHTML = `
            <div class="chat-avatar">
                <i class="${coachData.avatar}"></i>
            </div>
            <div class="chat-info">
                <h4>${coachData.name}</h4>
                <p>New coach created</p>
            </div>
            <div class="chat-time">Just now</div>
        `;
        
        // Add click event to make the coach selectable
        coachElement.addEventListener('click', async function() {
            // Remove active class from all items
            document.querySelectorAll('.chat-history-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to this item
            this.classList.add('active');
            
            // Set as current coach and display conversation
            currentCoachId = coachId;
            await displayConversation(coachId);
            
            // On mobile, close the sidebar
            if (window.matchMedia('(max-width: 768px)').matches) {
                const chatHistorySidebar = document.querySelector('.chat-history-sidebar');
                if (chatHistorySidebar) {
                    chatHistorySidebar.classList.remove('expanded');
                }
            }
        });
        
        // Insert the new coach at the beginning of the chat history list
        chatHistoryList.insertBefore(coachElement, chatHistoryList.firstChild);
        
        // Immediately set this as the active coach
        document.querySelectorAll('.chat-history-item').forEach(item => {
            item.classList.remove('active');
        });
        coachElement.classList.add('active');
        currentCoachId = coachId;
        await displayConversation(coachId);
        
        // Save updated coach data
        saveCoachData();
        
        console.log('Coach successfully created and added to chat history');
        return true;
    } catch (error) {
        console.error('Error creating new coach:', error);
        return false;
    }
}

// Helper function to get readable coach type label
function getCoachTypeLabel(coachTypeId) {
    switch(coachTypeId) {
        case 'habitStrategist':
            return 'Habit Strategist';
        case 'mindsetArchitect': 
            return 'Mindset Architect';
        case 'successEngineer':
            return 'Success Engineer';
        default:
            return 'Coach';
    }
}

// Obsługa zamykania panelu przez kliknięcie na overlay
const overlay = document.getElementById('overlay');
if (overlay) {
    overlay.addEventListener('click', function() {
        if (insightsSidebar && insightsSidebar.classList.contains('expanded')) {
            insightsSidebar.classList.remove('expanded');
            overlay.classList.remove('active');
        }
    });
}

// Initialize trend charts
function initTrendCharts() {
    // Funkcja pomocnicza do tworzenia wykresów trendu
    function createTrendChart(canvasId, isPositive, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 100);
        
        if (isPositive) {
            gradient.addColorStop(0, 'rgba(56, 178, 172, 0.3)');
            gradient.addColorStop(1, 'rgba(56, 178, 172, 0.05)');
            var borderColor = 'rgba(56, 178, 172, 1)';
        } else {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
            var borderColor = 'rgba(239, 68, 68, 1)';
        }
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Tydzień 1', 'Tydzień 2', 'Tydzień 3', 'Tydzień 4'],
                datasets: [{
                    label: 'Trend',
                    data: data,
                    borderColor: borderColor,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: borderColor,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        padding: 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(226, 232, 240, 0.1)'
                        },
                        ticks: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 2,
                        hoverRadius: 4
                    }
                    }
                }
            });
    }
    
    // Pozytywne trendy
    createTrendChart('regularityChart', true, [3, 5, 7, 8]);
    createTrendChart('sleepQualityChart', true, [4, 5, 6, 7]);
    createTrendChart('affirmationsChart', true, [1, 3, 5, 8]);
    
    // Negatywne trendy
    createTrendChart('procrastinationChart', false, [2, 4, 6, 8]);
    createTrendChart('selfTalkChart', false, [3, 4, 6, 5]);
}

// Add direct click handlers to chat history items
function setupDirectChatHistoryListeners() {
    console.log("Setting up direct chat history click listeners");
    const chatHistoryItems = document.querySelectorAll('.chat-history-item');
    
    chatHistoryItems.forEach((item, index) => {
        // Ensure each item has a coach ID attribute
        const coachId = item.getAttribute('data-coach-id') || `existing-coach-${index}`;
        
        if (!item.getAttribute('data-coach-id')) {
            item.setAttribute('data-coach-id', coachId);
        }
        
        // Attach a direct click handler
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Direct click on coach: ${coachId}`);
            
            // Remove active class from all items
            document.querySelectorAll('.chat-history-item').forEach(i => 
                i.classList.remove('active'));
            
            // Add active class to this item
            this.classList.add('active');
            
            // Force load the correct chat
            switchToChat(index);
        });
    });
}

// Switch to a specific chat by index
async function switchToChat(index) {
    console.log(`Przełączanie na czat o indeksie: ${index}`);
    
    // Mapa trenerów do ich plików
    const coaches = [
        { name: "Mental Training", file: "mental-training.json", icon: "fas fa-brain" },
        { name: "Physical Training", file: "physical-training.json", icon: "fas fa-dumbbell" },
        { name: "Self Development", file: "self-development.json", icon: "fas fa-book" }
    ];
    
    if (index >= coaches.length) {
        console.error(`Nieprawidłowy indeks czatu: ${index}`);
        return;
    }
    
    const coach = coaches[index];
    console.log(`Przełączanie na trenera: ${coach.name}, plik: ${coach.file}`);
    
    try {
        // Ustaw jako aktualnego trenera
        currentCoachId = `existing-coach-${index}`;
        window.currentCoachIndex = index;
        
        // Załaduj dane czatu 
        await loadChatDirectly(coach.file, coach.name, coach.icon);
        
    } catch (error) {
        console.error(`Błąd przełączania na czat ${index}:`, error);
    }
}

// Update the chat UI with the given coach data
function updateChatUI(coachData) {
    console.log('Updating chat UI with coach data:', coachData);
    
    // Update chat header
    const chatTitle = document.querySelector('.chat-header .chat-title');
    const chatAvatar = document.querySelector('.chat-header .chat-avatar i');
    
    if (chatTitle) chatTitle.textContent = coachData.name;
    if (chatAvatar) chatAvatar.className = coachData.avatar;
    
    // Clear and update chat body
    if (chatBody) {
        console.log('Clearing chat body and loading messages');
        chatBody.innerHTML = '';
        
        // Add all messages to the chat
        if (coachData.messages && coachData.messages.length > 0) {
            coachData.messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('chat-message', message.type);
                
                if (message.type === 'incoming') {
                    // Add avatar for incoming messages
                    const messageAvatar = document.createElement('span');
                    messageAvatar.className = 'message-avatar';
                    const avatarIcon = document.createElement('i');
                    avatarIcon.className = coachData.avatar;
                    messageAvatar.appendChild(avatarIcon);
                    messageDiv.appendChild(messageAvatar);
                }
                
                const messageP = document.createElement('p');
                messageP.textContent = message.content;
                
                messageDiv.appendChild(messageP);
                chatBody.appendChild(messageDiv);
            });
        } else {
            // Add a default welcome message
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', 'incoming');
            
            const messageAvatar = document.createElement('span');
            messageAvatar.className = 'message-avatar';
            const avatarIcon = document.createElement('i');
            avatarIcon.className = coachData.avatar;
            messageAvatar.appendChild(avatarIcon);
            messageDiv.appendChild(messageAvatar);
            
            const messageP = document.createElement('p');
            messageP.textContent = `Hi there! I'm your ${coachData.name}. How can I help you today?`;
            
            messageDiv.appendChild(messageP);
            chatBody.appendChild(messageDiv);
        }
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    } else {
        console.error('Chat body element not found');
    }
}

// Dodanie prostych event listenerów do wszystkich czatów
document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicjalizacja prostych listenerów czatu");
    
    // Pobierz referencję do obszaru czatu
    chatBody = document.querySelector('.chat-body');
    
    // Dodaj nasłuchiwanie na formularz czatu
    const chatForm = document.querySelector('.chat-input');
    if (chatForm) {
        chatForm.addEventListener('submit', handleSimpleChatInput);
    }
    
    // Dodaj proste listenery do wszystkich trenerów
    setupSimpleChatSwitching();
    
    // Wyświetl informacje diagnostyczne o plikach JSON
    logJSONFileLocations();
});

// Wyświetla informacje diagnostyczne o lokalizacji plików JSON
function logJSONFileLocations() {
    console.log("Diagnostyka lokalizacji plików JSON:");
    console.log("Lokalizacja aplikacji:", window.location.href);
    console.log("Ścieżka bazowa dokumentu:", document.baseURI);
    console.log("Ścieżka do skryptu:", document.currentScript?.src || 'Nieznana');
    
    // Sprawdź dostęp do folderów
    checkResourceExists('/main');
    checkResourceExists('/main/data');
    checkResourceExists('/main/data/chats');
    checkResourceExists('/static/main/data/chats');
    
    // Sprawdź dostęp do poszczególnych plików JSON
    checkResourceExists('/main/data/chats/mental-training.json');
    checkResourceExists('/main/data/chats/physical-training.json');
    checkResourceExists('/main/data/chats/self-development.json');
    checkResourceExists('/static/main/data/chats/mental-training.json');
}

// Sprawdza czy zasób istnieje
function checkResourceExists(path) {
    fetch(path)
        .then(response => {
            console.log(`Zasób ${path}: ${response.ok ? 'ISTNIEJE' : 'NIE ISTNIEJE'} (status: ${response.status})`);
        })
        .catch(error => {
            console.log(`Zasób ${path}: BŁĄD (${error.message})`);
        });
}

// Proste przełączanie pomiędzy czatami
function setupSimpleChatSwitching() {
    const coaches = [
        { name: "Mental Training", file: "mental-training.json", icon: "fas fa-brain" },
        { name: "Physical Training", file: "physical-training.json", icon: "fas fa-dumbbell" },
        { name: "Self Development", file: "self-development.json", icon: "fas fa-book" }
    ];
    
    // Pobierz wszystkie elementy trenerów
    const coachItems = document.querySelectorAll('.chat-history-item');
    
    // Dodaj listenery kliknięć
    coachItems.forEach((item, index) => {
        if (index >= coaches.length) return;
        
        item.addEventListener('click', function() {
            // Usuń klasę active ze wszystkich elementów
            coachItems.forEach(i => i.classList.remove('active'));
            
            // Dodaj klasę active do klikniętego elementu
            this.classList.add('active');
            
            // Załaduj odpowiedni czat
            loadChatDirectly(coaches[index].file, coaches[index].name, coaches[index].icon);
        });
    });
    
    // Załaduj domyślny czat (pierwszy)
    loadChatDirectly(coaches[0].file, coaches[0].name, coaches[0].icon);
}

// Bezpośrednio załaduj dane czatu z pliku JSON
async function loadChatDirectly(filename, coachName, coachIcon) {
    console.log(`Ładowanie danych czatu z: ${filename}`);
    
    // Pokaż loader
    if (chatBody) {
        chatBody.innerHTML = '<div class="chat-loading">Ładowanie konwersacji...</div>';
    }
    
    try {
        // Aktualizuj nagłówek czatu
        const chatTitle = document.querySelector('.chat-header .chat-title');
        const chatAvatar = document.querySelector('.chat-header .chat-avatar i');
        
        if (chatTitle) chatTitle.textContent = coachName;
        if (chatAvatar) chatAvatar.className = coachIcon;
        
        // Spróbuj załadować dane z pliku JSON
        let data = null;
        
        // Wypróbuj kilka różnych ścieżek do plików JSON
        const possiblePaths = [
            `/main/data/chats/${filename}`,
            `/static/main/data/chats/${filename}`,
            `../data/chats/${filename}`,
            `./data/chats/${filename}`,
            `/data/chats/${filename}`
        ];
        
        let loadedPath = null;
        let loadError = null;
        
        // Próbuj załadować plik z różnych ścieżek
        for (const path of possiblePaths) {
            try {
                console.log(`Próba ładowania z: ${path}`);
                const response = await fetch(path);
                
                // Loguj pełne informacje o odpowiedzi
                console.log(`Odpowiedź dla ${path}:`, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Array.from(response.headers.entries()),
                    ok: response.ok
                });
                
                if (response.ok) {
                    data = await response.json();
                    console.log(`Pomyślnie załadowano dane z ${path}:`, data);
                    loadedPath = path;
                    break;
                }
            } catch (pathError) {
                console.warn(`Błąd podczas ładowania z ${path}:`, pathError);
                loadError = pathError;
            }
        }
        
        // Loguj informację o wyniku prób ładowania
        if (loadedPath) {
            console.log(`✅ Udało się załadować plik z: ${loadedPath}`);
        } else {
            console.warn(`❌ Nie udało się załadować pliku ${filename} z żadnej ścieżki:`, loadError);
            console.log('Używam danych domyślnych');
        }
        
        // Jeśli nie udało się załadować danych, użyj domyślnych
        if (!data) {
            data = getDefaultCoachData(coachName, coachIcon);
            
            // Spróbuj zapisać domyślne dane do localStorage, aby nie próbować
            // ponownie ładować plików, które nie istnieją
            try {
                const key = `coach_${coachName.replace(/\s+/g, '_').toLowerCase()}`;
                localStorage.setItem(key, JSON.stringify(data));
                console.log(`Zapisano domyślne dane dla ${coachName} w localStorage jako ${key}`);
            } catch (storageError) {
                console.warn('Nie udało się zapisać danych do localStorage:', storageError);
            }
        }
        
        // Wyczyść i zaktualizuj obszar czatu
        if (chatBody) {
            chatBody.innerHTML = '';
            
            // Dodaj wszystkie wiadomości do czatu
            if (data.messages && data.messages.length > 0) {
                data.messages.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('chat-message', message.type);
                    
                    if (message.type === 'incoming') {
                        const messageAvatar = document.createElement('span');
                        messageAvatar.className = 'message-avatar';
                        const avatarIcon = document.createElement('i');
                        avatarIcon.className = data.avatar || coachIcon;
                        messageAvatar.appendChild(avatarIcon);
                        messageDiv.appendChild(messageAvatar);
                    }
                    
                    const messageP = document.createElement('p');
                    messageP.textContent = message.content;
                    
                    messageDiv.appendChild(messageP);
                    chatBody.appendChild(messageDiv);
                });
            } else {
                // Dodaj domyślną wiadomość powitalną
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('chat-message', 'incoming');
                
                const messageAvatar = document.createElement('span');
                messageAvatar.className = 'message-avatar';
                const avatarIcon = document.createElement('i');
                avatarIcon.className = data.avatar || coachIcon;
                messageAvatar.appendChild(avatarIcon);
                messageDiv.appendChild(messageAvatar);
                
                const messageP = document.createElement('p');
                messageP.textContent = `Cześć! Jestem twoim trenerem ${coachName}. W czym mogę pomóc?`;
                
                messageDiv.appendChild(messageP);
                chatBody.appendChild(messageDiv);
            }
            
            // Przewiń na dół
            chatBody.scrollTop = chatBody.scrollHeight;
        }
        
        // Zapisz ID aktualnego trenera aby obsłużyć formularz
        window.currentCoachIndex = getCoachIndex(coachName);
        
    } catch (error) {
        console.error('Błąd podczas przetwarzania danych czatu:', error);
        
        // Pokaż błąd w czacie
        if (chatBody) {
            chatBody.innerHTML = `
                <div class="chat-message error">
                    <p>Przepraszamy, wystąpił błąd podczas ładowania konwersacji. Spróbuj odświeżyć stronę.</p>
                    <p class="error-details">Szczegóły błędu: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Zwraca domyślne dane dla trenera
function getDefaultCoachData(coachName, coachIcon) {
    let messages = [];
    
    // Wybierz komunikaty w zależności od typu trenera
    if (coachName === "Mental Training") {
        messages = [
            {
                type: "incoming",
                content: "Cześć! Jestem twoim trenerem Mental Training. Jak mogę ci pomóc dzisiaj?"
            },
            {
                type: "outgoing",
                content: "Ostatnio czuję się zestresowany. Czy możesz zaproponować jakieś techniki relaksacyjne?"
            },
            {
                type: "incoming",
                content: "Oczywiście! Spróbuj techniki oddychania 4-7-8: wdech przez nos na 4, zatrzymaj oddech na 7, wydech przez usta na 8. Powtórz 4 razy. To świetna metoda na natychmiastowe zmniejszenie stresu."
            }
        ];
    } 
    else if (coachName === "Physical Training") {
        messages = [
            {
                type: "incoming",
                content: "Witaj! Jestem twoim trenerem Physical Training. Jak mogę pomóc ci z twoimi celami fitness?"
            },
            {
                type: "outgoing",
                content: "Chcę zacząć regularnie ćwiczyć, ale nie mam dużo czasu. Co proponujesz?"
            },
            {
                type: "incoming",
                content: "Krótkie, intensywne treningi HIIT są idealne dla osób z napiętym grafikiem! Zacznij od 20-minutowego treningu 3 razy w tygodniu. Możesz wykonywać ćwiczenia takie jak przysiady, pompki, burpees i mountain climbers - 30 sekund ćwiczenia, 30 sekund odpoczynku."
            }
        ];
    }
    else if (coachName === "Self Development") {
        messages = [
            {
                type: "incoming",
                content: "Cześć! Jestem twoim trenerem Self Development. Jak mogę pomóc ci w rozwoju osobistym?"
            },
            {
                type: "outgoing",
                content: "Chciałbym poprawić swoją produktywność. Masz jakieś sugestie?"
            },
            {
                type: "incoming",
                content: "Polecam technikę Pomodoro - pracuj skoncentrowany przez 25 minut, następnie zrób 5-minutową przerwę. Po 4 takich cyklach zrób dłuższą przerwę. To pomaga utrzymać skupienie i zapobiega wypaleniu. Warto też planować dzień wieczorem, wyznaczając 3 najważniejsze zadania na następny dzień."
            }
        ];
    } 
    else {
        messages = [
            {
                type: "incoming",
                content: `Cześć! Jestem twoim trenerem ${coachName}. W czym mogę ci pomóc?`
            }
        ];
    }
    
    return {
        name: coachName,
        avatar: coachIcon,
        messages: messages
    };
}

// Zwraca indeks trenera na podstawie nazwy
function getCoachIndex(coachName) {
    switch(coachName) {
        case "Mental Training": return 0;
        case "Physical Training": return 1;
        case "Self Development": return 2;
        default: return 0;
    }
}

// Prosta obsługa formularza czatu
function handleSimpleChatInput(event) {
    event.preventDefault();
    
    // Pobierz wiadomość z formularza
    const chatInput = event.target.querySelector('input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Dodaj wiadomość użytkownika do czatu
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'outgoing');
    const userMessageP = document.createElement('p');
    userMessageP.textContent = message;
    userMessageDiv.appendChild(userMessageP);
    chatBody.appendChild(userMessageDiv);
    
    // Wyczyść pole formularza
    chatInput.value = '';
    
    // Przewiń na dół
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Symuluj odpowiedź trenera
    simulateSimpleResponse(window.currentCoachIndex || 0);
}

// Symuluj prostą odpowiedź
function simulateSimpleResponse(coachIndex) {
    // Pokaż wskaźnik pisania
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatBody.appendChild(typingIndicator);
    
    // Przewiń na dół
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Znajdź aktywnego trenera
    const activeCoach = document.querySelector('.chat-history-item.active');
    const coachNameElement = activeCoach ? activeCoach.querySelector('.chat-info h4') : null;
    const coachName = coachNameElement ? coachNameElement.textContent : 'Trener';
    
    const coachIconElement = activeCoach ? activeCoach.querySelector('.chat-avatar i') : null;
    const coachIcon = coachIconElement ? coachIconElement.className : 'fas fa-user';
    
    // Określ zestaw odpowiedzi w zależności od typu trenera
    let responseSet;
    switch(coachIndex) {
        case 0: // Mental Training
            responseSet = [
                "Rozumiem jak stres może wpływać na Twoje samopoczucie. Popracujmy wspólnie nad technikami uważności.",
                "Twój umysł potrzebuje regularnych ćwiczeń, podobnie jak ciało. Opracujmy rutynę mentalną dla Ciebie.",
                "Pamiętaj, że myśli to tylko myśli - nie definiują Cię. Skupmy się na rozwijaniu zdrowszej relacji z Twoimi wzorcami myślowymi.",
                "Uważność to bycie obecnym bez osądzania. Spróbujmy teraz krótkiego ćwiczenia uziemiającego.",
                "Sen i zdrowie psychiczne są głęboko powiązane. Chcesz popracować nad poprawą jakości snu?"
            ];
            break;
        case 1: // Physical Training
            responseSet = [
                "Świetny postęp! Pamiętaj, że przy rozpoczynaniu rutyny fitness konsekwencja jest ważniejsza niż intensywność.",
                "Forma jest kluczowa dla zapobiegania kontuzjom. Upewnijmy się, że wykonujesz te ćwiczenia poprawnie.",
                "Regeneracja jest równie ważna jak sam trening. Czy dajesz swoim mięśniom wystarczająco dużo czasu na regenerację?",
                "Nawadniaj się! Picie wystarczającej ilości wody znacząco wpływa na wydajność treningu.",
                "Dostosujmy Twój plan treningowy na podstawie postępów. Co było wyzwaniem w tym tygodniu?"
            ];
            break;
        case 2: // Self Development
            responseSet = [
                "Ustalenie jasnych, konkretnych celów to pierwszy krok w kierunku rozwoju osobistego. Zdefiniujmy, jak wygląda dla Ciebie sukces.",
                "Tworzenie małych, zrównoważonych nawyków jest skuteczniejsze niż wprowadzanie drastycznych zmian. Jaki mały krok możesz dziś podjąć?",
                "Autorefleksja jest potężna. Czego dowiedziałeś się o sobie w tym tygodniu?",
                "Twoje otoczenie znacząco wpływa na Twoje zachowania. Jak możemy zoptymalizować Twoje otoczenie dla sukcesu?",
                "Pamiętaj, że postęp nie jest liniowy. Porażki są normalne i stanowią część procesu rozwoju."
            ];
            break;
        default:
            responseSet = [
                "Rozumiem. Popracujmy nad tym razem.",
                "To dobre pytanie. Na podstawie Twoich celów, sugerowałbym...",
                "Przeanalizowałem Twoje wzorce i mam dla Ciebie kilka rekomendacji.",
                "Pozwól, że Ci pomogę. Czy rozważałeś to podejście?",
                "Na podstawie Twoich postępów, myślę że jesteś gotowy na następny krok."
            ];
    }
    
    // Symuluj opóźnienie odpowiedzi
    setTimeout(() => {
        // Usuń wskaźnik pisania
        typingIndicator.remove();
        
        // Wybierz losową odpowiedź
        const randomResponse = responseSet[Math.floor(Math.random() * responseSet.length)];
        
        // Dodaj odpowiedź do UI
        const responseDiv = document.createElement('div');
        responseDiv.classList.add('chat-message', 'incoming');
        
        const messageAvatar = document.createElement('span');
        messageAvatar.className = 'message-avatar';
        const avatarIcon = document.createElement('i');
        avatarIcon.className = coachIcon;
        messageAvatar.appendChild(avatarIcon);
        responseDiv.appendChild(messageAvatar);
        
        const messageP = document.createElement('p');
        messageP.textContent = randomResponse;
        responseDiv.appendChild(messageP);
        
        chatBody.appendChild(responseDiv);
        
        // Przewiń na dół
        chatBody.scrollTop = chatBody.scrollHeight;
        
    }, 1500);
} 