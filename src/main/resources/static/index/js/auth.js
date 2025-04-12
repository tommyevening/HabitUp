// HabbitUp - Authentication JS

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
        if (e.key === 'Escape' && authModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    /**
     * Shows the authentication modal with specified panel type
     * 
     * @param {string} type - The type of panel to show ('login' or 'register')
     * @returns {void}
     */
    function showAuthModal(type) {
        if (!authModal) return;
        
        // Show correct panel
        if (type === 'login') {
            loginPanel.style.display = 'block';
            registerPanel.style.display = 'none';
        } else {
            loginPanel.style.display = 'none';
            registerPanel.style.display = 'block';
        }
        
        // Show modal
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    /**
     * Switches between login and register panels within the auth modal
     * 
     * @param {string} type - The type of panel to switch to ('login' or 'register')
     * @returns {void}
     */
    function switchPanel(type) {
        if (type === 'login') {
            loginPanel.style.display = 'block';
            registerPanel.style.display = 'none';
        } else {
            loginPanel.style.display = 'none';
            registerPanel.style.display = 'block';
        }
    }
    
    /**
     * Closes the authentication modal
     * 
     * @returns {void}
     */
    function closeModal() {
        authModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
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
    
    /**
     * Updates the UI to reflect logged-in state after successful authentication
     * 
     * @param {string} email - The email of the authenticated user
     * @returns {void}
     */
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
    
    /**
     * Validates a form and shows error messages for invalid fields
     * 
     * @param {HTMLFormElement} form - The form element to validate
     * @returns {boolean} True if the form is valid, false otherwise
     */
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
    
    /**
     * Shows an error message for an input field
     * 
     * @param {HTMLInputElement} input - The input element with the error
     * @param {string} message - The error message to display
     * @returns {void}
     */
    function showInputError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        const parent = input.parentElement;
        parent.appendChild(errorElement);
        
        input.classList.add('error');
        
        // Remove error when input changes
        input.addEventListener('input', function() {
            input.classList.remove('error');
            const error = parent.querySelector('.form-error');
            if (error) error.remove();
        });
    }
    
    /**
     * Validates an email address format
     * 
     * @param {string} email - The email address to validate
     * @returns {boolean} True if the email is valid, false otherwise
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Shows a notification message
     * 
     * @param {string} message - The message to display
     * @param {string} type - The type of notification ('success', 'error', 'info')
     * @returns {void}
     */
    function showNotification(message, type = 'info') {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        notification.appendChild(closeBtn);
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fadeOut');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}); 