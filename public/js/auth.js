// Servicio de autenticación
const AuthService = {
    // URL base de la API
    API_URL: '/api/auth',

    // Obtener token del localStorage
    getToken() {
        return localStorage.getItem('authToken');
    },

    // Guardar token en localStorage
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    // Guardar información del usuario
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Obtener información del usuario
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Eliminar token y usuario (logout)
    clearAuth() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!this.getToken();
    },

    // Headers con autenticación
    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },

    // Registro de usuario
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar usuario');
            }

            // Guardar token y usuario
            if (data.token) {
                this.setToken(data.token);
                this.setUser(data.user);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Login de usuario
    async login(email, password) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // Guardar token y usuario
            if (data.token) {
                this.setToken(data.token);
                this.setUser(data.user);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Verificar token
    async verifyToken() {
        try {
            const response = await fetch(`${this.API_URL}/verify`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                this.clearAuth();
                return false;
            }

            return data.success;
        } catch (error) {
            this.clearAuth();
            return false;
        }
    },

    // Obtener perfil del usuario
    async getProfile() {
        try {
            const response = await fetch(`${this.API_URL}/profile`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener perfil');
            }

            // Actualizar información local del usuario con los datos frescos del servidor
            if (data.user) {
                this.setUser(data.user);
            }

            return data.user;
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout() {
        this.clearAuth();
        window.location.href = '/login.html';
    }
};

// Utilidades de validación
const ValidationUtils = {
    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validar username
    isValidUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username);
    },

    // Validar fuerza de contraseña
    getPasswordStrength(password) {
        if (password.length < 6) return 'weak';

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

        if (strength <= 2) return 'weak';
        if (strength === 3) return 'medium';
        return 'strong';
    },

    // Validar contraseña
    isValidPassword(password) {
        if (password.length < 6) return false;

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);

        return hasLower && hasUpper && hasNumber;
    }
};

// Utilidades de UI
const UIUtils = {
    // Mostrar alerta
    showAlert(message, type = 'error') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;

        return alertDiv;
    },

    // Mostrar estado de carga en botón
    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('btn-loading');
            button.dataset.originalText = button.textContent;
            button.textContent = 'Cargando...';
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
            button.textContent = button.dataset.originalText || button.textContent;
        }
    },

    // Actualizar indicador de fuerza de contraseña
    updatePasswordStrength(password, strengthBar) {
        if (!strengthBar) return;

        const strength = ValidationUtils.getPasswordStrength(password);

        strengthBar.className = 'password-strength-bar';
        strengthBar.classList.add(`strength-${strength}`);
    }
};
