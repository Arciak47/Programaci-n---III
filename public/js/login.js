// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const togglePassword = document.getElementById('togglePassword');
const alertContainer = document.getElementById('alertContainer');

// Redirigir si ya está autenticado
if (AuthService.isAuthenticated()) {
    window.location.href = '/catalog.html';
}

// Toggle mostrar/ocultar contraseña
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Limpiar alertas
function clearAlerts() {
    alertContainer.innerHTML = '';
}

// Mostrar alerta
function showAlert(message, type = 'error') {
    clearAlerts();
    const alert = UIUtils.showAlert(message, type);
    alertContainer.appendChild(alert);
}

// Validar formulario
function validateForm() {
    clearAlerts();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
        showAlert('Por favor ingresa tu email');
        emailInput.focus();
        return false;
    }

    if (!ValidationUtils.isValidEmail(email)) {
        showAlert('Por favor ingresa un email válido');
        emailInput.focus();
        return false;
    }

    if (!password) {
        showAlert('Por favor ingresa tu contraseña');
        passwordInput.focus();
        return false;
    }

    if (password.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres');
        passwordInput.focus();
        return false;
    }

    return true;
}

// Manejar envío del formulario
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        // Mostrar estado de carga
        UIUtils.setButtonLoading(loginBtn, true);
        clearAlerts();

        // Intentar login
        const response = await AuthService.login(email, password);

        // Mostrar mensaje de éxito
        showAlert('¡Login exitoso! Redirigiendo...', 'success');

        // Redirigir al catálogo
        setTimeout(() => {
            window.location.href = '/catalog.html';
        }, 1000);

    } catch (error) {
        // Mostrar error
        showAlert(error.message || 'Error al iniciar sesión. Por favor intenta de nuevo.');
        UIUtils.setButtonLoading(loginBtn, false);
    }
});

// Validación en tiempo real del email
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (email && !ValidationUtils.isValidEmail(email)) {
        emailInput.style.borderColor = 'rgba(245, 87, 108, 0.6)';
    } else {
        emailInput.style.borderColor = '';
    }
});

emailInput.addEventListener('input', () => {
    emailInput.style.borderColor = '';
});

// Limpiar alertas al escribir
emailInput.addEventListener('input', clearAlerts);
passwordInput.addEventListener('input', clearAlerts);
