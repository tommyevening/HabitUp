// HabbitUp - Authentication JS

// Define these functions in the global scope so they can be accessed by other files
let showAuthModal;
let switchPanel;
let closeModal;

document.addEventListener('DOMContentLoaded', function() {
    // Get auth modal elements
    const authModal = document.getElementById('authModal');
    const loginPanel = document.getElementById('loginPanel');
    const registerPanel = document.getElementById('registerPanel');
    const closeAuthModal = document.getElementById('closeAuthModal');
    
    // Get login and register buttons
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const heroRegisterBtn = document.getElementById('hero-register-btn');
    
    // Get panel switching links
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    // Handle opening the auth modal with login panel
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showAuthModal('login');
        });
    }
    
    // Handle opening the auth modal with register panel
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            showAuthModal('register');
        });
    }
    
    // Handle hero register button
    if (heroRegisterBtn) {
        heroRegisterBtn.addEventListener('click', function() {
            showAuthModal('register');
        });
    }
    
    // Handle panel switching
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchPanel('register');
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchPanel('login');
        });
    }
    
    // Handle closing the modal
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', closeModal);
    }
    
    // Close modal if clicking outside the modal content
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                closeModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authModal && authModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Show auth modal function
    showAuthModal = function(type) {
        if (!authModal) return;
        
        console.log('Showing auth modal:', type);
        
        // Show correct panel
        if (type === 'login') {
            loginPanel.style.display = 'block';
            registerPanel.style.display = 'none';
        } else {
            loginPanel.style.display = 'none';
            registerPanel.style.display = 'block';
        }
        
        // First, ensure any scroll position doesn't affect centering
        window.scrollTo(0, 0);
        
        // Get or create the auth modal container
        let container = authModal.querySelector('.auth-modal-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'auth-modal-container';
            
            // Move the modal content inside this container
            const modalContent = authModal.querySelector('.modal-content');
            if (modalContent) {
                if (modalContent.parentNode !== container) {
                    // Only move if not already in container
                    modalContent.parentNode.removeChild(modalContent);
                    container.appendChild(modalContent);
                    authModal.appendChild(container);
                }
            }
        }
        
        // Force styles to ensure centering
        document.body.style.overflow = 'hidden';
        authModal.classList.add('active');
        
        // Apply direct positioning after a very small delay to ensure browser has applied other styles
        setTimeout(() => {
            // Reset any computed styles that might interfere
            authModal.style.display = 'flex';
            authModal.style.alignItems = 'center';
            authModal.style.justifyContent = 'center';
            
            container.style.position = 'absolute';
            container.style.top = '50%';
            container.style.left = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.margin = '0';
            container.style.padding = '0';
            
            const modalContent = container.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.margin = '0';
                modalContent.style.position = 'relative';
                modalContent.style.transform = 'none';
            }
        }, 10);
    }
    
    // Switch between login and register panels
    switchPanel = function(type) {
        if (type === 'login') {
            loginPanel.style.display = 'block';
            registerPanel.style.display = 'none';
        } else {
            loginPanel.style.display = 'none';
            registerPanel.style.display = 'block';
        }
    }
    
    // Close modal function
    closeModal = function() {
        if (authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    }
    
    // Social login buttons
    const googleButtons = document.querySelectorAll('.btn-google');
    const facebookButtons = document.querySelectorAll('.btn-facebook');
    
    googleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Implement Google authentication
            console.log('Google authentication clicked');
            // Redirect to OAuth endpoint - to be implemented
            // window.location.href = '/oauth2/authorization/google';
            
            // For demo purposes - show a notification
            showNotification('Google authentication would be triggered', 'info');
        });
    });
    
    facebookButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Implement Facebook authentication
            console.log('Facebook authentication clicked');
            // Redirect to OAuth endpoint - to be implemented
            // window.location.href = '/oauth2/authorization/facebook';
            
            // For demo purposes - show a notification
            showNotification('Facebook authentication would be triggered', 'info');
        });
    });
    
    // Form submission handling
    const authForms = document.querySelectorAll('.auth-form');
    
    authForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            console.log('Form submission:', formDataObj);
            
            // Validate form - very basic validation
            if (validateForm(form)) {
                // Form is valid, submit data
                // For demo purposes - show a notification
                const isLogin = form.closest('#loginPanel') !== null;
                const message = isLogin ? 'Login successful!' : 'Account created successfully!';
                
                showNotification(message, 'success');
                
                // Close the modal
                closeModal();
                
                // Simulate successful login state
                updateUIAfterAuth(isLogin ? formDataObj.email : formDataObj.regEmail);
            }
        });
    });
    
    // Update UI after successful authentication
    function updateUIAfterAuth(email) {
        // This function would update the UI to reflect logged-in state
        // For demo purposes, we'll just show a welcome message
        setTimeout(() => {
            showNotification(`Welcome back, ${email}!`, 'success');
            
            // For a real implementation, you would:
            // 1. Hide login/register buttons
            // 2. Show user profile or avatar
            // 3. Enable restricted features
            
            // For demo, update the nav-auth section if it exists
            const navAuth = document.querySelector('.nav-auth');
            if (navAuth) {
                navAuth.innerHTML = `
                    <div class="user-profile">
                        <span class="user-email">${email}</span>
                        <button id="logout-btn" class="btn btn-text">Logout</button>
                    </div>
                `;
                
                // Add logout functionality
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', function() {
                        // Reset to original state
                        navAuth.innerHTML = `
                            <button id="login-btn" class="btn btn-secondary">Log In</button>
                            <button id="register-btn" class="btn btn-primary">Sign Up</button>
                        `;
                        
                        // Reconnect event listeners to the new buttons
                        const newLoginBtn = document.getElementById('login-btn');
                        const newRegisterBtn = document.getElementById('register-btn');
                        
                        if (newLoginBtn) {
                            newLoginBtn.addEventListener('click', function() {
                                showAuthModal('login');
                            });
                        }
                        
                        if (newRegisterBtn) {
                            newRegisterBtn.addEventListener('click', function() {
                                showAuthModal('register');
                            });
                        }
                        
                        showNotification('You have been logged out', 'info');
                    });
                }
            }
        }, 1000);
    }
    
    // Basic form validation
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        
        // Remove existing error messages
        const existingErrors = form.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showInputError(input, 'This field is required');
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                isValid = false;
                showInputError(input, 'Please enter a valid email');
            } else if (input.id === 'confirmPassword') {
                const password = form.querySelector('#regPassword');
                if (password && input.value !== password.value) {
                    isValid = false;
                    showInputError(input, 'Passwords do not match');
                }
            }
        });
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function showInputError(input, message) {
        const parent = input.parentElement;
        const error = document.createElement('div');
        error.classList.add('form-error');
        error.textContent = message;
        parent.appendChild(error);
    }
    
    // Notification toast
    function showNotification(message, type = 'info') {
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.classList.add('notification-container');
            document.body.appendChild(notificationContainer);
            
            // Add basic styles for notification
            const style = document.createElement('style');
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                }
                
                .notification {
                    background-color: var(--dark-surface-2);
                    color: var(--text-primary);
                    border-radius: var(--radius);
                    padding: 15px 20px;
                    margin-bottom: 10px;
                    box-shadow: var(--shadow);
                    animation: fadeIn 0.3s;
                    min-width: 280px;
                }
                
                .notification.success {
                    border-left: 4px solid #4CAF50;
                }
                
                .notification.error {
                    border-left: 4px solid #F44336;
                }
                
                .notification.info {
                    border-left: 4px solid #2196F3;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Remove after timeout
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}); 