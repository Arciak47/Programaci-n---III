# Gala Licores - Sistema E-commerce Premium

[![Deployment](https://img.shields.io/badge/Render-Deployed-success?logo=render&logoColor=white)](https://render.com)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

Este proyecto es una plataforma de comercio electrónico de lujo para **Gala Licores**, desarrollada como proyecto final. El sistema integra autenticación segura, gestión de inventario y un sistema de carrito de compras persistente.

---

## 📌 Tabla de Contenidos
1. [Resumen de Entregas](#-resumen-de-entregas)
2. [Instalación y Configuración](#-instalación-y-configuración)
3. [Evaluación 2: Autenticación](#-evaluación-2-autenticación)
4. [Evaluación 3: Catálogo y CRUD](#-evaluación-3-catálogo-y-crud)
5. [Evaluación 4: Carrito y Sesiones](#-evaluación-4-carrito-y-sesiones)
6. [Tecnologías Utilizadas](#-tecnologías-utilizadas)

---

## 🚀 Resumen de Entregas

El repositorio está organizado mediante **Git Tags** para facilitar la revisión de cada hito evaluativo:

| Evaluación | Tag | Descripción Principal |
| :--- | :--- | :--- |
| **E2: Auth** | `v2.0-auth` | Login, Registro, JWT, Bcrypt. |
| **E3: CRUD** | `v3.0-products` | Gestión de productos y Roles (Admin/User). |
| **E4: Cart** | `v4.0-cart` | Carrito persistente y totalización. |

---

## 🛠 Instalación y Configuración

### 1. Clonar y Dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd auth-system
npm install
```

### 2. Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:
```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb_atlas
JWT_SECRET=clave_secreta_para_tokens
```

---

## 🔐 Evaluación 2: Autenticación
**Objetivo:** Sistema de acceso seguro.

### Características implementadas:
- **Registro**: Formulario con validación de fuerza de contraseña y duplicados.
- **Login**: Autenticación basada en **JWT (JSON Web Token)**.
- **Seguridad**: Contraseñas encriptadas con **Bcryptjs** (Salt rounds: 10).
- **Protección**: Middleware de autenticación para rutas privadas.

### Cómo probar:
1. Ve a `/register.html` y crea una cuenta.
2. Inicia sesión en `/login.html`.
3. Revisa la consola del navegador (`Local Storage`) para ver el token generado.

---

## 📦 Evaluación 3: Catálogo y CRUD
**Objetivo:** Gestión de productos y roles.

### Características implementadas:
- **CRUD Completo**: El Administrador puede Crear, Leer, Actualizar y Eliminar productos.
- **Roles y Permisos**: 
  - `Admin`: Acceso al panel `/admin-products.html`.
  - `User`: Solo puede ver el catálogo y comprar.
- **Validaciones**: Control de tipos de datos en el servidor (Express-validator).

### Cómo probar:
1. Accede con un usuario con rol `admin`.
2. Ve al panel de administración y sube un nuevo producto con imagen.
3. Verifica que el producto aparece instantáneamente en el catálogo público.

---

## 🛒 Evaluación 4: Carrito y Sesiones
**Objetivo:** Experiencia de compra completa.

### Características implementadas:
- **Carrito Persistente**: Uso de `LocalStorage` segmentado por `User_ID`. Cada usuario tiene su propio carrito privado.
- **Gestión de Cantidades**: Botones de añadir/restar items con cálculo en tiempo real.
- **Totalización**: Desglose de precios y total final en el drawer del carrito.
- **Feedback**: Sistema de Notificaciones (Toasts) al agregar productos.

### Cómo probar:
1. Agrega varios licores al carrito.
2. Abre el carrito y ajusta las cantidades (verás que el total se actualiza).
3. Cierra sesión e inicia con otro usuario: **el carrito estará vacío**, demostrando el aislamiento de sesiones.

---

## 💻 Tecnologías Utilizadas

- **Backend**: Node.js, Express.
- **Frontend**: HTML5, Vanilla CSS (Premium Light Theme), JavaScript ES6.
- **Base de Datos**: MongoDB Atlas (Mongoose).
- **Seguridad**: JWT, Bcrypt, Helmet, CORS, Rate-Limit.
- **Despliegue**: Render.

---

**Desarrollado por:** [Tu Nombre] - 2026
