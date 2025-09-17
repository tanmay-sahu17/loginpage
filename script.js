// DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Validation patterns
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load saved email if remember me was checked
    loadSavedCredentials();
    
    // Add event listeners
    setupEventListeners();
    
    // Add floating labels effect
    setupFloatingLabels();
});

function setupEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    passwordInput.addEventListener('blur', validatePassword);
    
    // Password toggle
    togglePasswordBtn.addEventListener('click', togglePassword);
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
    
    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', handleForgotPassword);
    
    // Sign up link
    document.querySelector('.signup-link a').addEventListener('click', handleSignUp);
}

function setupFloatingLabels() {
    const inputs = [emailInput, passwordInput];
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

function validateEmail(showError = true) {
    const email = emailInput.value.trim();
    const isValid = emailPattern.test(email);
    
    if (showError) {
        if (!email) {
            emailError.textContent = 'Email is required';
            emailInput.classList.add('error');
        } else if (!isValid) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('error');
        }
    }
    
    return isValid && email;
}

function validatePassword(showError = true) {
    const password = passwordInput.value;
    const isValid = password.length >= 6; // Simplified validation for demo
    
    if (showError) {
        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordInput.classList.add('error');
        } else if (!isValid) {
            passwordError.textContent = 'Password must be at least 6 characters long';
            passwordInput.classList.add('error');
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('error');
        }
    }
    
    return isValid && password;
}

function togglePassword() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = togglePasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
        shakeForm();
        return;
    }
    
    // Show loading state
    showLoading(true);
    
    try {
        // Simulate API call
        await simulateLogin();
        
        // Save credentials if remember me is checked
        handleRememberMe();
        
        // Show success message
        showSuccess();
        
    } catch (error) {
        showError('Login failed. Please check your credentials and try again.');
    } finally {
        showLoading(false);
    }
}

function simulateLogin() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Simple demo validation
            if (email === 'demo@example.com' && password === 'password123') {
                resolve({ success: true, user: { email: email } });
            } else if (email && password) {
                // For demo purposes, accept any valid email/password combination
                resolve({ success: true, user: { email: email } });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1500); // Simulate network delay
    });
}

function handleRememberMe() {
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value.trim());
    } else {
        localStorage.removeItem('rememberedEmail');
    }
}

function loadSavedCredentials() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
        emailInput.parentElement.classList.add('focused');
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

function showSuccess() {
    // Create success message if it doesn't exist
    let successMessage = document.querySelector('.success-message');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '✓ Login successful! Redirecting...';
        loginForm.insertBefore(successMessage, loginForm.firstChild);
    }
    
    successMessage.classList.add('show');
    
    // Simulate redirect after 2 seconds
    setTimeout(() => {
        successMessage.textContent = '✓ Welcome! You have been successfully logged in.';
    }, 2000);
}

function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-banner');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error banner
    const errorBanner = document.createElement('div');
    errorBanner.className = 'error-banner';
    errorBanner.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #f5c6cb;
        margin-bottom: 20px;
        text-align: center;
        font-size: 0.9rem;
        animation: slideDown 0.3s ease-out;
    `;
    errorBanner.textContent = message;
    
    loginForm.insertBefore(errorBanner, loginForm.firstChild);
    
    // Remove error banner after 5 seconds
    setTimeout(() => {
        if (errorBanner.parentNode) {
            errorBanner.remove();
        }
    }, 5000);
}

function shakeForm() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        loginCard.style.animation = '';
    }, 500);
}

function handleSocialLogin(e) {
    const provider = e.currentTarget.textContent.includes('Google') ? 'Google' : 'Facebook';
    
    // Show loading state for social button
    const originalText = e.currentTarget.innerHTML;
    e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
    e.currentTarget.disabled = true;
    
    // Simulate social login
    setTimeout(() => {
        if (e.currentTarget) {
            e.currentTarget.innerHTML = originalText;
            e.currentTarget.disabled = false;
            
            // Show success message
            showSuccess();
        }
    }, 2000);
}

function handleForgotPassword(e) {
    e.preventDefault();
    alert('Forgot password functionality would be implemented here.\n\nIn a real application, this would:\n- Open a password reset form\n- Send a reset email\n- Redirect to a password reset page');
}

function handleSignUp(e) {
    e.preventDefault();
    alert('Sign up functionality would be implemented here.\n\nIn a real application, this would:\n- Redirect to a registration page\n- Open a sign up modal\n- Switch to a registration form');
}

// Add CSS animation for shake effect
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .input-wrapper input.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .input-wrapper.focused input {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
`;
document.head.appendChild(style);

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeElement = document.activeElement;
        
        if (activeElement === emailInput) {
            passwordInput.focus();
            e.preventDefault();
        } else if (activeElement === passwordInput) {
            loginForm.dispatchEvent(new Event('submit'));
            e.preventDefault();
        }
    }
});