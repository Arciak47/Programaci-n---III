// Elementos del DOM
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const acceptTermsCheckbox = document.getElementById('acceptTerms');
const registerBtn = document.getElementById('registerBtn');
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const strengthBar = document.getElementById('strengthBar');
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

toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    toggleConfirmPassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Actualizar indicador de fuerza de contraseña
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    UIUtils.updatePasswordStrength(password, strengthBar);

    // Validar coincidencia de contraseñas si ya se ingresó la confirmación
    if (confirmPasswordInput.value) {
        validatePasswordMatch();
    }
});

// Validar coincidencia de contraseñas
function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.style.borderColor = 'rgba(245, 87, 108, 0.6)';
        return false;
    } else {
        confirmPasswordInput.style.borderColor = '';
        return true;
    }
}

confirmPasswordInput.addEventListener('input', validatePasswordMatch);

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

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const acceptTerms = acceptTermsCheckbox.checked;

    // Validar username
    if (!username) {
        showAlert('Por favor ingresa un nombre de usuario');
        usernameInput.focus();
        return false;
    }

    if (!ValidationUtils.isValidUsername(username)) {
        showAlert('El nombre de usuario solo puede contener letras, números y guiones bajos (3-30 caracteres)');
        usernameInput.focus();
        return false;
    }

    // Validar email
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

    // Validar contraseña
    if (!password) {
        showAlert('Por favor ingresa una contraseña');
        passwordInput.focus();
        return false;
    }

    if (!ValidationUtils.isValidPassword(password)) {
        showAlert('La contraseña debe tener al menos 6 caracteres e incluir mayúscula, minúscula y número');
        passwordInput.focus();
        return false;
    }

    // Validar confirmación de contraseña
    if (!confirmPassword) {
        showAlert('Por favor confirma tu contraseña');
        confirmPasswordInput.focus();
        return false;
    }

    if (password !== confirmPassword) {
        showAlert('Las contraseñas no coinciden');
        confirmPasswordInput.focus();
        return false;
    }

    // Validar términos
    if (!acceptTerms) {
        showAlert('Debes aceptar los términos y condiciones');
        return false;
    }

    return true;
}

// Manejar envío del formulario
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        // Mostrar estado de carga
        UIUtils.setButtonLoading(registerBtn, true);
        clearAlerts();

        // Intentar registro
        const response = await AuthService.register(username, email, password);

        // Mostrar mensaje de éxito
        showAlert('¡Cuenta creada exitosamente! Redirigiendo...', 'success');

        // Redirigir al catálogo
        setTimeout(() => {
            window.location.href = '/catalog.html';
        }, 1500);

    } catch (error) {
        // Mostrar error
        showAlert(error.message || 'Error al crear la cuenta. Por favor intenta de nuevo.');
        UIUtils.setButtonLoading(registerBtn, false);
    }
});

// Validación en tiempo real del username
usernameInput.addEventListener('blur', () => {
    const username = usernameInput.value.trim();
    if (username && !ValidationUtils.isValidUsername(username)) {
        usernameInput.style.borderColor = 'rgba(245, 87, 108, 0.6)';
    } else {
        usernameInput.style.borderColor = '';
    }
});

usernameInput.addEventListener('input', () => {
    usernameInput.style.borderColor = '';
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
usernameInput.addEventListener('input', clearAlerts);
emailInput.addEventListener('input', clearAlerts);
passwordInput.addEventListener('input', clearAlerts);
confirmPasswordInput.addEventListener('input', clearAlerts);
