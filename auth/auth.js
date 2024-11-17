document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Toggle eye icon
            const iconName = type === 'password' ? 'eye' : 'eye-off';
            this.src = `https://api.iconify.design/mdi:${iconName}.svg`;
        });
    });

    // Form validation
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Basic validation
            if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                return;
            }

            let user = {email: email, password: password};
            user = JSON.stringify(user);

            $.ajax({
                url: 'http://localhost:8082/cms/api/v1/auth/signin',
                type: 'POST',
                data: user,
                headers: { "Content-Type": "application/json" },
                success: (response) => {
                    document.cookie = "token=" + response.token;
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', email);
                    window.location.href = 'home/home.html';
                },
                error: (xhr, status, error) => {
                    console.log(xhr.responseText);
                }
            });


        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('role').value;
            const code = document.getElementById('code').value;

            // Basic validation
            if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                showError('confirmPassword', 'Passwords do not match');
                return;
            }

            if (role === '') {
                showError('role', 'Please select a role');
                return;
            }

            if (code === '') {
                showError('code', 'Please enter a code');
                return;
            }

            let user = {email: email, password: password, role: role, roleCode: code};
            user = JSON.stringify(user);

            $.ajax({
                url: 'http://localhost:8082/cms/api/v1/auth/signup',
                type: 'POST',
                data: user,
                headers: { "Content-Type": "application/json" },
                success: (response) => {
                    document.cookie = "token=" + response.token;
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', email);
                    window.location.href = '../home/home.html';
                },
                error: (xhr, status, error) => {
                    console.log(xhr.responseText);
                }
            });

        });
    }

    // Social auth buttons
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Microsoft';
            simulateAuth(`Connecting to ${provider}...`, () => {
                window.location.href = 'home/home.html';
            });
        });
    });
});

// Helper functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const inputGroup = input.parentElement;
    const existingError = inputGroup.parentElement.querySelector('.error-message');

    inputGroup.classList.add('error');

    if (!existingError) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        inputGroup.parentElement.appendChild(errorDiv);
    }

    // Remove error after 3 seconds
    setTimeout(() => {
        inputGroup.classList.remove('error');
        if (existingError) {
            existingError.remove();
        }
    }, 3000);
}

function simulateAuth(message, callback) {
    const button = document.querySelector('.auth-button');
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = message;

    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        callback();
    }, 1500);
}